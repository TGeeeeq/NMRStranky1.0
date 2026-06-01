<?php
// Shared <head>. Set in caller scope: $page_title, $page_description, $page_slug,
// $og_image (root-relative), $og_description, $body_class, $extra_head.
$brand = 'Nech mě růst';
$page_title = $page_title ?? '';
$page_slug = $page_slug ?? '';
$page_description = $page_description ?? 'Nezisková organizace s vizí tvorby rodového statku, kde žijeme v harmonii s přírodou, zvířaty i sebou navzájem.';
$og_image = $og_image ?? '/assets/hero-image.webp';
$og_description = $og_description ?? $page_description;
$body_class = $body_class ?? '';
$extra_head = $extra_head ?? '';
$site = 'https://nechmerust.org';

$title_separator = $page_title === '' ? '' : ' — ';
$full_title = $brand . $title_separator . $page_title;

$canonical = $site . '/' . ltrim($page_slug, '/');

$og_image_clean = ltrim($og_image, '/');
$og_image_abs = $site . '/' . $og_image_clean;
?>
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?= htmlspecialchars($page_description, ENT_QUOTES, 'UTF-8') ?>">
    <meta name="theme-color" content="#2d5a3d">
    <title><?= htmlspecialchars($full_title, ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="canonical" href="<?= htmlspecialchars($canonical, ENT_QUOTES, 'UTF-8') ?>">

    <!-- Preload critical font weight -->
    <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/plus-jakarta-sans-var-latin.woff2" crossorigin>
    <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/plus-jakarta-sans-var-latin-ext.woff2" crossorigin>

    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" href="/assets/logo.png">
    <link rel="apple-touch-icon" href="/assets/logo.png">
    <link rel="manifest" href="/manifest.json">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Nech mě růst z.s.">
    <meta property="og:url" content="<?= htmlspecialchars($canonical, ENT_QUOTES, 'UTF-8') ?>">
    <meta property="og:title" content="<?= htmlspecialchars($full_title, ENT_QUOTES, 'UTF-8') ?>">
    <meta property="og:description" content="<?= htmlspecialchars($og_description, ENT_QUOTES, 'UTF-8') ?>">
    <meta property="og:image" content="<?= htmlspecialchars($og_image_abs, ENT_QUOTES, 'UTF-8') ?>">
    <meta property="og:locale" content="cs_CZ">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= htmlspecialchars($full_title, ENT_QUOTES, 'UTF-8') ?>">
    <meta name="twitter:description" content="<?= htmlspecialchars($og_description, ENT_QUOTES, 'UTF-8') ?>">
    <meta name="twitter:image" content="<?= htmlspecialchars($og_image_abs, ENT_QUOTES, 'UTF-8') ?>">

    <?= $extra_head ?>
</head>
<body class="<?= htmlspecialchars($body_class, ENT_QUOTES, 'UTF-8') ?>">
<a href="#main-content" class="skip-link">Přeskočit na obsah</a>