<?php
/**
 * Database & SMTP configuration with PDO connection helper.
 *
 * - Credentials are loaded via env() from .env (never hardcoded)
 * - PDO uses ERRMODE_EXCEPTION + ATTR_EMULATE_PREPARES=false so
 *   every query goes through real prepared statements (SQL-injection safe)
 * - Charset is utf8mb4 for full Czech / emoji support
 *
 * Usage:
 *   require_once __DIR__ . '/config/database.php';
 *   $pdo    = getDbConnection();
 *   $config = getAppConfig();
 */

require_once __DIR__ . '/env.php';

/**
 * Get a singleton PDO connection.
 * Throws RuntimeException on misconfiguration / connection failure.
 */
function getDbConnection(): PDO {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $host = env('DB_HOST');
    $name = env('DB_NAME');
    $user = env('DB_USER');
    $pass = env('DB_PASS');

    if (!$host || !$name || !$user) {
        error_log('DB config missing — check .env (DB_HOST, DB_NAME, DB_USER, DB_PASS).');
        throw new RuntimeException('Database configuration missing.');
    }

    $dsn = "mysql:host={$host};dbname={$name};charset=utf8mb4";

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false, // real prepared statements
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
    ];

    try {
        $pdo = new PDO($dsn, $user, $pass, $options);
    } catch (PDOException $e) {
        error_log('DB connection failed: ' . $e->getMessage());
        // Don't leak DSN/credentials to client
        throw new RuntimeException('Database connection failed.');
    }

    return $pdo;
}

/**
 * Application configuration (SMTP + e-shop bank details + admin notifications).
 * Cached so repeated calls don't re-read env on every invocation.
 */
function getAppConfig(): array {
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $config = [
        'smtp' => [
            'Host'       => env('SMTP_HOST', 'smtp.forpsi.com'),
            'SMTPAuth'   => true,
            'Username'   => env('SMTP_USERNAME', 'info@nechmerust.org'),
            'Password'   => env('SMTP_PASSWORD', ''),
            'SMTPSecure' => env('SMTP_SECURE', 'tls'),
            'Port'       => (int)env('SMTP_PORT', 587),
            'FromEmail'  => env('SMTP_FROM_EMAIL', 'info@nechmerust.org'),
            'FromName'   => env('SMTP_FROM_NAME', 'Nech mě růst'),
        ],
        'bank' => [
            'account_number' => env('BANK_ACCOUNT', ''),
            'iban'           => env('BANK_IBAN', ''),
            'swift'          => env('BANK_SWIFT', ''),
            'bank_name'      => env('BANK_NAME', ''),
        ],
        'admin' => [
            'notification_email' => env('ADMIN_NOTIFICATION_EMAIL', 'info@nechmerust.org'),
        ],
        'shop' => [
            // Order number prefix used in VS generation
            'order_prefix' => env('ORDER_PREFIX', 'NMR'),
        ],
    ];

    return $config;
}
