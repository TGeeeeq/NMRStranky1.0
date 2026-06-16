<?php
/**
 * Backwards-compat shim.
 *
 * All real session/CSRF/admin-auth logic lives in /www/config.php so that
 * cookie flags (Secure on HTTPS, SameSite=Strict, etc.) stay consistent.
 * Older files that did `require_once '../config/session.php'` still work.
 */
require_once __DIR__ . '/../config.php';
