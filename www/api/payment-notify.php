<?php
/**
 * Webhook endpoint pro online platební brány.
 *
 * Aktuálně NEPOUŽÍVÁME — vracíme 410 Gone, aby brána nedostávala
 * 200 OK a netvářila se, že platba byla potvrzena.
 *
 * Až přidáme online platby zpět, sem půjde signature-verifikace
 * + UPDATE orders SET payment_status = 'completed' WHERE …
 */
http_response_code(410);
header('Content-Type: text/plain; charset=utf-8');
echo 'Payment notifications are disabled.';
