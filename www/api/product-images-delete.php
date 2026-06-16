<?php
/**
 * Smazat fotografii produktu (admin only).
 *
 * POST application/json:
 *   { image_id: int, csrf_token: "..." }
 *
 * Bezpečnost:
 *   - requireAdmin()
 *   - CSRF token v JSON tělu
 *   - Z disku soubor NEMAŽEME — je to galerie, ne unikátní upload.
 *     Vyčistění osiřelých souborů řešte případně cronem mimo HTTP requesty.
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

$imageId = isset($data['image_id']) ? (int)$data['image_id'] : 0;
if ($imageId <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing image_id']);
    exit;
}

try {
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("DELETE FROM product_images WHERE id = ?");
    $stmt->execute([$imageId]);
    echo json_encode(['success' => true]);
} catch (Throwable $e) {
    error_log('[product-images-delete] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error']);
}
