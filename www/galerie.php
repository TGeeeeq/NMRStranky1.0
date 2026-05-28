<?php
$page_title = 'Galerie';
$page_slug = 'galerie';
$active = 'galerie';
$page_description = 'Fotografie zvířat z azylu Nech mě růst — Princezna, Ronja, Áda a další obyvatelé Louky.';
$og_image = '/assets/animals-hero.webp';
require __DIR__ . '/partials/head.php';
?>

<?php require __DIR__ . '/partials/navbar.php'; ?>

<main id="main-content">
<!-- Hero Section -->
    <section class="page-hero">
        <div class="hero-image">
            <img data-src="assets/animals-hero.webp" alt="Galerie" class="hero-bg" loading="lazy">
        </div>
        <div class="container">
            <h1 class="page-title" data-cs="Galerie" data-en="Our Animal Gallery">Galerie našich zvířat</h1>
            <p class="page-description" data-cs="Nahlédněte do života obyvatel Louky skrze objektiv fotoaparátu" data-en="Take a look at the lives of our animal residents through the camera lens">
                Nahlédněte do života obyvatel Louky skrze objektiv fotoaparátu
            </p>
        </div>
    </section>

    <!-- Gallery Filters -->
    <section class="gallery-filters">
        <div class="container">
            <div class="filter-container">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="animal-search" placeholder="Hledat zvíře..." data-cs-placeholder="Hledat zvíře..." data-en-placeholder="Search animal...">
                </div>
                <div class="filter-buttons" id="filter-buttons">
                    <button class="filter-btn active" data-filter="all" data-cs="Vše" data-en="All">Vše</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Gallery Grid -->
    <section class="gallery">
        <div class="container">
            <div class="gallery-grid" id="gallery-grid">
                <!-- Položky galerie budou generovány dynamicky -->
            </div>
        </div>
    </section>

    <!-- Social Media -->
    <section class="social-section">
        <div class="container">
            <h2 class="section-title" data-cs="Sledujte nás" data-en="Follow Us">Sledujte nás</h2>
            <div class="social-media large">
                <a href="https://www.instagram.com/nech_me_rust" class="social-link">
                    <i class="fab fa-instagram"></i>
                    <span>Instagram</span>
                </a>
                <a href="https://www.facebook.com/share/1BDFbAxfFf/" class="social-link">
                    <i class="fab fa-facebook"></i>
                    <span>Facebook</span>
                </a>
                <a href="mailto:info@nechmerust.org" class="social-link">
                    <i class="fas fa-envelope"></i>
                    <span>Email</span>
                </a>
            </div>
        </div>
    </section>

    <script src="/gallery.js" defer></script>

<!-- Lightbox pro náhled fotek (native <dialog>) -->
<dialog id="lightbox" class="lightbox" aria-label="Náhled fotografie">
    <button type="button" class="lightbox__btn lightbox__close" aria-label="Zavřít náhled">&times;</button>
    <button type="button" class="lightbox__btn lightbox__prev" aria-label="Předchozí fotka">&#10094;</button>
    <button type="button" class="lightbox__btn lightbox__next" aria-label="Další fotka">&#10095;</button>
    <img class="lightbox__img" id="lightbox-img" alt="">
    <p class="lightbox__caption" id="lightbox-caption" aria-live="polite"></p>
</dialog>
</main>

<?php require __DIR__ . '/partials/footer.php'; ?>
