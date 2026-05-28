<?php
$page_title = 'Domů';
$page_slug = '';
$active = 'index';
$page_description = 'Nech mě růst z.s. je nezisková organizace s vizí tvorby rodového statku, kde žijeme v harmonii s přírodou, zvířaty i sebou navzájem.';
$og_image = '/assets/hero-image.webp';
require __DIR__ . '/partials/head.php';
?>

<?php require __DIR__ . '/partials/navbar.php'; ?>

<main id="main-content">

    <!-- Hero -->
    <section class="hero">
        <div class="hero-content">
            <div class="hero-text">
                <h1 class="hero-title"
                    data-cs="Tvoříme prostor pro růst duše, srdce i přírody"
                    data-en="Creating space for the growth of soul, heart and nature">
                    Tvoříme prostor pro růst duše, srdce i přírody
                </h1>
                <p class="hero-description"
                   data-cs="Nech Mě Růst z.s. je nezisková organizace s vizí tvorby rodového statku, kde žijeme v harmonii s přírodou, zvířaty i sebou navzájem."
                   data-en="Let Me Grow is a non-profit organisation with a vision of creating a family estate where we live in harmony with nature, animals and each other.">
                    Nech Mě Růst z.s. je nezisková organizace s vizí tvorby rodového statku, kde žijeme v harmonii s přírodou, zvířaty i sebou navzájem.
                </p>
                <div class="hero-actions">
                    <a href="/jak-se-zapojit" class="btn btn--primary btn--lg" data-cs="Jak se zapojit" data-en="Get involved">Jak se zapojit</a>
                    <a href="/o-nas" class="btn btn--ghost btn--lg" data-cs="Více o nás" data-en="More about us">Více o nás</a>
                </div>
            </div>
            <div class="hero-logo">
                <div class="logo-circle">
                    <img src="/assets/logo-circle.png" alt="Logo Nech mě růst" class="circle-logo">
                </div>
            </div>
        </div>
        <div class="hero-image">
            <img src="/assets/hero-image.webp" alt="Lidé se zvířaty na louce" class="hero-bg" loading="eager">
        </div>
    </section>

    <!-- About -->
    <section class="about" data-reveal>
        <div class="container">
            <h2 class="section-title" data-cs="O projektu" data-en="About the Project">O projektu</h2>
            <div class="about-grid">
                <div class="about-text">
                    <p data-cs="Na Louce žijí zvířata, která jsme přijali do péče, a která u nás nacházejí bezpečný domov, dostatek krmiva a čisté, teplé místo k odpočinku. Každé zvíře má svůj příběh a my se snažíme zajistit jim co nejlepší život."
                       data-en="Animals live on the Meadow that we have taken into our care, and which find a safe home with us, plenty of food and a clean, warm place to rest. Each animal has its own story and we try to ensure the best possible life for them.">
                        Na Louce žijí zvířata, která jsme přijali do péče, a která u nás nacházejí bezpečný domov, dostatek krmiva a čisté, teplé místo k odpočinku. Každé zvíře má svůj příběh a my se snažíme zajistit jim co nejlepší život.
                    </p>
                    <p data-cs="Věříme, že způsob, jakým žijeme a jak zacházíme se světem kolem nás, má hluboký dopad na naše blaho i na zdraví celé planety. Proto se snažíme žít vědomě, s úctou k tradičním hodnotám, ale i s otevřeností k novým, udržitelným přístupům."
                       data-en="We believe that the way we live and how we treat the world around us has a profound impact on our well-being and the health of the entire planet. Therefore, we strive to live consciously, with respect for traditional values, but also with openness to new, sustainable approaches.">
                        Věříme, že způsob, jakým žijeme a jak zacházíme se světem kolem nás, má hluboký dopad na naše blaho i na zdraví celé planety. Proto se snažíme žít vědomě, s úctou k tradičním hodnotám, ale i s otevřeností k novým, udržitelným přístupům.
                    </p>
                    <p data-cs="Naším posláním je nejen vytvářet takové prostředí pro nás samotné, ale také inspirovat ostatní, sdílet naše zkušenosti a znalosti, a tím přispívat k širší společenské transformaci směrem k harmoničtějšímu vztahu s naším prostředím."
                       data-en="Our mission is not only to create such an environment for ourselves, but also to inspire others, share our experiences and knowledge, and thus contribute to a broader social transformation towards a more harmonious relationship with our environment.">
                        Naším posláním je nejen vytvářet takové prostředí pro nás samotné, ale také inspirovat ostatní, sdílet naše zkušenosti a znalosti, a tím přispívat k širší společenské transformaci směrem k harmoničtějšímu vztahu s naším prostředím.
                    </p>
                </div>
                <div class="about-image">
                    <img src="/assets/about-image.webp" alt="Zvířata na louce" class="about-img" loading="lazy">
                </div>
            </div>
        </div>
    </section>

    <!-- Values -->
    <section class="values">
        <div class="container">
            <h2 class="section-title" data-cs="Naše hodnoty" data-en="Our Values">Naše hodnoty</h2>
            <div class="values-grid">
                <article class="card value-card" data-reveal>
                    <div class="value-icon" aria-hidden="true"><i class="fas fa-heart"></i></div>
                    <h3 data-cs="Péče o zvířata" data-en="Animal Care">Péče o zvířata</h3>
                    <p data-cs="Poskytování bezpečného a láskyplného domova pro zvířata."
                       data-en="Providing a safe and loving home for animals.">Poskytování bezpečného a láskyplného domova pro zvířata.</p>
                </article>
                <article class="card value-card" data-reveal>
                    <div class="value-icon" aria-hidden="true"><i class="fas fa-seedling"></i></div>
                    <h3 data-cs="Soběstačnost" data-en="Self-sufficiency">Soběstačnost</h3>
                    <p data-cs="Aktivní usilování o udržitelný a soběstačný způsob života."
                       data-en="Active pursuit of a sustainable and self-sufficient lifestyle.">Aktivní usilování o udržitelný a soběstačný způsob života.</p>
                </article>
                <article class="card value-card" data-reveal>
                    <div class="value-icon" aria-hidden="true"><i class="fas fa-users"></i></div>
                    <h3 data-cs="Komunita" data-en="Community">Komunita</h3>
                    <p data-cs="Budování silné a podporující komunity kolem naší Louky."
                       data-en="Building a strong and supportive community around our Meadow.">Budování silné a podporující komunity kolem naší Louky.</p>
                </article>
                <article class="card value-card" data-reveal>
                    <div class="value-icon" aria-hidden="true"><i class="fas fa-leaf"></i></div>
                    <h3 data-cs="Soulad s přírodou" data-en="Harmony with Nature">Soulad s přírodou</h3>
                    <p data-cs="Láskyplné propojení s přírodou a cesta života v jejím rytmu."
                       data-en="Loving connection with nature and living in its rhythm.">Láskyplné propojení s přírodou a cesta života v jejím rytmu.</p>
                </article>
            </div>
        </div>
    </section>

    <!-- Video -->
    <section id="video-section" class="video-container-section" data-reveal>
        <div class="container">
            <div class="video-wrapper">
                <div class="video-frame">
                    <video controls preload="none" poster="/assets/video-poster.webp">
                        <source src="/assets/animals.mp4" type="video/mp4">
                        <span data-cs="Váš prohlížeč nepodporuje přehrávání videa."
                              data-en="Your browser does not support video playback.">Váš prohlížeč nepodporuje přehrávání videa.</span>
                    </video>
                </div>
                <p class="video-description"
                   data-cs="Naše společné procházky"
                   data-en="Our walks together">Naše společné procházky</p>
            </div>
        </div>
    </section>

    <?php require __DIR__ . '/partials/social.php'; ?>

</main>

<?php require __DIR__ . '/partials/footer.php'; ?>
