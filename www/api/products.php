<?php
/**
 * Veřejný read-only seznam produktů.
 *
 * GET ?category=slug&search=text
 *
 * Bezpečnost:
 *   - Same-origin CORS (žádný wildcard)
 *   - Parametry filtrované regexem před prepared query
 *   - LIMIT 100 — bránění abuse
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

    $category = isset($_GET['category'])
        ? preg_replace('/[^a-z0-9-]/', '', strtolower((string)$_GET['category']))
        : '';

    // Povolíme českou diakritiku + alfanumerika + mezery a pomlčky, max 80 znaků
    $rawSearch = (string)($_GET['search'] ?? '');
    $search = trim(preg_replace('/[^\p{L}\p{N}\s\-]/u', '', $rawSearch));
    if (mb_strlen($search) > 80) $search = mb_substr($search, 0, 80);

    $sql    = "SELECT p.id, p.name, p.slug, p.description, p.price, p.stock_quantity,
                      p.image_url, c.name AS category_name, c.slug AS category_slug
               FROM products p
               LEFT JOIN categories c ON p.category_id = c.id
               WHERE p.is_active = 1";
    $params = [];

    if ($category !== '') {
        $sql .= " AND c.slug = ?";
        $params[] = $category;
    }
    if ($search !== '') {
        $sql .= " AND (p.name LIKE ? OR p.description LIKE ?)";
        $like = '%' . $search . '%';
        $params[] = $like;
        $params[] = $like;
    }

    $sql .= " ORDER BY p.created_at DESC LIMIT 100";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode([
        'success'  => true,
        'products' => $stmt->fetchAll(),
    ]);
} catch (Throwable $e) {
    error_log('[products] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error']);
}
