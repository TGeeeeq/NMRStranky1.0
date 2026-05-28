<?php
$page_title = 'Přispějte kryptoměnou';
$page_slug = 'prispet-kryptem';
$active = 'prispet-kryptem';
$page_description = 'Podpořte azyl Nech mě růst kryptoměnou — Bitcoin, Ethereum, Cardano a další.';
$og_image = '/assets/hero-image.webp';
require __DIR__ . '/partials/head.php';
?>

<?php require __DIR__ . '/partials/navbar.php'; ?>

<main id="main-content">
<!-- Hero Section -->
    <section class="page-hero">
        <div class="hero-content">
            <h1 class="page-title" data-cs="Přispět kryptoměnou" data-en="Donate with Cryptocurrency">Přispět kryptoměnou</h1>
            <p class="page-description" data-cs="Podpořte nás libovolnou z těchto kryptoměn" data-en="Support us with any of these cryptocurrencies">
                Podpořte nás libovolnou z těchto kryptoměn
            </p>
        </div>
        <div class="hero-image">
            <img data-src="assets/hero-image.webp" alt="Přispět kryptem" class="hero-bg" loading="lazy">
        </div>
    </section>

    <!-- Crypto Section -->
    <section class="crypto-main">
        <div class="container">
            <div class="crypto-container">
                <!-- Bitcoin -->
                <div class="crypto-card">
                    <img data-src="assets/bitcoin-logo.png" alt="Bitcoin logo" class="crypto-logo" loading="lazy">
                    <div class="crypto-name">Bitcoin (BTC)</div>
                    <img data-src="assets/btc-qr.png" alt="QR Bitcoin" class="qr-code" loading="lazy">
                    <div class="crypto-buttons">
                        <button class="btn" onclick="showInfo('btc')" data-cs="Více" data-en="More">Více</button>
                    </div>
                    <div id="info-btc" class="crypto-info" style="display:none;">
                        <p data-cs="Bitcoin je první a nejznámější kryptoměna." data-en="Bitcoin is the first and most well-known cryptocurrency.">
                            Bitcoin je první a nejznámější kryptoměna.
                        </p>
                        <div class="address-container">
                            <div class="address-label" data-cs="Adresa pro příspěvek:" data-en="Donation address:">Adresa pro příspěvek:</div>
                            <div class="address-text" onclick="copyToClipboard('bc1qe2hae5fq447rw095krcwwmamwrwy0plkkrw8as', this)">bc1qe2hae5fq447rw095krcwwmamwrwy0plkkrw8as</div>
                            <button class="copy-button" onclick="copyToClipboard('bc1qe2hae5fq447rw095krcwwmamwrwy0plkkrw8as', this)" data-cs="Kopírovat" data-en="Copy">Kopírovat</button>
                        </div>
                    </div>
                </div>

                <!-- Ethereum -->
                <div class="crypto-card">
                    <img data-src="assets/ethereum-logo.png" alt="Ethereum logo" class="crypto-logo" loading="lazy">
                    <div class="crypto-name">Ethereum (ETH)</div>
                    <img data-src="assets/eth-qr.png" alt="QR Ethereum" class="qr-code" loading="lazy">
                    <div class="crypto-buttons">
                        <button class="btn" onclick="showInfo('eth')" data-cs="Více" data-en="More">Více</button>
                    </div>
                    <div id="info-eth" class="crypto-info" style="display:none;">
                        <p data-cs="Ethereum je druhá nejrozšířenější kryptoměna." data-en="Ethereum is the second most widespread cryptocurrency.">
                            Ethereum je druhá nejrozšířenější kryptoměna.
                        </p>
                        <div class="address-container">
                            <div class="address-label" data-cs="Adresa pro příspěvek:" data-en="Donation address:">Adresa pro příspěvek:</div>
                            <div class="address-text" onclick="copyToClipboard('0x13ACe35dac602401da21F36348Dcf37b7Fef5389', this)">0x13ACe35dac602401da21F36348Dcf37b7Fef5389</div>
                            <button class="copy-button" onclick="copyToClipboard('0x13ACe35dac602401da21F36348Dcf37b7Fef5389', this)" data-cs="Kopírovat" data-en="Copy">Kopírovat</button>
                        </div>
                    </div>
                </div>

                <!-- Cardano -->
                <div class="crypto-card">
                    <img data-src="assets/cardano-logo.png" alt="Cardano logo" class="crypto-logo" loading="lazy">
                    <div class="crypto-name">Cardano (ADA)</div>
                    <img data-src="assets/ada-qr.png" alt="QR Cardano" class="qr-code" loading="lazy">
                    <div class="crypto-buttons">
                        <button class="btn" onclick="showInfo('ada')" data-cs="Více" data-en="More">Více</button>
                    </div>
                    <div id="info-ada" class="crypto-info" style="display:none;">
                        <p data-cs="Cardano je moderní proof-of-stake blockchain." data-en="Cardano is a modern proof-of-stake blockchain.">
                            Cardano je moderní proof-of-stake blockchain.
                        </p>
                        <div class="address-container">
                            <div class="address-label" data-cs="Adresa pro příspěvek:" data-en="Donation address:">Adresa pro příspěvek:</div>
                            <div class="address-text" onclick="copyToClipboard('addr1qx868v7umt2da0td3l7nsa990fwag37lllt82m4espzmnczscqvg9wk7adqdma8zcw60x2ru5uck9t0hr5far84c654sn4jxn4', this)">addr1qx868v7umt2da0td3l7nsa990fwag37lllt82m4espzmnczscqvg9wk7adqdma8zcw60x2ru5uck9t0hr5far84c654sn4jxn4</div>
                            <button class="copy-button" onclick="copyToClipboard('addr1qx868v7umt2da0td3l7nsa990fwag37lllt82m4espzmnczscqvg9wk7adqdma8zcw60x2ru5uck9t0hr5far84c654sn4jxn4', this)" data-cs="Kopírovat" data-en="Copy">Kopírovat</button>
                        </div>
                    </div>
                </div>

                <!-- Binance Coin -->
                <div class="crypto-card">
                    <img data-src="assets/bnb-logo.png" alt="Binance logo" class="crypto-logo" loading="lazy">
                    <div class="crypto-name">Binance Coin (BNB)</div>
                    <img data-src="assets/bnb-qr.png" alt="QR Binance" class="qr-code" loading="lazy">
                    <div class="crypto-buttons">
                        <button class="btn" onclick="showInfo('bnb')" data-cs="Více" data-en="More">Více</button>
                    </div>
                    <div id="info-bnb" class="crypto-info" style="display:none;">
                        <p data-cs="Binance Coin je kryptoměna burzy Binance." data-en="Binance Coin is the cryptocurrency of Binance exchange.">
                            Binance Coin je kryptoměna burzy Binance.
                        </p>
                        <div class="address-container">
                            <div class="address-label" data-cs="Adresa pro příspěvek:" data-en="Donation address:">Adresa pro příspěvek:</div>
                            <div class="address-text" onclick="copyToClipboard('0x13ACe35dac602401da21F36348Dcf37b7Fef5389', this)">0x13ACe35dac602401da21F36348Dcf37b7Fef5389</div>
                            <button class="copy-button" onclick="copyToClipboard('0x13ACe35dac602401da21F36348Dcf37b7Fef5389', this)" data-cs="Kopírovat" data-en="Copy">Kopírovat</button>
                        </div>
                    </div>
                </div>

                <!-- Pi Network -->
                <div class="crypto-card">
                    <img data-src="assets/pi-logo.png" alt="Pi Network logo" class="crypto-logo" loading="lazy">
                    <div class="crypto-name">Pi Network (Pi)</div>
                    <img data-src="assets/pi-qr.png" alt="QR Pi Network" class="qr-code" loading="lazy">
                    <div class="crypto-buttons">
                        <button class="btn" onclick="showInfo('pi')" data-cs="Více" data-en="More">Více</button>
                        <a href="https://minepi.com/bhaktidas108" target="_blank" class="btn btn-pi" data-cs="Těžit Pi" data-en="Mine Pi">Těžit Pi</a>
                    </div>
                    <div id="info-pi" class="crypto-info" style="display:none;">
                        <p data-cs="Pi Network je mobilní kryptoměna." data-en="Pi Network is a mobile cryptocurrency.">
                            Pi Network je mobilní kryptoměna.
                        </p>
                        <div class="address-container">
                            <div class="address-label" data-cs="Adresa pro příspěvek:" data-en="Donation address:">Adresa pro příspěvek:</div>
                            <div class="address-text" onclick="copyToClipboard('GDFQXJ2VMVH6MAJMZHJG4W57WHEZ26HFC42NHAVV4W7H56SEUVDAZMM6', this)">GDFQXJ2VMVH6MAJMZHJG4W57WHEZ26HFC42NHAVV4W7H56SEUVDAZMM6</div>
                            <button class="copy-button" onclick="copyToClipboard('GDFQXJ2VMVH6MAJMZHJG4W57WHEZ26HFC42NHAVV4W7H56SEUVDAZMM6', this)" data-cs="Kopírovat" data-en="Copy">Kopírovat</button>
                        </div>
                        <p data-cs="Chcete-li těžit Pi, použijte odkaz výše." data-en="To mine Pi, use the link above.">
                            Chcete-li těžit Pi, použijte odkaz výše.
                        </p>
                    </div>
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
    <!-- Toast notification -->
    <div id="toast" class="toast">
        <span data-cs="Adresa zkopírována do schránky!" data-en="Address copied to clipboard!">Adresa zkopírována do schránky!</span>
    </div>

    <script>
        function showInfo(crypto) {
            const info = document.getElementById('info-' + crypto);
            if (info.style.display === 'none') {
                info.style.display = 'block';
            } else {
                info.style.display = 'none';
            }
        }

        function copyToClipboard(text, element) {
            navigator.clipboard.writeText(text).then(function() {
                // Show toast notification
                showToast();
                
                // Visual feedback on button
                if (element.classList.contains('copy-button')) {
                    const originalText = element.textContent;
                    element.textContent = 'Zkopírováno!';
                    element.classList.add('copied');
                    
                    setTimeout(() => {
                        element.textContent = originalText;
                        element.classList.remove('copied');
                    }, 2000);
                }
            }).catch(function(err) {
                console.error('Chyba při kopírování: ', err);
                // Fallback for older browsers
                fallbackCopyTextToClipboard(text);
            });
        }

        function fallbackCopyTextToClipboard(text) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showToast();
                }
            } catch (err) {
                console.error('Fallback: Chyba při kopírování', err);
            }
            
            document.body.removeChild(textArea);
        }

        function showToast() {
            const toast = document.getElementById('toast');
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    </script>
</main>

<?php require __DIR__ . '/partials/footer.php'; ?>
