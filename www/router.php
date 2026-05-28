<?php
/**
 * Dev-only router for php -S.
 * Mirrors the production .htaccess rewrite rules so clean URLs (/foo) work
 * locally without Apache. Forpsi (production) uses .htaccess; this file is
 * never invoked there.
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$root = __DIR__;

// 1) Real file/dir exists → let php -S serve it directly (return false).
if ($uri !== '/' && file_exists($root . $uri) && !is_dir($root . $uri)) {
    return false;
}

// 2) Directory → look for index.php or index.html inside.
if ($uri === '/' || (is_dir($root . $uri))) {
    $base = rtrim($uri, '/');
    foreach (['/index.php', '/index.html'] as $idx) {
        if (file_exists($root . $base . $idx)) {
            require $root . $base . $idx;
            return true;
        }
    }
    http_response_code(404);
    require $root . '/404.html';
    return true;
}

// 3) Try /foo.php then /foo.html.
foreach (['.php', '.html'] as $ext) {
    $candidate = $root . $uri . $ext;
    if (file_exists($candidate)) {
        require $candidate;
        return true;
    }
}

// 4) Not found.
http_response_code(404);
if (file_exists($root . '/404.html')) {
    require $root . '/404.html';
} else {
    echo '404 Not Found';
}
return true;
