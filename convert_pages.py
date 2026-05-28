#!/usr/bin/env python3
"""One-shot conversion of *.html → *.php using partials/* for shared chrome.

Run from project root. Re-runnable: skips files where .php already exists.
"""
import os
import re

WWW = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'www')

SKIP = {'404.html', 'newsletter-email.html', 'mezilesy.html', 'landing.html'}

# slug -> (CS title, EN title, description, og_image)
META = {
    'o-nas': (
        'O nás', 'About Us',
        'Příběh azylu Nech mě růst — proč pomáháme zvířatům a co je naším posláním.',
        '/assets/about-hero.webp',
    ),
    'udalosti': (
        'Události', 'Events',
        'Brigády, festivaly a setkání se zvířaty na Louce — přijďte zažít náš každodenní život v souznění s přírodou.',
        '/assets/hero-image.webp',
    ),
    'kontakt': (
        'Kontakt', 'Contact',
        'Adresa, e-mail a otevírací doba azylu Nech mě růst. Domluvte si návštěvu na Louce.',
        '/assets/about-hero.webp',
    ),
    'galerie': (
        'Galerie', 'Gallery',
        'Fotografie zvířat z azylu Nech mě růst — Princezna, Ronja, Áda a další obyvatelé Louky.',
        '/assets/animals-hero.webp',
    ),
    'novinky': (
        'Novinky', 'News',
        'Aktuální dění v azylu Nech mě růst — nově přijatá zvířata, brigády a komunitní příběhy.',
        '/assets/hero-image.webp',
    ),
    'zvireci-obyvatele': (
        'Zvířecí obyvatelé', 'Animal Residents',
        'Poznejte zvířata, která našla domov v azylu Nech mě růst — koně, prasata, ovce, kozy, psi a další.',
        '/assets/animals-hero.webp',
    ),
    'jak-se-zapojit': (
        'Jak se zapojit', 'Get Involved',
        'Brigády, dobrovolnictví a finanční podpora — jak nám můžete pomoci v péči o zvířata na Louce.',
        '/assets/hero-image.webp',
    ),
    'virtualni-adopce': (
        'Virtuální adopce', 'Virtual Adoption',
        'Adoptujte zvíře na dálku — pravidelným příspěvkem pomůžete s péčí o konkrétního obyvatele Louky.',
        '/assets/adoption-hero.webp',
    ),
    'prispet-kryptem': (
        'Přispějte kryptoměnou', 'Donate with Crypto',
        'Podpořte azyl Nech mě růst kryptoměnou — Bitcoin, Ethereum, Cardano a další.',
        '/assets/hero-image.webp',
    ),
    'putovani-se-zviraty': (
        'Putování se zvířaty', 'Wandering with Animals',
        'Dvoudenní putování středočeskou krajinou v doprovodu psů, osla, muflona a dalších zvířecích přátel.',
        '/assets/hero-image.webp',
    ),
    'gdpr': (
        'Zásady ochrany osobních údajů', 'Privacy Policy',
        'Jak zpracováváme osobní údaje návštěvníků a odběratelů newsletteru — zásady ochrany osobních údajů.',
        '/assets/logo.png',
    ),
    'vop': (
        'Obchodní podmínky', 'Terms & Conditions',
        'Obchodní podmínky e-shopu azylu Nech mě růst — platba, doprava, reklamace.',
        '/assets/logo.png',
    ),
    'index': (
        'Domů', 'Home',
        'Nech mě růst z.s. je nezisková organizace s vizí tvorby rodového statku, kde žijeme v harmonii s přírodou, zvířaty i sebou navzájem.',
        '/assets/hero-image.webp',
    ),
}


def extract_body_inner(html):
    """Return everything inside <body>...</body> minus <nav class="navbar"> block and <footer> block."""
    m = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
    if not m:
        return html
    body = m.group(1)

    # Strip skip-link line
    body = re.sub(r'<a[^>]*class="[^"]*skip-link[^"]*"[^>]*>.*?</a>\s*', '', body, flags=re.DOTALL)

    # Strip <nav class="navbar"...> ... </nav>
    body = re.sub(r'<!--\s*Navigation\s*-->\s*', '', body, flags=re.IGNORECASE)
    body = re.sub(r'<nav[^>]*class="[^"]*navbar[^"]*"[^>]*>.*?</nav>\s*', '', body, flags=re.DOTALL | re.IGNORECASE)

    # Strip footer
    body = re.sub(r'<!--\s*Footer\s*-->\s*', '', body, flags=re.IGNORECASE)
    body = re.sub(r'<footer[^>]*>.*?</footer>\s*', '', body, flags=re.DOTALL | re.IGNORECASE)

    # Strip trailing <script src="script.js">...</script>
    body = re.sub(r'<script[^>]*src="[^"]*script\.js"[^>]*></script>\s*', '', body, flags=re.IGNORECASE)
    # Strip trailing current-year init script
    body = re.sub(r'<script[^>]*>\s*//\s*Initialize year.*?</script>\s*', '', body, flags=re.DOTALL | re.IGNORECASE)
    body = re.sub(r"<script[^>]*>\s*document\.querySelectorAll\('\.current-year'\).*?</script>\s*", '', body, flags=re.DOTALL | re.IGNORECASE)

    return body.strip()


def wrap_main(content):
    """If content doesn't already have <main>, wrap it."""
    if re.search(r'<main\b', content, re.IGNORECASE):
        return content
    return '<main id="main-content">\n' + content + '\n</main>'


def make_php(slug, body_html):
    cs_title, _en_title, desc, og = META.get(slug, (slug, slug, '', '/assets/hero-image.webp'))
    if slug == 'index':
        page_slug = ''
        active = 'index'
    else:
        page_slug = slug
        active = slug
    desc_escaped = desc.replace("'", "\\'")
    return f"""<?php
$page_title = '{cs_title}';
$page_slug = '{page_slug}';
$active = '{active}';
$page_description = '{desc_escaped}';
$og_image = '{og}';
require __DIR__ . '/partials/head.php';
?>

<?php require __DIR__ . '/partials/navbar.php'; ?>

{wrap_main(body_html)}

<?php require __DIR__ . '/partials/footer.php'; ?>
"""


def main():
    converted = 0
    skipped = []
    for entry in sorted(os.listdir(WWW)):
        if not entry.endswith('.html'):
            continue
        if entry in SKIP:
            skipped.append((entry, 'in SKIP list'))
            continue
        slug = entry[:-5]
        php_path = os.path.join(WWW, slug + '.php')
        html_path = os.path.join(WWW, entry)
        if os.path.exists(php_path):
            skipped.append((entry, '.php already exists'))
            continue
        with open(html_path, 'r', encoding='utf-8') as f:
            html = f.read()
        body = extract_body_inner(html)
        php_src = make_php(slug, body)
        with open(php_path, 'w', encoding='utf-8') as f:
            f.write(php_src)
        converted += 1
        print(f'converted: {entry} -> {slug}.php  ({len(body)} chars body)')
    print(f'\n{converted} converted, {len(skipped)} skipped')
    for name, reason in skipped:
        print(f'  - {name}: {reason}')


if __name__ == '__main__':
    main()
