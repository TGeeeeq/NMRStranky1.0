<?php
// Navbar. Caller may set $active to the current page slug (e.g. 'udalosti').
$active = $active ?? '';

$nav_items = [
    ['slug' => 'index',              'href' => '/',                'cs' => 'Domů',              'en' => 'Home'],
    ['slug' => 'o-nas',              'href' => '/o-nas',           'cs' => 'O nás',             'en' => 'About Us'],
    ['slug' => 'jak-se-zapojit',     'href' => '/jak-se-zapojit',  'cs' => 'Jak se zapojit',    'en' => 'Get involved'],
    ['slug' => 'novinky',            'href' => '/novinky',         'cs' => 'Novinky',           'en' => 'News'],
    ['slug' => 'zvireci-obyvatele',  'href' => '/zvireci-obyvatele','cs' => 'Zvířecí obyvatelé','en' => 'Animal Residents'],
    ['slug' => 'udalosti',           'href' => '/udalosti',        'cs' => 'Události',          'en' => 'Events'],
    ['slug' => 'kontakt',            'href' => '/kontakt',         'cs' => 'Kontakt',           'en' => 'Contact'],
    ['slug' => 'galerie',            'href' => '/galerie',         'cs' => 'Galerie',           'en' => 'Gallery'],
    ['slug' => 'obchod',             'href' => '/obchod/',         'cs' => 'Obchod',            'en' => 'Shop'],
];
?>
<nav class="navbar" aria-label="Hlavní navigace">
    <div class="nav-container">
        <div class="nav-logo">
            <a href="/" aria-label="Nech mě růst - domů"><img src="/assets/logo.png" alt="Nech mě růst" class="logo"></a>
        </div>
        <ul class="nav-menu" id="nav-menu">
            <?php foreach ($nav_items as $item): ?>
            <?php $is_active = $item['slug'] === $active; ?>
            <?php $active_class = $is_active ? ' active' : ''; ?>
            <?php $aria_current = $is_active ? 'aria-current="page"' : ''; ?>
            <li class="nav-item">
                <a href="<?= htmlspecialchars($item['href'], ENT_QUOTES, 'UTF-8') ?>"
                   class="nav-link<?= $active_class ?>"
                   <?= $aria_current ?>
                   data-cs="<?= htmlspecialchars($item['cs'], ENT_QUOTES, 'UTF-8') ?>"
                   data-en="<?= htmlspecialchars($item['en'], ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($item['cs'], ENT_QUOTES, 'UTF-8') ?></a>
            </li>
            <?php endforeach; ?>

            <li class="nav-item nav-cta-item">
                <a href="/virtualni-adopce" class="nav-cta" data-cs="Přispět" data-en="Donate">
                    <i class="fas fa-heart" aria-hidden="true"></i>
                    <span data-cs="Přispět" data-en="Donate">Přispět</span>
                </a>
            </li>

            <li class="nav-item language-switcher">
                <button id="lang-toggle" class="lang-btn" aria-label="Změnit jazyk / Switch language">
                    <span class="lang-text">EN</span>
                </button>
            </li>
        </ul>
        <button class="hamburger" aria-label="Otevřít menu" aria-expanded="false" aria-controls="nav-menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>
    </div>
</nav>
