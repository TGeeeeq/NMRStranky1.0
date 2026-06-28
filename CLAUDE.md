# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git workflow

**Default: commit and push everything straight to `main`** unless the user explicitly says otherwise. Don't create or push to feature branches by default, and don't wait for a separate "merge to main" step — main is the working branch here.

## What this repo is

Website for **Nech mě růst z.s.**, a Czech non-profit (nechmerust.org). The deployable site lives entirely in `www/`. It is a **static multi-page HTML site with a PHP+MySQL backend** for an e-shop, admin panel, event registration, and newsletter signup. Hosted on Forpsi shared hosting (Apache + PHP 7.1+ + MySQL 5.7+).

There is no git repo, no test suite, and no package manager for the live site. There IS a tiny build step: `python3 build.py` (repo root) renders `www/*.php` source pages → `www/*.html` artifacts that ship to production. Forpsi serves the static HTML; PHP partials don't execute there.

## Critical: dead Next.js scaffolding

`www/` contains a v0.dev-generated Next.js skeleton that is **not used** by the live site. Do NOT edit or rely on these unless the user explicitly asks to migrate to Next.js:

- `www/app/` (`layout.tsx`, `page.tsx`, `globals.css`)
- `www/components/`, `www/hooks/`, `www/lib/`
- `www/styles/globals.css`
- `www/public/`
- `www/assets/package.json`, `www/assets/next.config.mjs`
- `www/components.json` (shadcn config)

The live site is the **flat `.html` files at `www/` root** + `www/api/` + `www/admin/` + `www/obchod/` + `www/config*.php`. `www/assets/` itself **is used** — it holds the real `.webp` images and self-hosted fonts.

**The 13 `*.html` pages at `www/` root are build artifacts.** Edit `www/*.php` sources (which `require` `www/partials/*.php`) and run `python3 build.py` from the repo root to regenerate. Editing `*.html` directly works but is overwritten on the next build. Five partials live in `www/partials/`: `head.php`, `navbar.php`, `footer.php`, `social.php`, `newsletter.php`. PHP is the source-of-truth language; Forpsi serves the rendered HTML.

## Architecture

### Routing
`www/.htaccess` rewrites `/foo` → `/foo.html` internally, sets a `/404.html` error doc, and denies web access to `.env`, `composer.*`, `package*.json`, `README.md`, `CLAUDE.md`, etc. Apache modules required: `mod_rewrite`, `mod_headers`, `mod_deflate`, `mod_expires`.

### Frontend
- One stylesheet for the public site: [www/styles.css](www/styles.css). `www/css/` has shop/admin-specific CSS (`shop.css`, `admin.css`, `checkout.css`, `product-detail.css`, `notifications.css`).
- One main JS entry: [www/script.js](www/script.js) defines `WebsiteManager` (navigation, animations, cookie consent, conditional Google Analytics load, **cs/en language switching** via `data-cs` / `data-en` attributes + `localStorage.language`).
- Gallery: [www/gallery.js](www/gallery.js). Animal list is **hardcoded** (30 animals × up to 8 images each, file paths derived by accent-stripping the Czech name).
- Shop frontend: `www/js/shop.js`, `www/js/product-detail.js`, `www/js/checkout.js`. Cart lives in `localStorage`.
- PWA: [www/sw.js](www/sw.js) + [www/manifest.json](www/manifest.json). Cache version is bumped in `sw.js` — update it when shipping new static assets.

### Backend (PHP)
Every PHP entry point begins with `require_once __DIR__ . '/config.php'` (or the equivalent relative path). That file is the security hub — do not bypass it.

- [www/config.php](www/config.php) — session bootstrap (secure cookies, 30-min ID rotation, 1h idle GC), `csrf_token()` / `verify_csrf_token()` / `csrf_field()`, admin auth (`isAdminLoggedIn()`, `requireAdmin()`, `adminLogin()`, `adminLogout()` — IP-bound, 4h idle timeout, regenerates session ID on login), `check_rate_limit($key, $limit, $window)` (session-backed, per-browser), `sanitize_input()` (`strip_tags` + `htmlspecialchars`), `get_client_ip()` (honors `X-Forwarded-For` for Forpsi proxy).
- [www/config/env.php](www/config/env.php) — `.env` parser.
- [www/config/database.php](www/config/database.php) — PDO singleton + `app_config()` getter (SMTP, bank, order prefix).
- [www/config/payment.php](www/config/payment.php) — variable-symbol generation for bank transfers (no payment gateway; bank transfer only).
- [www/config/session.php](www/config/session.php) — legacy shim, just re-includes `config.php`.

Top-level API endpoints:
- [www/nechmerust_api.php](www/nechmerust_api.php) — event registration (POST). PHPMailer sends admin notification + user confirmation.
- [www/newsletter_signup_api.php](www/newsletter_signup_api.php) — newsletter signup (POST). Personalizes the [www/newsletter-email.html](www/newsletter-email.html) template.

Shop API ([www/api/](www/api/)): `products.php`, `categories.php`, `product-detail.php`, `product-detail-with-images.php`, `product-images.php`, `product-images-add.php` (admin), `product-images-delete.php` (admin), `admin-upload-image.php` (admin), `create-order.php`, `create-payment.php`, `payment-notify.php` (currently a stub).

Admin panel ([www/admin/](www/admin/)): `login.php`, `logout.php`, `dashboard.php`, `products.php`, `product-edit.php`, `categories.php`, `orders.php`, `order-detail.php`. All non-login pages must call `requireAdmin()`.

### Security invariants — preserve these when editing
- All user input goes through `sanitize_input()`; all DB writes use PDO prepared statements.
- All admin POST forms include `csrf_field()` and call `verify_csrf_token($_POST['csrf_token'])`.
- **Shop order prices are read from the DB inside `api/create-order.php`** — never trust prices, names, or stock counts coming from the client cart payload. The client sends `{product_id, quantity}` only.
- `.env` (SMTP creds, DB creds, bank account, `ADMIN_NOTIFICATION_EMAIL`, `ORDER_PREFIX`) is gitignored and Apache-blocked. Don't print, log, or commit its contents.
- PHPMailer is loaded from `vendor/autoload.php` — there is no `composer.json` committed, so the vendor dir must be installed manually on the server.

## Czech filename → meaning

| File | Meaning |
|---|---|
| `index.html` | Home |
| `landing.html` | Landing page variant |
| `o-nas.html` | About us |
| `novinky.html` | News |
| `udalosti.html` | Events |
| `galerie.html` | Gallery |
| `jak-se-zapojit.html` | Get involved |
| `kontakt.html` | Contact |
| `obchod/` | Shop (e-commerce) |
| `virtualni-adopce.html` | Virtual adoption |
| `zvireci-obyvatele.html` | Animal residents |
| `prispet-kryptem.html` | Donate with crypto |
| `putovani-se-zviraty.html` | Hiking with animals |
| `mezilesy.html` | "Mezilesy" project page |
| `vop.html` | Terms & conditions |
| `gdpr.html` | Privacy policy |

The site is Czech-first; English strings live in `data-en` attributes alongside `data-cs` and are swapped client-side by `WebsiteManager` (`www/script.js`). There is no `/en/` directory.

## Database

MySQL, `utf8mb4`. Schema and seed live in `www/scripts/`:
- `www/scripts/01-create-tables.sql` — products, categories, orders, admins, product images.
- `www/scripts/02-seed-data.sql` — initial categories/products + admin user. Check this file to learn how the first admin account is created (password is hashed with `password_hash()`).

## Develop & deploy

There is no linter or test runner. The build step is intentionally minimal — a single Python file with no dependencies.

- **Local dev (page preview)**: `python3 dev_server.py` from the repo root → `http://localhost:8767`. Renders `*.php` live (no PHP CLI needed). The renderer supports a constrained PHP subset; avoid logical AND/OR, ternary-with-concat, PHPDoc comments, mixing `foreach` declarations with body statements in one `<?php ?>` tag.
- **Local dev (PHP backends)**: the API endpoints, admin panel, and shop need real PHP and MySQL. Point Apache or `php -S localhost:8000 -t www/` at `www/`, create a local MySQL DB, import `www/scripts/01-create-tables.sql` + `02-seed-data.sql`, and write `www/.env` with the production keys (`DB_*`, `SMTP_*`, `BANK_*`, `ADMIN_NOTIFICATION_EMAIL`, `ORDER_PREFIX`).
- **Install PHPMailer** on the server: `composer require phpmailer/phpmailer` inside `www/` (no `composer.json` is committed).
- **Build before deploy**: `python3 build.py` (repo root) — renders `www/*.php` → `www/*.html`.
- **Cache-bust PWA**: increment `CACHE_NAME` at the top of `www/sw.js` after any CSS/JS/HTML change or returning visitors will see stale assets.
- **Deploy**: rsync `www/` to the Forpsi web root. `.env` and `vendor/` must already exist on the server.

For step-by-step deploy guidance see the `nechmerust-deploy` skill.

## Conventions when adding pages or endpoints

- New public pages: drop `slug.html` at `www/` root. `.htaccess` makes it reachable at `/slug`. Add bilingual strings with `data-cs` / `data-en`. Link the new file from `www/sw.js`'s precache list if it should work offline. Add it to `www/sitemap.xml`.
- New admin pages: place in `www/admin/`, call `requireAdmin()` at the top, embed `csrf_field()` in any form, verify with `verify_csrf_token()` on POST.
- New API endpoints: `require_once` `config.php`, set `Content-Type: application/json`, validate input with `sanitize_input()`, return `{"success": bool, ...}`. Same-origin only — do not add wildcard CORS.
