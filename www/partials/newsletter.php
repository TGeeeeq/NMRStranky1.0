<?php
/**
 * Newsletter signup widget.
 * Posts to /newsletter_signup_api.php (existing endpoint, unchanged).
 */
?>
<section class="newsletter-section">
    <div class="container">
        <div class="newsletter-box">
            <div class="newsletter-icon" aria-hidden="true">
                <i class="fas fa-envelope-open-text"></i>
            </div>
            <div class="newsletter-content">
                <h3 class="newsletter-title"
                    data-cs="Zůstaňte v obraze 📬"
                    data-en="Stay in the loop 📬">Zůstaňte v obraze 📬</h3>
                <p class="newsletter-description"
                   data-cs="Přihlaste se k odběru novinek a buďte první, kdo se dozví o aktuálním dění na Louce, nových příbězích našich zvířat a plánovaných událostech."
                   data-en="Subscribe to our newsletter and be the first to hear about life at the Meadow, new animal stories, and upcoming events.">
                    Přihlaste se k odběru novinek a buďte první, kdo se dozví o aktuálním dění na Louce, nových příbězích našich zvířat a plánovaných událostech.
                </p>
            </div>
            <form id="newsletter-form" class="newsletter-form" novalidate>
                <div class="form-group">
                    <label for="newsletter-name" class="sr-only" data-cs="Vaše jméno" data-en="Your name">Vaše jméno</label>
                    <input
                        type="text"
                        id="newsletter-name"
                        name="name"
                        placeholder="Vaše jméno"
                        data-cs="Vaše jméno"
                        data-en="Your name"
                        required
                        class="newsletter-input"
                        autocomplete="name">
                </div>
                <div class="form-group">
                    <label for="newsletter-email" class="sr-only" data-cs="Váš e-mail" data-en="Your email">Váš e-mail</label>
                    <input
                        type="email"
                        id="newsletter-email"
                        name="email"
                        placeholder="Váš e-mail"
                        data-cs="Váš e-mail"
                        data-en="Your email"
                        required
                        class="newsletter-input"
                        autocomplete="email">
                </div>
                <div class="form-group newsletter-consent">
                    <label class="newsletter-consent-label">
                        <input type="checkbox" id="newsletter-gdpr" name="gdpr_consent" required>
                        <span data-cs="Souhlasím se zpracováním osobních údajů (jméno, e-mail) za účelem zasílání novinek. Souhlas lze kdykoli odvolat."
                              data-en="I consent to the processing of my personal data (name, email) for the purpose of receiving the newsletter. Consent can be withdrawn at any time.">
                            Souhlasím se <a href="/gdpr" target="_blank" rel="noopener">zpracováním osobních údajů</a> (jméno, e-mail) za účelem zasílání novinek. Souhlas lze kdykoli odvolat.
                        </span>
                    </label>
                </div>
                <button type="submit" class="btn btn--primary btn--block newsletter-submit-btn">
                    <span class="btn-text" data-cs="Přihlásit se k odběru" data-en="Subscribe">Přihlásit se k odběru</span>
                    <span class="btn-loading" hidden>
                        <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
                        <span data-cs="Odesílám…" data-en="Sending…">Odesílám…</span>
                    </span>
                </button>
                <p class="newsletter-privacy">
                    <i class="fas fa-lock" aria-hidden="true"></i>
                    <span data-cs="Vaše údaje jsou v bezpečí. Přečtěte si naše"
                          data-en="Your data is safe. See our">Vaše údaje jsou v bezpečí. Přečtěte si naše</span>
                    <a href="/gdpr" target="_blank" rel="noopener" data-cs="zásady ochrany osobních údajů" data-en="privacy policy">zásady ochrany osobních údajů</a>.
                </p>
            </form>
            <div id="newsletter-message" class="newsletter-message" hidden></div>
        </div>
    </div>
</section>
