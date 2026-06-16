<?php
/**
 * Vrátí bankovní údaje pro existující objednávku.
 *
 * Používá se na potvrzovací stránce v /obchod/. Neztrácí citlivá data —
 * pouze veřejné bankovní údaje + VS, které stejně jdou klientovi mailem.
 *
 * GET ?order_number=NMR-20260511-ABCDEF
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../config/payment.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$orderNumber = trim((string)($_GET['order_number'] ?? ''));
if (!preg_match('/^[A-Z0-9-]{6,40}$/', $orderNumber)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid order number']);
    exit;
}

try {
    $pdo  = getDbConnection();
    $stmt = $pdo->prepare(
        "SELECT order_number, variable_symbol, total_amount, payment_status
         FROM orders
         WHERE order_number = ?
         LIMIT 1"
    );
    $stmt->execute([$orderNumber]);
    $order = $stmt->fetch();

    if (!$order) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Order not found']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'order'   => [
            'order_number'    => $order['order_number'],
            'variable_symbol' => $order['variable_symbol'],
            'total_amount'    => (float)$order['total_amount'],
            'payment_status'  => $order['payment_status'],
        ],
        'bank' => getBankTransferDetails(),
    ]);

} catch (Throwable $e) {
    error_log('[create-payment] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error']);
}
