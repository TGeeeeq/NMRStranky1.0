<?php
/**
 * Vytvoří objednávku v DB a odešle potvrzovací maily.
 *
 * Bezpečnost:
 *   - Ceny se NEČTOU od klienta — vždy se naberou z DB podle product_id
 *   - PDO prepared statements
 *   - Rate limit per session
 *   - Origin restriction (Same-Origin) místo wildcardu
 *   - Žádné stack-trace v JSON odpovědi (chyby do error_log)
 *   - Bankovní údaje + admin email z .env
 *
 * Vstup: POST application/json
 *   {
 *     "customer_name":  "Jan Novák",
 *     "customer_email": "x@y.cz",
 *     "customer_phone": "+420…",
 *     "shipping_address": "Ulice 1, 110 00 Praha",
 *     "payment_method": "bank_transfer",
 *     "notes": "…",
 *     "items": [ { "product_id": 5, "quantity": 2 }, … ]
 *   }
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

require_once __DIR__ . '/../config.php';

// --- CORS: pouze stejný host ---------------------------------------------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedHost = $_SERVER['HTTP_HOST'] ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) === $allowedHost) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// --- Rate limit ----------------------------------------------------------
$ip = get_client_ip();
if (!check_rate_limit("order_{$ip}", 5, 60)) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'error'   => 'Příliš mnoho požadavků. Zkuste to znovu za chvíli.',
    ]);
    exit;
}

// --- Načtení & validace vstupu ------------------------------------------
$json = file_get_contents('php://input');
$data = json_decode($json ?: '', true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Neplatná data.']);
    exit;
}

foreach (['customer_name', 'customer_email', 'shipping_address', 'items'] as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Chybí pole: $field"]);
        exit;
    }
}

$customer_name  = mb_substr(sanitize_input($data['customer_name']),    0, 100);
$customer_email = filter_var($data['customer_email'], FILTER_VALIDATE_EMAIL);
$customer_phone = mb_substr(sanitize_input($data['customer_phone'] ?? ''), 0, 30);
$shipping_addr  = mb_substr(sanitize_input($data['shipping_address']), 0, 500);
$notes          = mb_substr(sanitize_input($data['notes'] ?? ''),       0, 1000);

if (!$customer_email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Neplatný e-mail.']);
    exit;
}

// Aktuálně podporujeme jen bankovní převod
$payment_method = 'bank_transfer';

if (!is_array($data['items']) || empty($data['items']) || count($data['items']) > 50) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Neplatné položky objednávky.']);
    exit;
}

// --- Vytvoření objednávky ------------------------------------------------
$config       = getAppConfig();
$orderPrefix  = preg_replace('/[^A-Z0-9]/', '', strtoupper($config['shop']['order_prefix'] ?? 'NMR'));
if ($orderPrefix === '') $orderPrefix = 'NMR';

$orderNumber  = $orderPrefix . '-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
$varSymbol    = preg_replace('/[^0-9]/', '', $orderNumber);
$varSymbol    = substr($varSymbol, 0, 10) ?: (string)random_int(1000000000, 9999999999);

try {
    $pdo = getDbConnection();
    $pdo->beginTransaction();

    // 1) Načti reálné ceny + dostupnost
    $total_amount = 0.0;
    $itemsListText = '';
    $itemsForMail  = [];

    $prodStmt = $pdo->prepare(
        "SELECT id, name, price, stock_quantity FROM products WHERE id = ? AND is_active = 1"
    );

    $resolvedItems = [];
    foreach ($data['items'] as $item) {
        $product_id = isset($item['product_id']) ? (int)$item['product_id'] : 0;
        $qty        = isset($item['quantity'])   ? max(1, min(100, (int)$item['quantity'])) : 0;
        if ($product_id <= 0 || $qty <= 0) continue;

        $prodStmt->execute([$product_id]);
        $product = $prodStmt->fetch();
        if (!$product) continue;

        if ((int)$product['stock_quantity'] >= 0 && $qty > (int)$product['stock_quantity']) {
            // Volitelná kontrola skladu — neblokujeme pokud sklad = 0 a admin to nehlídá,
            // pokud chcete tvrdou kontrolu, odkomentujte:
            // throw new RuntimeException("Produkt '{$product['name']}' není v dostatečném množství skladem.");
        }

        $unit_price  = (float)$product['price'];
        $line_total  = round($unit_price * $qty, 2);
        $total_amount += $line_total;

        $resolvedItems[] = [
            'product_id'  => (int)$product['id'],
            'product_name' => (string)$product['name'],
            'quantity'    => $qty,
            'unit_price'  => $unit_price,
            'total_price' => $line_total,
        ];

        $itemsListText .= sprintf(
            "- %s (%d×): %s Kč\n",
            $product['name'], $qty, number_format($line_total, 0, ',', ' ')
        );
    }

    if ($total_amount <= 0 || empty($resolvedItems)) {
        throw new RuntimeException('Neplatná částka objednávky.');
    }

    // 2) Vlož objednávku
    $stmt = $pdo->prepare("
        INSERT INTO orders (
            order_number, variable_symbol, customer_name, customer_email, customer_phone,
            shipping_address, total_amount, payment_method, notes, customer_ip, status, payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')
    ");
    $stmt->execute([
        $orderNumber, $varSymbol, $customer_name, $customer_email, $customer_phone,
        $shipping_addr, $total_amount, $payment_method, $notes, $ip,
    ]);
    $orderId = (int)$pdo->lastInsertId();

    // 3) Vlož položky s reálným order_id (žádné UPDATE … WHERE order_id IS NULL chyby)
    $itemStmt = $pdo->prepare("
        INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    foreach ($resolvedItems as $r) {
        $itemStmt->execute([
            $orderId, $r['product_id'], $r['product_name'],
            $r['quantity'], $r['unit_price'], $r['total_price'],
        ]);
    }

    $pdo->commit();

    // 4) Pošli maily (selhání mailu nesmí zrušit objednávku)
    sendOrderEmails($config, [
        'order_number'   => $orderNumber,
        'variable_symbol'=> $varSymbol,
        'customer_name'  => $customer_name,
        'customer_email' => $customer_email,
        'customer_phone' => $customer_phone,
        'shipping_addr'  => $shipping_addr,
        'notes'          => $notes,
        'items_text'     => $itemsListText,
        'total_amount'   => $total_amount,
    ]);

    echo json_encode([
        'success'         => true,
        'order_number'    => $orderNumber,
        'variable_symbol' => $varSymbol,
        'total'           => $total_amount,
        'bank' => [
            'account' => $config['bank']['account_number'],
            'iban'    => $config['bank']['iban'],
            'swift'   => $config['bank']['swift'],
            'name'    => $config['bank']['bank_name'],
        ],
    ]);

} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('[create-order] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        // Genericzká zpráva — žádné DB error stringy ven
        'error'   => 'Chyba při zpracování objednávky. Zkuste to prosím znovu.',
    ]);
}

// ============================================================================
// Mail helper
// ============================================================================
function sendOrderEmails(array $config, array $order): void {
    $bank = $config['bank'];
    $smtp = $config['smtp'];
    $adminEmail = $config['admin']['notification_email'] ?? $smtp['FromEmail'];

    $totalFmt = number_format($order['total_amount'], 0, ',', ' ');
    $bankBlock = sprintf(
        "%s%s%s%s",
        $bank['bank_name']     ? "Banka:           {$bank['bank_name']}\n" : '',
        $bank['account_number']? "Číslo účtu:      {$bank['account_number']}\n" : '',
        $bank['iban']          ? "IBAN:            {$bank['iban']}\n" : '',
        $bank['swift']         ? "SWIFT:           {$bank['swift']}\n" : ''
    );

    $customerBody = "Děkujeme za vaši objednávku!\n\n"
        . "Číslo objednávky: {$order['order_number']}\n\n"
        . "Položky:\n{$order['items_text']}\n"
        . "Celkem: {$totalFmt} Kč\n\n"
        . "PLATEBNÍ ÚDAJE (bankovní převod):\n"
        . $bankBlock
        . "Variabilní symbol: {$order['variable_symbol']}\n"
        . "Částka:            {$totalFmt} Kč\n\n"
        . "Jakmile platbu obdržíme, začneme objednávku připravovat.\n\n"
        . "S úctou,\nTým Nech mě růst";

    $adminBody = "NOVÁ OBJEDNÁVKA: {$order['order_number']}\n\n"
        . "Zákazník: {$order['customer_name']} <{$order['customer_email']}>\n"
        . "Telefon:  {$order['customer_phone']}\n"
        . "Adresa:   {$order['shipping_addr']}\n\n"
        . "Položky:\n{$order['items_text']}\n"
        . "Celkem: {$totalFmt} Kč\n"
        . "Variabilní symbol: {$order['variable_symbol']}\n\n"
        . "Poznámka:\n{$order['notes']}\n";

    // Pokud je PHPMailer (vendor/) k dispozici, použij ho; jinak fallback na mail().
    $usedPhpMailer = false;
    if (is_file(__DIR__ . '/../vendor/autoload.php')) {
        try {
            require_once __DIR__ . '/../vendor/autoload.php';
            if (class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
                sendPhpMailer($smtp, $order['customer_email'], $order['customer_name'],
                    "Potvrzení objednávky {$order['order_number']} – Nech mě růst", $customerBody);
                sendPhpMailer($smtp, $adminEmail, 'Admin',
                    "NOVÁ OBJEDNÁVKA: {$order['order_number']}", $adminBody);
                $usedPhpMailer = true;
            }
        } catch (Throwable $e) {
            error_log('[mailer] PHPMailer failed: ' . $e->getMessage());
        }
    }

    if (!$usedPhpMailer) {
        // Fallback: nativní mail() — Forpsi standardně podporuje
        $headers = "From: " . $smtp['FromName'] . " <" . $smtp['FromEmail'] . ">\r\n"
                 . "Content-Type: text/plain; charset=utf-8\r\n"
                 . "MIME-Version: 1.0\r\n";
        @mail($order['customer_email'],
              "=?UTF-8?B?" . base64_encode("Potvrzení objednávky {$order['order_number']} – Nech mě růst") . "?=",
              $customerBody, $headers);
        @mail($adminEmail,
              "=?UTF-8?B?" . base64_encode("NOVÁ OBJEDNÁVKA: {$order['order_number']}") . "?=",
              $adminBody, $headers);
    }
}

function sendPhpMailer(array $smtp, string $to, string $toName, string $subject, string $body): void {
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $smtp['Host'];
    $mail->SMTPAuth   = $smtp['SMTPAuth'];
    $mail->Username   = $smtp['Username'];
    $mail->Password   = $smtp['Password'];
    $mail->SMTPSecure = $smtp['SMTPSecure'];
    $mail->Port       = $smtp['Port'];
    $mail->CharSet    = 'UTF-8';
    $mail->setFrom($smtp['FromEmail'], $smtp['FromName']);
    $mail->addAddress($to, $toName);
    $mail->Subject = $subject;
    $mail->Body    = $body;
    $mail->isHTML(false);
    $mail->send();
}
