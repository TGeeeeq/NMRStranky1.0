<?php
/**
 * Potvrzení objednávky + instrukce k bankovnímu převodu.
 *
 * Sem zákazník přistane po POST na /api/create-order.php
 * (JS pošle ?order=NMR-… do tohoto URL).
 *
 * Bezpečnost:
 *   - Neukazujeme adresu / telefon / email v URL — jen číslo objednávky
 *   - Číslo objednávky chráníme regexem (žádné SQLi přes URL)
 *   - Žádné citlivé info v případě, že objednávka neexistuje
 */

declare(strict_types=1);

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../config/payment.php';

$orderNumber = trim((string)($_GET['order'] ?? ''));
$order = null;

if (preg_match('/^[A-Z0-9-]{6,40}$/', $orderNumber)) {
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare(
            "SELECT order_number, variable_symbol, total_amount, customer_name, status
             FROM orders WHERE order_number = ? LIMIT 1"
        );
        $stmt->execute([$orderNumber]);
        $order = $stmt->fetch();
    } catch (Throwable $e) {
        error_log('[payment-return] ' . $e->getMessage());
    }
}

$bank      = getBankTransferDetails();
$totalFmt  = $order ? number_format((float)$order['total_amount'], 0, ',', ' ') : '';
?>
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex,nofollow">
    <title>Potvrzení objednávky – Nech mě růst</title>
    <link rel="stylesheet" href="../styles.css">
    <link rel="stylesheet" href="../css/shop.css">
    <link rel="icon" type="image/png" href="../assets/logo.png">
    <style>
        .result-card {
            max-width: 720px;
            margin: 80px auto;
            padding: 40px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,.08);
        }
        .result-card h1 { color: #2a7f3e; margin-top: 0; }
        .check {
            width: 64px; height: 64px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 50%; background: #2a7f3e; color: #fff;
            font-size: 32px; margin: 0 auto 20px;
        }
        .bank-box {
            background: #f6faf5;
            border: 1px solid #d6eccd;
            padding: 20px 24px;
            border-radius: 12px;
            margin: 24px 0;
        }
        .bank-box dl { display: grid; grid-template-columns: 160px 1fr; gap: 8px 16px; margin: 0; }
        .bank-box dt { font-weight: 600; color: #555; }
        .bank-box dd { margin: 0; font-family: ui-monospace, monospace; word-break: break-all; }
        .vs { font-size: 1.3rem; color: #c0392b; font-weight: 700; }
        .copy-btn { background: none; border: 1px solid #ccc; border-radius: 6px; padding: 2px 8px; margin-left: 8px; cursor: pointer; font-size: 0.85em; }
        .note { background: #fff7e6; border-left: 4px solid #f4a823; padding: 14px 18px; border-radius: 6px; margin: 20px 0; }
        .actions { text-align: center; margin-top: 28px; }
        @media (max-width: 600px) {
            .bank-box dl { grid-template-columns: 1fr; }
            .bank-box dt { margin-top: 8px; }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="../index.html"><img src="../assets/logo.png" alt="Nech mě růst" class="logo"></a>
            </div>
        </div>
    </nav>

    <main class="result-card">
        <?php if ($order): ?>
            <div class="check">✓</div>
            <h1>Děkujeme za vaši objednávku!</h1>

            <p>
                Vaše objednávka <strong>č. <?= htmlspecialchars($order['order_number']) ?></strong>
                byla úspěšně přijata. Potvrzení s těmito údaji jsme vám zároveň poslali
                e-mailem.
            </p>

            <div class="bank-box">
                <h2 style="margin-top:0;">Platba bankovním převodem</h2>
                <dl>
                    <?php if ($bank['bank_name']): ?>
                        <dt>Banka:</dt>     <dd><?= htmlspecialchars($bank['bank_name']) ?></dd>
                    <?php endif; ?>
                    <?php if ($bank['account']): ?>
                        <dt>Číslo účtu:</dt><dd><?= htmlspecialchars($bank['account']) ?>
                            <button class="copy-btn" type="button" data-copy="<?= htmlspecialchars($bank['account'], ENT_QUOTES) ?>">kopírovat</button>
                        </dd>
                    <?php endif; ?>
                    <?php if ($bank['iban']): ?>
                        <dt>IBAN:</dt>      <dd><?= htmlspecialchars($bank['iban']) ?>
                            <button class="copy-btn" type="button" data-copy="<?= htmlspecialchars($bank['iban'], ENT_QUOTES) ?>">kopírovat</button>
                        </dd>
                    <?php endif; ?>
                    <?php if ($bank['swift']): ?>
                        <dt>SWIFT/BIC:</dt> <dd><?= htmlspecialchars($bank['swift']) ?></dd>
                    <?php endif; ?>
                    <dt>Variabilní symbol:</dt>
                    <dd class="vs"><?= htmlspecialchars($order['variable_symbol']) ?>
                        <button class="copy-btn" type="button" data-copy="<?= htmlspecialchars($order['variable_symbol'], ENT_QUOTES) ?>">kopírovat</button>
                    </dd>
                    <dt>Částka:</dt>
                    <dd><strong><?= htmlspecialchars($totalFmt) ?> Kč</strong></dd>
                </dl>
            </div>

            <div class="note">
                <strong>Jakmile platbu obdržíme</strong> (obvykle do 1–2 pracovních dnů),
                začneme objednávku připravovat a dáme vám vědět e-mailem.
                Při komunikaci uvádějte prosím číslo objednávky.
            </div>

        <?php else: ?>
            <h1>Objednávka nenalezena</h1>
            <p>Číslo objednávky neexistuje nebo bylo zadáno chybně.
               Pokud jste objednávku právě dokončili, počkejte prosím chvíli
               a stránku obnovte. V případě problému nás kontaktujte na
               <a href="mailto:info@nechmerust.org">info@nechmerust.org</a>.</p>
        <?php endif; ?>

        <div class="actions">
            <a href="index.html" class="btn btn-primary">Zpět do obchodu</a>
            <a href="../index.html" class="btn">Domů</a>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2026 Nech mě růst z.s.</p>
        </div>
    </footer>

    <script>
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(btn.dataset.copy);
                    const orig = btn.textContent;
                    btn.textContent = 'zkopírováno ✓';
                    setTimeout(() => btn.textContent = orig, 1500);
                } catch (_) { /* fallback: označit text */ }
            });
        });
    </script>
</body>
</html>
