<?php
$page_title = 'Události';
$page_slug = 'udalosti';
$active = 'udalosti';
$page_description = 'Brigády, festivaly a setkání se zvířaty na Louce — přijďte zažít náš každodenní život v souznění s přírodou.';
$og_image = '/assets/hero-image.webp';
require __DIR__ . '/partials/head.php';
?>

<?php require __DIR__ . '/partials/navbar.php'; ?>

<main id="main-content">

    <!-- Hero -->
    <section class="page-hero events-hero">
        <div class="hero-image">
            <img data-src="assets/hero-image.webp" alt="Události" class="hero-bg" loading="lazy">
        </div>
        <div class="container">
            <h1 class="page-title" data-cs="Události" data-en="Events">Události</h1>
            <p class="page-description"
               data-cs="Zúčastněte se některé z událostí a poznejte život na Louce"
               data-en="Attend one of our events and experience our way of life">
                Zúčastněte se některé z událostí a poznejte život na Louce
            </p>
        </div>
    </section>

    <!-- Upcoming Events -->
    <section class="upcoming-events" data-reveal>
        <div class="container">
            <h2 class="section-title" data-cs="Nadcházející události" data-en="Upcoming Events">Nadcházející události</h2>
            <p class="events-intro"
               data-cs="Pravidelně pořádáme brigády, festivaly a setkání se zvířaty na Louce. Přijďte poznat náš každodenní život v souznění s přírodou."
               data-en="We regularly host work weekends, festivals and gatherings with the animals on the Meadow. Come and experience our everyday life in harmony with nature.">
                Pravidelně pořádáme brigády, festivaly a setkání se zvířaty na Louce. Přijďte poznat náš každodenní život v souznění s přírodou.
            </p>

            <div class="events-grid" id="events-list">

                <!-- KARTA: Spontánní Loukáda 29.–31. května 2026 -->
                <article class="event-card" data-event-date="2026-05-29">
                    <header class="event-card__head">
                        <div class="event-stamp" aria-hidden="true">
                            <span class="event-stamp__day">29<span class="event-stamp__day-suffix">–31</span></span>
                            <span class="event-stamp__month" data-cs="května" data-en="May">května</span>
                            <span class="event-stamp__year">2026</span>
                        </div>
                        <span class="event-status event-status--soon" data-cs="Naposledy" data-en="Last one">Naposledy</span>
                    </header>
                    <div class="event-card__body">
                        <h3 class="event-title" data-cs="Spontánní Loukáda" data-en="Spontaneous Loukáda">Spontánní Loukáda</h3>
                        <p class="event-meta">
                            <span class="event-meta__item"><i class="fas fa-clock" aria-hidden="true"></i> <span data-cs="Čt – So" data-en="Thu – Sat">Čt – So</span></span>
                            <span class="event-meta__item"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> <span data-cs="Nová Ves u Leštiny" data-en="Nová Ves u Leštiny">Nová Ves u Leštiny</span></span>
                        </p>
                        <div class="event-description"
                             data-cs="Na delší čas *poslední společná akce* na Louce. Přijď, pomoz, propoj se. 🌿

Čeká nás spousta práce i pohody – brigáda, mazlení se zvířátky, večery u ohně.

📩 Info a přihlášení: IG **@nechmerust** nebo **info@nechmerust.org**"
                             data-en="The *last communal event* at the Meadow for a longer time. Come, help, connect. 🌿

Plenty of work and good times ahead — work weekend, animal cuddles, evenings by the fire.

📩 Info and registration: IG **@nechmerust** or **info@nechmerust.org**">
                            Na delší čas poslední společná akce na Louce.
                        </div>
                        <div class="event-actions">
                            <a href="mailto:info@nechmerust.org" class="btn btn--primary">
                                <i class="fas fa-envelope" aria-hidden="true"></i>
                                <span data-cs="Přihlásit se" data-en="Sign up">Přihlásit se</span>
                            </a>
                        </div>
                    </div>
                </article>

                <!-- KARTA: Jarní Loukáda 9. května 2026 -->
                <article class="event-card" data-event-date="2026-05-09">
                    <header class="event-card__head">
                        <div class="event-stamp" aria-hidden="true">
                            <span class="event-stamp__day">9.</span>
                            <span class="event-stamp__month" data-cs="května" data-en="May">května</span>
                            <span class="event-stamp__year">2026</span>
                        </div>
                        <span class="event-status event-status--upcoming" data-cs="Brigáda" data-en="Work weekend">Brigáda</span>
                    </header>
                    <div class="event-card__body">
                        <h3 class="event-title" data-cs="Jarní Loukáda" data-en="Spring Loukáda">Jarní Loukáda</h3>
                        <p class="event-meta">
                            <span class="event-meta__item"><i class="fas fa-clock" aria-hidden="true"></i> <span data-cs="So 9:30 – Ne" data-en="Sat 9:30 – Sun">So 9:30 – Ne</span></span>
                            <span class="event-meta__item"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> <span data-cs="Nová Ves u Leštiny" data-en="Nová Ves u Leštiny">Nová Ves u Leštiny</span></span>
                        </p>
                        <div class="event-description"
                             data-cs="Krásný den přátelé! 🌞

Paní Zima odchází a Louka se probouzí – a to znamená jediné: čas na **Loukádu** alias *Přijeď makat, Louka ti poděkuje!* 🙏😅

Čeká nás stavba nového výběhu pro Princeznu (prasinka 🐽), úklid a opravy po zimě, práce na zahradách a spousta dalšího. Práce je víc než dost, každý si přijde na své! 😄

**Praktické info:**
- **Parkování:** Nová Ves u Leštiny 32
- **Vlakem:** stanice Vlkaneč nebo Nová Ves u Leštiny
- **Jídlo** na celý víkend zajištěno (vše rostlinné) – kdo chce, může přivézt něco dobrého k ochutnání 🌱
- **Spaní:** stan, hamaka nebo pod širým nebem (nebe máme, zbytek vlastní 😅)
- Večery u ohýnku, sdílení, zpívání…

📩 Info a přihlášení: IG **@nechmerust** nebo **info@nechmerust.org**

*P.S. Mazlení zvířátek povinné, ovozelenina vítána! 🐑🐐🫏🐕🐂*"
                             data-en="Have a nice day friends! 🌞

Mrs. Winter is leaving and Louka is waking up – and that means only one thing: time for **Loukáda** aka *Come work, Louka will thank you!* 🙏😅

We have a new enclosure for Princess (the pig 🐽), cleaning and repairs after the winter, gardening and much more to do. There is more than enough work, everyone will find their own! 😄

**Practical info:**
- **Parking:** Nová Ves u Leštiny 32
- **By train:** Vlkaneč or Nová Ves u Leštiny station
- **Food** provided for the whole weekend (all plant-based) – if you want, you can bring something good to taste 🌱
- **Sleeping:** tent, hammock or under the open sky (we have the sky, the rest is ours 😅)
- Evenings by the fire, sharing, singing…

📩 Info and registration: IG **@nechmerust** or **info@nechmerust.org**

*P.S. Petting the animals is mandatory, fruits or vegetables are welcome! 🐑🐐🫏🐕🐂*">
                            Jarní brigáda a společné setkání na Louce.
                        </div>
                        <div class="event-actions">
                            <a href="https://facebook.com/events/s/jarni-loukada/1564587511282588/"
                               target="_blank" rel="noopener noreferrer"
                               class="btn btn--ghost">
                                <i class="fab fa-facebook" aria-hidden="true"></i>
                                <span>Facebook</span>
                            </a>
                        </div>
                    </div>
                </article>

                <!-- KARTA: Spolu mezi lesy 12.–14. června 2026 -->
                <article class="event-card" data-event-date="2026-06-12">
                    <header class="event-card__head">
                        <div class="event-stamp" aria-hidden="true">
                            <span class="event-stamp__day">12<span class="event-stamp__day-suffix">–14</span></span>
                            <span class="event-stamp__month" data-cs="června" data-en="June">června</span>
                            <span class="event-stamp__year">2026</span>
                        </div>
                        <span class="event-status event-status--upcoming" data-cs="Festival" data-en="Festival">Festival</span>
                    </header>
                    <div class="event-card__body">
                        <h3 class="event-title" data-cs="Spolu mezi lesy" data-en="Together among the forests">Spolu mezi lesy</h3>
                        <p class="event-meta">
                            <span class="event-meta__item"><i class="fas fa-clock" aria-hidden="true"></i> <span data-cs="Pá 10:30 – Ne" data-en="Fri 10:30 – Sun">Pá 10:30 – Ne</span></span>
                            <span class="event-meta__item"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> <span data-cs="Louka u Leštiny" data-en="Louka u Leštiny">Louka u Leštiny</span></span>
                        </p>
                        <div class="event-description"
                             data-cs="🌿 Třídenní pobyt na Louce se zvířaty, plný hudby, intuitivního umění, pohybu a propojení. Jedinečné místo, unikátní víkend v přírodě.

🥕 V sobotu i neděli dopoledne tě pohostíme vydatným brunchem, v sobotu i večeří + snacky přes den.

🐮 Program je dobrovolný a orientační — louka má svoje kouzlo! Pokud se ti něco nebude zamlouvat, můžeš mazlit zvířátka, ležet v trávě nebo lézt po stromech 🌸

🦋 Cena za celý víkend včetně tří jídel: **2 470 Kč** ~ výdělek jde z velké části na rozvoj azylu Nech mě růst.

🐣 Kapacita je omezená, aby zůstala zachována komorní atmosféra.

📩 Přihlášky a dotazy: **kvalesova64@gmail.com** nebo Instagram **@kat_luna__** **@kater.inkae**

*Těšíme se na setkání a propojení 💫🌺 S láskou Kateřina & Kateřina 🧡*"
                             data-en="🌿 A three-day stay at the Meadow with animals, full of music, intuitive art, movement and connection. A unique place, a unique weekend in nature.

🥕 On Saturday and Sunday mornings we will treat you to a hearty brunch, on Saturday also dinner + snacks during the day.

🐮 The program is voluntary and indicative — the meadow has its own charm! If you don't like something, you can pet the animals, lie in the grass or climb trees 🌸

🦋 Price for the whole weekend including three meals: **2,470 CZK** ~ the proceeds go largely to the development of the Let Me Grow asylum.

🐣 Capacity is limited to maintain an intimate atmosphere.

📩 Applications and questions: **kvalesova64@gmail.com** or Instagram **@kat_luna__** **@kater.inkae**

*We look forward to meeting and connecting 💫🌺 With love Kateřina & Kateřina 🧡*">
                            Spolu mezi lesy
                        </div>
                        <div class="event-actions">
                            <a href="/mezilesy" class="btn btn--primary">
                                <i class="fas fa-info-circle" aria-hidden="true"></i>
                                <span data-cs="Více info a program" data-en="More info & program">Více info a program</span>
                            </a>
                            <a href="https://facebook.com/events/s/spolu-mezi-lesy-fest/1511449187358577/"
                               target="_blank" rel="noopener noreferrer"
                               class="btn btn--ghost">
                                <i class="fab fa-facebook" aria-hidden="true"></i>
                                <span>Facebook</span>
                            </a>
                        </div>
                    </div>
                </article>

                <!-- KARTA: Toulky se zvířaty (odloženo) -->
                <article class="event-card" data-event-status="postponed">
                    <header class="event-card__head">
                        <div class="event-stamp" aria-hidden="true">
                            <span class="event-stamp__day">?</span>
                            <span class="event-stamp__month" data-cs="termín" data-en="date">termín</span>
                            <span class="event-stamp__year" data-cs="upřesníme" data-en="TBA">upřesníme</span>
                        </div>
                        <span class="event-status event-status--postponed" data-cs="Odloženo" data-en="Postponed">Odloženo</span>
                    </header>
                    <div class="event-card__body">
                        <h3 class="event-title" data-cs="Toulky se zvířaty" data-en="Wanderings with animals">Toulky se zvířaty</h3>
                        <p class="event-meta">
                            <span class="event-meta__item"><i class="fas fa-route" aria-hidden="true"></i> <span data-cs="Dvoudenní putování" data-en="Two-day journey">Dvoudenní putování</span></span>
                            <span class="event-meta__item"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> <span data-cs="Střední Čechy" data-en="Central Bohemia">Střední Čechy</span></span>
                        </p>
                        <div class="event-description"
                             data-cs="Dvoudenní putování středočeskou krajinou ve společnosti psů, osla, muflona a dalších zvířecích přátel. *Termín bude upřesněn.*"
                             data-en="A two-day journey through the Central Bohemian landscape in the company of dogs, a donkey, a mouflon, and other animal friends. *Date will be confirmed.*">
                            Dvoudenní putování středočeskou krajinou ve společnosti psů, osla, muflona a dalších zvířecích přátel.
                        </div>
                        <div class="event-actions">
                            <a href="/putovani-se-zviraty" class="btn btn--primary">
                                <i class="fas fa-info-circle" aria-hidden="true"></i>
                                <span data-cs="Více informací" data-en="More information">Více informací</span>
                            </a>
                            <a href="https://facebook.com/events/s/toulky-se-zviraty/1397605111685523/"
                               target="_blank" rel="noopener noreferrer"
                               class="btn btn--ghost">
                                <i class="fab fa-facebook" aria-hidden="true"></i>
                                <span>Facebook</span>
                            </a>
                        </div>
                    </div>
                </article>

            </div>
        </div>
    </section>

    <?php require __DIR__ . '/partials/social.php'; ?>

</main>

<?php require __DIR__ . '/partials/footer.php'; ?>
