<?php
/**
 * Platební logika.
 *
 * Aktuálně podporujeme pouze BANKOVNÍ PŘEVOD — žádné externí brány
 * (GoPay/Stripe/ComGate), kvůli minimální závislosti a auditovatelnosti.
 *
 * Pokud byste v budoucnu chtěli přidat online platby, vraťte sem
 * adaptér + .env klíče. Do té doby ne necháváme prázdné konstanty
 * navenek, aby útočník nemohl vyrozumět co je / není v provozu.
 */

declare(strict_types=1);

require_once __DIR__ . '/database.php';

/**
 * Vygeneruje variabilní symbol z čísla objednávky (10místný).
 */
function generateVariableSymbol(string $orderNumber): string {
    $digits = preg_replace('/[^0-9]/', '', $orderNumber);
    if ($digits === '' || $digits === null) {
        $digits = (string)random_int(1000000000, 9999999999);
    }
    return substr($digits, 0, 10);
}

/**
 * Vrátí strukturované údaje pro bankovní převod (z .env).
 */
function getBankTransferDetails(): array {
    $config = getAppConfig();
    return [
        'bank_name' => $config['bank']['bank_name'] ?? '',
        'account'   => $config['bank']['account_number'] ?? '',
        'iban'      => $config['bank']['iban'] ?? '',
        'swift'     => $config['bank']['swift'] ?? '',
    ];
}
