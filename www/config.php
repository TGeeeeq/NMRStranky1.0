<?php
/**
 * Main security / session helpers.
 *
 * Loads env, starts a secure session, and provides:
 *   - CSRF token: csrf_token(), verify_csrf_token(), csrf_field()
 *   - Admin auth: isAdminLoggedIn(), requireAdmin(), adminLogin(), adminLogout()
 *   - Client IP + session-backed rate limiting
 *
 * NOTE: this file is included by both API endpoints and admin pages.
 *       config/session.php is a thin wrapper kept for backwards
 *       compatibility and just re-includes this file.
 */

require_once __DIR__ . '/config/env.php';
require_once __DIR__ . '/config/database.php';

// ---------------------------------------------------------------------------
// Session bootstrap
// ---------------------------------------------------------------------------
if (session_status() === PHP_SESSION_NONE) {
    // HTTPS detection (works behind Forpsi/CDN proxies that set X-Forwarded-Proto)
    $isHttps =
        (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
        (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') ||
        (isset($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443);

    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_secure', $isHttps ? '1' : '0');
    ini_set('session.cookie_samesite', 'Strict');
    ini_set('session.use_strict_mode', '1');           // reject uninitialised IDs
    ini_set('session.gc_maxlifetime', '3600');         // 1h idle

    session_start();

    if (!isset($_SESSION['created'])) {
        $_SESSION['created'] = time();
    } elseif (time() - $_SESSION['created'] > 1800) {
        // Rotate ID every 30 min to mitigate fixation
        session_regenerate_id(true);
        $_SESSION['created'] = time();
    }
}

// ---------------------------------------------------------------------------
// CSRF
// ---------------------------------------------------------------------------
function csrf_token(): string {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf_token(?string $token): bool {
    if (!is_string($token) || !isset($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

function csrf_field(): string {
    return '<input type="hidden" name="csrf_token" value="' . csrf_token() . '">';
}

// ---------------------------------------------------------------------------
// Admin auth
// ---------------------------------------------------------------------------
function isAdminLoggedIn(): bool {
    if (!isset($_SESSION['admin_id'], $_SESSION['admin_username'])) {
        return false;
    }
    // Bind session to original IP — mitigates session hijacking across networks
    if (isset($_SESSION['ip_address']) && $_SESSION['ip_address'] !== get_client_ip()) {
        adminLogout();
        return false;
    }
    // Idle timeout
    if (isset($_SESSION['login_time']) && time() - $_SESSION['login_time'] > 3600 * 4) {
        adminLogout();
        return false;
    }
    return true;
}

function requireAdmin(): void {
    if (!isAdminLoggedIn()) {
        header('Location: /admin/login.php');
        exit;
    }
}

function adminLogin(int $adminId, string $username): void {
    // Always rotate ID on privilege change
    session_regenerate_id(true);

    $_SESSION['admin_id']       = $adminId;
    $_SESSION['admin_username'] = $username;
    $_SESSION['login_time']     = time();
    $_SESSION['ip_address']     = get_client_ip();
    // Fresh CSRF on login
    unset($_SESSION['csrf_token']);
}

function adminLogout(): void {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }
    session_destroy();
}

// ---------------------------------------------------------------------------
// Misc helpers
// ---------------------------------------------------------------------------

/**
 * Best-effort client IP. Trust X-Forwarded-For only when set —
 * tweak the trusted-proxy list before going live if you sit behind a CDN.
 */
function get_client_ip(): string {
    $ip = '';
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } elseif (!empty($_SERVER['HTTP_X_REAL_IP'])) {
        $ip = $_SERVER['HTTP_X_REAL_IP'];
    } elseif (!empty($_SERVER['REMOTE_ADDR'])) {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    $ip = explode(',', $ip)[0];
    return filter_var(trim($ip), FILTER_VALIDATE_IP) ?: '0.0.0.0';
}

/**
 * Session-backed rate limit. Returns true if request is allowed.
 * NOTE: session-based limits are per-browser, not per-IP — for serious
 *       abuse protection (login brute force) consider a DB-backed limiter.
 */
function check_rate_limit(string $key, int $limit = 10, int $window = 60): bool {
    $now      = time();
    $rate_key = "rate_limit_{$key}";

    if (!isset($_SESSION[$rate_key])) {
        $_SESSION[$rate_key] = ['count' => 1, 'reset' => $now + $window];
        return true;
    }

    $rate = $_SESSION[$rate_key];

    if ($now > $rate['reset']) {
        $_SESSION[$rate_key] = ['count' => 1, 'reset' => $now + $window];
        return true;
    }

    if ($rate['count'] >= $limit) {
        return false;
    }

    $rate['count']++;
    $_SESSION[$rate_key] = $rate;
    return true;
}

/**
 * Strip HTML / control chars for safe storage + display.
 * For DB inserts always also bind via PDO prepared statements.
 */
function sanitize_input(?string $value): string {
    if ($value === null) return '';
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}
