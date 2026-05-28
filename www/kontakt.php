<?php
$page_title = 'Kontakt';
$page_slug = 'kontakt';
$active = 'kontakt';
$page_description = 'Adresa, e-mail a otevírací doba azylu Nech mě růst. Domluvte si návštěvu na Louce.';
$og_image = '/assets/about-hero.webp';
require __DIR__ . '/partials/head.php';
?>

<?php require __DIR__ . '/partials/navbar.php'; ?>

<main id="main-content">
<!-- Hero Section -->
    <section class="page-hero contact-hero">
        <div class="hero-image">
            <img data-src="assets/contact-hero.webp" alt="Kontakt" class="hero-bg" loading="lazy">
        </div>
        <div class="container">
            <h1 class="page-title" data-cs="Kontakt" data-en="Contact">Kontakt</h1>
            <p class="page-description" data-cs="Spojte se s námi a navštivte naši Louku" data-en="Get in touch with us and visit our Meadow">
                Spojte se s námi a navštivte naši Louku
            </p>
        </div>
    </section>
<!-- Contact Info -->
<section class="contact-details">
    <div class="container">
        <div class="contact-grid">
            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <h3 data-cs="Adresa" data-en="Address">Adresa</h3>
                <a href="https://mapy.com/s/nozazohuta" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   style="text-decoration: none; color: inherit; cursor: pointer;">
                    <p>Nová ves u Leštiny 32<br>582 82 Česká Republika</p>
                </a>
            </div>
            
            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <h3 data-cs="Email" data-en="Email">Email</h3>
                <p><a href="mailto:info@nechmerust.org">info@nechmerust.org</a></p>
            </div>
            
            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <h3 data-cs="Návštěvy" data-en="Visits">Návštěvy</h3>
                <p data-cs="Po domluvě. Kontaktujte nás 48h předem" data-en="By appointment. Contact us 48h in advance">Po domluvě. Kontaktujte nás 48h předem</p>
            </div>           
          
                
         </div>   
        </div>
    </section>

    <!-- Visit Info -->
    <section class="visit-info">
        <div class="container">
            <div class="visit-content">
                <div class="visit-text">
                    <h2 data-cs="Plánujete návštěvu?" data-en="Planning a Visit?">Plánujete návštěvu?</h2>
                    <p data-cs="Rádi vítáme návštěvníky na naší Louce! Kontaktujte nás prosím alespoň 48 hodin předem a domluvte si termín návštěvy. Pomůže nám to zajistit, aby se zvířata cítila dobře a abychom vám mohli poskytnout co nejlepší zážitek." data-en="We welcome visitors to our Meadow! Please contact us at least 48 hours in advance to arrange a visit. This will help us ensure that the animals feel comfortable and that we can provide you with the best possible experience.">
                        Rádi vítáme návštěvníky na naší Louce! Kontaktujte nás prosím alespoň 48 hodin předem a domluvte si termín návštěvy. Pomůže nám to zajistit, aby se zvířata cítila dobře a abychom vám mohli poskytnout co nejlepší zážitek.
                    </p>
                    
                    <div class="visit-guidelines">
                        <h3 data-cs="Co očekávat při návštěvě:" data-en="What to Expect During Your Visit:">Co očekávat při návštěvě:</h3>
                        <ul>
                            <li data-cs="Prohlídka celé Louky a seznámení se zvířaty" data-en="Tour of the entire Meadow and meeting the animals">Prohlídka celé Louky a seznámení se zvířaty</li>
                            <li data-cs="Možnost krmení a mazlení se zvířaty" data-en="Opportunity to feed and pet the animals">Možnost krmení a mazlení se zvířaty</li>
                            <li data-cs="Vyprávění o historii každého zvířete" data-en="Stories about the history of each animal">Vyprávění o historii každého zvířete</li>
                            <li data-cs="Informace o našem způsobu života a filozofii" data-en="Information about our way of life and philosophy">Informace o našem způsobu života a filozofii</li>
                            <li data-cs="Možnost zakoupení místních produktů" data-en="Opportunity to purchase local products">Možnost zakoupení místních produktů</li>
                        </ul>
                    </div>
                    
                    <a href="mailto:info@nechmerust.org?subject=Zájem o návštěvu Louky" class="contact-btn" data-cs="Domluvit návštěvu" data-en="Arrange a Visit">Domluvit návštěvu</a>
                </div>
                <div class="visit-image">
                    <img data-src="assets/visit-image.webp" alt="Návštěva Louky" class="visit-img" loading="lazy">
                </div>
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
</main>

<?php require __DIR__ . '/partials/footer.php'; ?>
