<?php
/**
 * Bezpečný upload obrázku produktu.
 *
 * Bezpečnost:
 *   - Vyžaduje přihlášeného admina (requireAdmin)
 *   - CSRF token v multipart formuláři
 *   - Whitelist MIME (JPEG/PNG/WebP) ověřený přes finfo
 *   - Whitelist přípon (.jpg/.jpeg/.png/.webp)
 *   - Max velikost 5 MB
 *   - Náhodné jméno souboru (žádné user-input v cestě)
 *   - Upload jen do /images/products/ — žádné ../ tricky
 *   - Pokud je k dispozici GD/Imagick, znovu zakódujeme obrázek
 *     (to spolehlivě zabije polyglot soubory s embedded PHP)
 *
 * Vrací JSON: { success: true, image_url: "/images/products/abc.jpg" }
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

// CSRF
$token = $_POST['csrf_token'] ?? '';
if (!verify_csrf_token($token)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Neplatný CSRF token.']);
    exit;
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $code = $_FILES['image']['error'] ?? 'missing';
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => "Upload selhal (kód: $code)."]);
    exit;
}

$file = $_FILES['image'];

// Velikost
$maxBytes = 5 * 1024 * 1024; // 5 MB
if ($file['size'] > $maxBytes) {
    http_response_code(413);
    echo json_encode(['success' => false, 'error' => 'Maximální velikost je 5 MB.']);
    exit;
}

// MIME — ověřit přes finfo, ne přes user-supplied $_FILES['type']
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']);

$allowed = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
];

if (!isset($allowed[$mime])) {
    http_response_code(415);
    echo json_encode(['success' => false, 'error' => 'Povolené formáty: JPG, PNG, WebP.']);
    exit;
}

$ext = $allowed[$mime];

// Cílový adresář (absolutní, mimo dosah ../)
$targetDir  = realpath(__DIR__ . '/../images/products');
if ($targetDir === false) {
    // Pokud neexistuje, zkus vytvořit (jen pokud parent existuje)
    $parent = realpath(__DIR__ . '/../images');
    if ($parent !== false) {
        @mkdir($parent . '/products', 0755, true);
        $targetDir = realpath($parent . '/products');
    }
}
if ($targetDir === false || !is_writable($targetDir)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Cílový adresář není zapisovatelný.']);
    exit;
}

// Náhodný název souboru — vylučujeme jakýkoli user input v cestě
$basename = bin2hex(random_bytes(8)) . '-' . date('YmdHis') . '.' . $ext;
$destFs   = $targetDir . DIRECTORY_SEPARATOR . $basename;
$destUrl  = '/images/products/' . $basename;

// Sanitization: pokud máme GD, raději obrázek znovu zakóduj (zničí embedded PHP)
$reencoded = false;
if (function_exists('imagecreatefromstring')) {
    $imgData = @file_get_contents($file['tmp_name']);
    if ($imgData !== false) {
        $im = @imagecreatefromstring($imgData);
        if ($im !== false) {
            switch ($ext) {
                case 'jpg':  $reencoded = @imagejpeg($im, $destFs, 90); break;
                case 'png':  $reencoded = @imagepng($im, $destFs, 6);   break;
                case 'webp': $reencoded = function_exists('imagewebp') ? @imagewebp($im, $destFs, 90) : false; break;
            }
            imagedestroy($im);
        }
    }
}

// Fallback: pokud GD selhalo, prostě přesuneme původní soubor
if (!$reencoded) {
    if (!move_uploaded_file($file['tmp_name'], $destFs)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Soubor se nepodařilo uložit.']);
        exit;
    }
}

@chmod($destFs, 0644);

echo json_encode([
    'success'   => true,
    'image_url' => $destUrl,
    'filename'  => $basename,
]);
