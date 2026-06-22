# Design: E-shop on Next.js + Netlify (replacing the Forpsi PHP shop)

**Date:** 2026-06-22
**Status:** Approved (architecture); pending spec review
**Update 2026-06-22 (v2):** Pivoted host **Vercel → Netlify** (free Starter allows commercial use; Vercel Hobby forbids checkout, Pro is ~$20/mo). DB is now **Neon direct** (host-independent); images use **Netlify Blobs**; mailbox is the org's **approved Google Workspace** (Forpsi mail ends 29 Jun); migration source is the **local Forpsi backup snapshot** in `web/data/forpsi-export/` (already exported). Domain stays registered at Forpsi (renewed) — only DNS records get repointed at cutover.
**Branch:** `vercel-nextjs-rewrite`
**App:** `web/` (Next.js 16, React 19, Tailwind 4, App Router)

## Problem

`nechmerust.org` runs on Forpsi shared hosting as a static HTML site with a PHP+MySQL
e-shop (`www/`). A new Next.js site (`web/`) is being built to replace it on Netlify.
The shop is the largest remaining backend piece on Forpsi. Today the new site's
`/obchod` is a "coming soon" placeholder; the real products (~26 items) live only in
the Forpsi MySQL DB (`f193818`) and their photos only on Forpsi (`/images/products/*.webp`).

## Goal

A fully functional e-shop inside the `web/` Next.js app, deployed on Netlify with its own
database, so the new site can replace the Forpsi shop. Bank-transfer payment only
(no card gateway). A single-account admin panel to manage products, categories, photos,
and orders.

## Scope

**In scope (this spec):**
- Neon Postgres database (free tier, host-independent) with the e-shop schema.
- One-time data migration of products + categories + product photos from the live
  Forpsi backup snapshot into Neon + Netlify Blobs.
- Public shop: product listing with category filter, product detail with photo gallery.
- Cart (client-side, localStorage) + checkout + order creation (bank transfer).
- Order confirmation emails (customer + admin) via Forpsi SMTP.
- Single-account admin panel: login, products CRUD + photo upload, categories, orders.

**Out of scope (separate follow-up sub-projects, not built here):**
- Event registration form (`nechmerust_api.php`) → its own migration.
- Newsletter signup (`newsletter_signup_api.php`) → its own migration.
- Historical order data — **not migrated**; old orders stay on Forpsi for archive,
  the new shop starts fresh.
- Card payment gateway (Stripe/GoPay/Comgate).
- The actual DNS cutover of `nechmerust.org` (user action; see Cutover section).

## Stack decisions

| Concern | Decision | Rejected alternative |
|---|---|---|
| Hosting | **Netlify** (free Starter — commercial use allowed) | Vercel Hobby forbids commercial/checkout; Pro ~$20/mo |
| Database | **Neon Postgres** (free tier, host-independent) + **Drizzle ORM** | Stay on MySQL — friction, leaving Forpsi anyway |
| Product images | **Netlify Blobs** (writable; served same-origin via `/img/[...key]` route) | Commit to `public/` — new photos would need a redeploy |
| Admin auth | One account; bcrypt hash in `admins` table; session via **iron-session** (encrypted cookie); guarded in admin server layout | Clerk/Auth.js — overkill for one user |
| Email (mailbox) | **Google Workspace** (approved nonprofit grant) for `info@nechmerust.org` | Forpsi mail ends 29 Jun; Zoho free lacks SMTP/IMAP |
| Email (app-sent orders) | **Resend** free tier (or Workspace SMTP) via **nodemailer** | — |
| Payment | Bank transfer + variable-symbol generation (port of existing logic) | Card gateway (declined) |
| Runtime | Node.js runtime for DB/email/auth routes & server actions | Edge — incompatible with bcrypt/nodemailer/pg driver |

Everything lives in the single `web/` app and ships in one Netlify deploy.

## Data model (Postgres / Drizzle)

Ported from `www/scripts/01-create-tables.sql`. Schema in `web/lib/db/schema.ts`.

- **categories**: `id` (pk), `name`, `slug` (unique), `description`, `display_order`, `created_at`.
- **products**: `id` (pk), `name`, `slug` (unique), `description`, `price` `numeric(10,2)`,
  `stock_quantity` (int, default 0), `category_id` (fk → categories, null on delete),
  `image_url`, `is_active` (boolean, default true), `created_at`, `updated_at`.
- **product_images**: `id` (pk), `product_id` (fk → products, cascade), `image_url`, `display_order`.
- **orders**: `id` (pk), `order_number` (unique), `variable_symbol`, `customer_name`,
  `customer_email`, `customer_phone`, `shipping_address`, `total_amount` `numeric(10,2)`,
  `status` (enum: pending|paid|processing|shipped|completed|cancelled, default pending),
  `payment_method` (default `bank_transfer`),
  `payment_status` (enum: pending|completed|failed|refunded, default pending),
  `notes`, `customer_ip`, `created_at`, `updated_at`.
- **order_items**: `id` (pk), `order_id` (fk → orders, cascade), `product_id` (fk → products,
  null on delete), `product_name`, `quantity`, `unit_price` `numeric(10,2)`, `total_price` `numeric(10,2)`.
- **admins**: `id` (pk), `username` (unique), `password_hash`, `email`, `created_at`,
  `last_login_at`, `last_login_ip`. (One row.)

`image_url` stores a **same-origin `/img/<key>` path** served from Netlify Blobs by a route handler (not a `/images/...` path).

## Components & interfaces

### Data layer — `web/lib/db/`
- `schema.ts` — Drizzle table definitions + enums.
- `index.ts` — Drizzle client over `@neondatabase/serverless`, reads `DATABASE_URL`.
- `queries.ts` — typed read helpers: `getActiveProducts({categorySlug?})`, `getProductBySlug(slug)`,
  `getProductImages(productId)`, `getCategoriesWithCounts()`, `getOrderByNumber(n)`,
  plus admin queries. **Single source of truth for product data.**

### Public shop (Server Components, read from DB)
- `app/obchod/page.tsx` — product grid + category filter (filter via `?kategorie=slug`
  searchParam, server-rendered). Reuses existing design tokens/components
  (`Container`, `PageHero`, `Reveal`, `SocialSection`; moss/cream/surface palette,
  `rounded-pill`, `font-serif`). Replaces the current placeholder; remove `robots: noindex`.
- `app/obchod/[slug]/page.tsx` — product detail: photo gallery (main `image_url` +
  `product_images`), name, price, description, stock state, add-to-cart button.
  Dynamically rendered from the DB (always fresh after admin edits); `generateMetadata`
  per product. Admin create/update/delete calls `revalidatePath` for `/obchod` and the
  product page.
- `components/shop/ProductCard.tsx`, `ProductGallery.tsx`, `CategoryFilter.tsx`,
  `AddToCartButton.tsx` (client), `Price.tsx` (Kč formatting).

### Cart (client, localStorage) — mirrors current behavior
- `lib/cart.ts` — cart store keyed `nmr_cart`, items `{ id, quantity }` only (no prices).
- `components/shop/CartProvider.tsx` (context) + `CartButton` (count badge in `Navbar`).
- `app/obchod/kosik/page.tsx` — cart contents (hydrates product data from DB by id via a
  small read route/server action), quantity edit, remove, subtotal, → checkout.

### Checkout & order creation
- `app/obchod/pokladna/page.tsx` — form: `customer_name*`, `customer_email*`,
  `customer_phone`, `street*`, `city*`, `postal_code*` (joined into `shipping_address`),
  `notes`, payment = bank transfer (fixed). Order summary; shipping shown as "Dle dohody".
- `app/obchod/actions.ts` → `createOrder(input)` **Server Action** (Node runtime):
  1. Rate-limit per IP (port of `check_rate_limit`, 5 / 60s): before insert, count
     `orders` rows with the same `customer_ip` created in the last 60s; if ≥5, return 429.
     No extra table or external store needed (works on serverless).
  2. Validate + sanitize inputs (email via zod, length caps matching PHP: name 100,
     address 500, notes 1000, ≤50 items).
  3. **Re-read price/name/stock from DB per `product_id`** where `is_active`. Never trust
     client prices/names. Compute `total_amount` server-side.
  4. **Transaction**: hard stock check (reject if `quantity > stock_quantity` for one-offs),
     insert `orders` + `order_items`, decrement `stock_quantity`.
  5. `order_number` = `{ORDER_PREFIX}-{YYYYMMDD}-{6 hex}`; `variable_symbol` = first 10
     digits of order number (fallback random 10-digit). Port of `generateVariableSymbol`.
  6. Send emails (customer confirmation w/ bank details + VS; admin notification).
     Email failure must NOT roll back the order (log + continue).
  7. Return `{ orderNumber }`; client clears cart and navigates to confirmation.
- `app/obchod/objednavka/[orderNumber]/page.tsx` — server page; looks up order by number,
  shows confirmation: items, total, bank details (from env), variable symbol. Refresh-safe.

### Email — `web/lib/email.ts`
- nodemailer transport from `SMTP_*` env (Forpsi). `sendOrderEmails(order)` builds the
  same two plaintext messages as `sendOrderEmails()` in PHP (customer + admin), UTF-8.

### Payment helpers — `web/lib/payment.ts`
- `generateOrderNumber()`, `generateVariableSymbol(orderNumber)`, `getBankDetails()` (from env).

### Admin panel (`app/admin/`, Node runtime, guarded)
- `app/admin/layout.tsx` — server layout: `getSession()`; redirect to `/admin/login`
  if not authenticated. Renders admin chrome (header + sidebar).
- `lib/auth.ts` — iron-session config (`SESSION_SECRET`), `getSession()`, `login(user,pass)`
  (bcryptjs compare against `admins` row, update `last_login_*`), `logout()`.
- `app/admin/login/page.tsx` + login Server Action.
- `app/admin/page.tsx` — dashboard (counts: products, active, orders by status, recent orders).
- `app/admin/products/page.tsx` (list) + `app/admin/products/new` + `app/admin/products/[id]`
  (edit). Fields per `product-edit.php`: name, slug (auto-slug from name, `^[a-z0-9-]{2,200}$`),
  category, description, price (>0), stock_quantity, image_url, is_active; gallery add/delete.
  Mutations via Server Actions (CSRF handled by Next.js action origin checks).
- `app/admin/categories/page.tsx` — CRUD (name, slug, description, display_order).
- `app/admin/orders/page.tsx` (list, filter by status) + `app/admin/orders/[id]` (detail,
  change `status`/`payment_status`).
- Image upload: Server Action using `lib/storage.ts` `saveImage()` (Netlify Blobs; max 5 MB;
  jpg/png/webp); stores a same-origin path `/img/<key>` in `image_url` / `product_images`.

### Migration — `web/scripts/migrate-from-forpsi.ts` (run locally, one-off)
- Reads from the **local backup snapshot** `web/data/forpsi-export/` (`categories.json`,
  `products.json`, `images/`) — already exported, so Forpsi can go offline.
- For each image file: upload to Netlify Blobs → store the `/img/<key>` path.
- Insert categories, products (with `/img/<key>` image_url) into Neon.
- Idempotent on `slug` (upsert) so it can be re-run. Creates the admin row separately via
  `web/scripts/create-admin.ts` (prompts for password, bcrypt hash).

## Security invariants (preserved from PHP)
- Order prices/names/stock are read **server-side from the DB**; client cart sends
  `{id, quantity}` only.
- All DB access via Drizzle parameterized queries.
- All mutations are Server Actions (Next.js origin/CSRF protection) or Node route handlers;
  admin actions re-check session server-side.
- Input validated + length-capped (zod) before any DB write.
- Secrets (DB URL, SMTP/Resend, bank, session secret) in Netlify env vars only;
  never sent to the client, never committed.
- `admins` password is bcrypt; session cookie is encrypted (iron-session).

## Environment variables (Netlify)
Set in Netlify (Site config → Environment variables):
- `DATABASE_URL` — Neon connection string (from neon.tech).
- Email send: either `SMTP_*` (Google Workspace / Resend SMTP) **or** `RESEND_API_KEY` —
  `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME`.
- `BANK_NAME`, `BANK_ACCOUNT`, `BANK_IBAN`, `BANK_SWIFT`, `ORDER_PREFIX`, `ADMIN_NOTIFICATION_EMAIL` (copy from `www/.env`).
- `SESSION_SECRET` (32+ random chars).
- Netlify Blobs needs **no token in production**. For local one-off scripts (migration) set
  `NETLIFY_SITE_ID` + `NETLIFY_AUTH_TOKEN` (a personal access token) so the script can write blobs.

## Error handling
- Order action: on validation error → field-level message; on DB error → roll back
  transaction, log server-side, return generic message (no DB strings to client),
  matching the PHP behavior. On email error → log, keep the order, still confirm.
- Out-of-stock at checkout → clear message naming the product; cart preserved.
- Admin: friendly messages for duplicate slug (unique violation), upload too large /
  wrong type, invalid login.
- DB/Blob/SMTP misconfiguration → server log + safe user-facing error; never leak config.

## Testing strategy
- **Unit:** `generateVariableSymbol`, `generateOrderNumber`, cart subtotal, the
  price-resolution helper (rejects unknown/inactive ids, ignores client prices).
- **Integration:** `createOrder` against a test Neon branch — happy path, tampered price
  ignored, out-of-stock rejected, stock decremented, order+items rows correct.
- **E2E (Playwright via webapp-testing skill):** browse → filter → product → add to cart →
  checkout → confirmation shows VS + bank details; admin login → create product → it
  appears in `/obchod`; upload a photo → renders.
- **Manual:** place a real test order, confirm both emails arrive (Workspace/Resend SMTP); verify
  a Blob upload renders.

## Cutover (later; user-assisted) — domain stays at Forpsi, only DNS records move
The domain `nechmerust.org` is registered at Forpsi and renewed, so registration is safe;
Forpsi keeps serving DNS as long as registration is active. At cutover, in the Forpsi DNS panel:
- Point web records (A `@` / CNAME `www`) at **Netlify**.
- Point **MX** (and SPF/DKIM TXT) at **Google Workspace** — Forpsi mailboxes end 29 Jun, so this
  must be done by then for `info@nechmerust.org` to keep receiving mail.
- App order emails are sent via Workspace/Resend (not Forpsi SMTP), so they're unaffected by the host move.

## Notes
- `web/AGENTS.md`: this is Next.js 16 with breaking changes — implementation must follow the
  in-repo docs (`node_modules/next/dist/docs/`), e.g. async `params`/`searchParams`. Verify
  Netlify's Next.js runtime supports 16; fallback host that runs `next start` (e.g. Render) if not.
- Netlify free Starter permits this nonprofit shop (commercial use allowed; only reselling Netlify hosting is barred).
