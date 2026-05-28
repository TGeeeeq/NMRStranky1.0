<?php
/**
 * Veřejný read-only seznam kategorií (s počtem aktivních produktů).
 *
 * Same-origin CORS, žádný wildcard.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host   = $_SERVER['HTTP_HOST']   ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) === $host) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../config/database.php';

try {
    $pdo = getDbConnection();
    $rows = $pdo->query("
        SELECT c.id, c.name, c.slug, c.description, c.display_order,
               COUNT(CASE WHEN p.is_active = 1 THEN p.id END) AS product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        GROUP BY c.id
        ORDER BY c.display_order, c.name
    ")->fetchAll();

    echo json_encode(['success' => true, 'categories' => $rows]);
} catch (Throwable $e) {
    error_log('[categories] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error']);
}
