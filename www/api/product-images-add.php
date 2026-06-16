<?php
/**
 * Přidat fotografii produktu (admin only).
 *
 * POST application/json:
 *   { product_id: int, image_url: "/images/products/foo.webp", csrf_token: "..." }
 *
 * Bezpečnost:
 *   - requireAdmin()
 *   - CSRF token v JSON tělu
 *   - URL musí být relativní cesta v /images/ nebo /assets/ s povolenou příponou
 *     (nikoli http(s):// → zabraňujeme hot-linkingu externích obrázků
 *      a CSP/zabezpečení obrázků zůstává v naší doméně).
 *   - PDO prepared statements
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

require_once __DIR__ . '/../config.php';
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

if (!verify_csrf_token($data['csrf_token'] ?? null)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Invalid CSRF token']);
    exit;
}

$productId = isset($data['product_id']) ? (int)$data['product_id'] : 0;
$imageUrl  = trim((string)($data['image_url'] ?? ''));

if ($productId <= 0 || $imageUrl === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

// Whitelist: jen lokální cesty s povolenou příponou
if (!preg_match('#^/(?:images|assets)/[\w\-./]+\.(?:jpg|jpeg|png|webp)$#i', $imageUrl)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Neplatná URL obrázku.']);
    exit;
}

try {
    $pdo = getDbConnection();

    // Ověř že produkt existuje
    $stmt = $pdo->prepare("SELECT id FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Produkt nenalezen.']);
        exit;
    }

    // Další pořadí
    $stmt = $pdo->prepare("SELECT COALESCE(MAX(display_order), -1) + 1 FROM product_images WHERE product_id = ?");
    $stmt->execute([$productId]);
    $nextOrder = (int)$stmt->fetchColumn();

    $stmt = $pdo->prepare("
        INSERT INTO product_images (product_id, image_url, display_order)
        VALUES (?, ?, ?)
    ");
    $stmt->execute([$productId, $imageUrl, $nextOrder]);

    echo json_encode([
        'success'  => true,
        'image_id' => (int)$pdo->lastInsertId(),
    ]);
} catch (Throwable $e) {
    error_log('[product-images-add] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error']);
}
