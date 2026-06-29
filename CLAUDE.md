# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git workflow

**Everything goes to `main`. Always.** `main` is the single source of truth and is connected to **production** — pushing to `main` ships the site. Commit and push every change straight to `main`; never create, keep, or push to feature branches, and don't wait for a separate "merge to main" step.

If a task/harness forces work onto a `claude/*` (or any non-`main`) branch, treat that branch as throwaway: when the work is done, fast-forward/merge it into `main`, push `main`, and **delete the feature branch both locally and on the remote**. The end state must always be: only `main` exists, and it holds the newest version of everything.

## What this repo is

Website for **Nech mě růst z.s.**, a Czech non-profit (nechmerust.org) — an animal sanctuary ("the Louka"). It includes public marketing pages, an e-shop, an admin panel, and an Instagram-carousel "studio" tool.

The site is a **Next.js 16 (App Router) application written in TypeScript and React 19**, styled with **Tailwind CSS v4**. The whole app lives in `web/`. Data is stored in **PostgreSQL (Neon)** via **Drizzle ORM**, product images live in **Netlify Blobs**, and the site is **deployed to Netlify** (base directory `web`, `@netlify/plugin-nextjs`).

> **History:** This used to be a static HTML + PHP/MySQL site served from a `www/` directory on Forpsi shared hosting. **That PHP site no longer exists** — it has been fully rewritten as the Next.js app described here. There is no `www/`, no PHP, no Apache `.htaccess`, and no `build.py` step anymore. If you find references to any of that (in old skills, comments, or memory), they are stale.

## Layout

Everything is under `web/`. Run all commands from there.

- `web/app/` — App Router pages and routes. One folder per route segment with a `page.tsx`.
- `web/components/` — shared React components (`Container`, `PageHero`, `Reveal`, `SectionHeader`, `SocialSection`, …), plus subfolders `admin/`, `shop/`, `studio/`, and `ui/` (small Radix-based primitives).
- `web/lib/` — server/runtime helpers. Notably `db/` (Drizzle), `auth.ts`, `env.ts`, `storage.ts`, `email.ts`, `payment.ts`, `orders.ts`, `cart.ts`, `validation.ts`, `site.ts`, `nav.ts`, `cn.ts`.
- `web/lib/db/` — `schema.ts` (Drizzle tables), `queries.ts` (typed query helpers), `index.ts` (the `db` singleton).
- `web/drizzle/` — generated SQL migrations (`db:generate` writes here).
- `web/scripts/` — one-off Node/Python scripts: `create-admin.mts` (create an admin user), `migrate-from-forpsi.mts` + `export-forpsi.py` (the original data migration).
- `web/data/forpsi-export/` — JSON + image snapshot of the old shop data, used by the migration script.
- `web/public/assets/` — `.webp` images for animals, heroes, partners, etc.
- `web/tests/` — Vitest unit/integration tests and Playwright e2e specs.

## Architecture

### Public site
- Pages are **React Server Components** by default. Add `"use client"` only where interactivity needs it (e.g. `Reveal`, cart, forms).
- Shared layout/chrome lives in `app/layout.tsx` (+ `template.tsx` for per-page transitions). The global stylesheet and design tokens are in `app/globals.css` — colors are CSS custom properties (`--color-moss`, `--color-cream`, `--color-terracotta`, `--color-accent`, `--color-surface`, …) consumed through Tailwind classes like `bg-moss`, `text-cream`, `border-border`.
- Compose pages from the shared components rather than hand-rolling markup. A typical inner page is `PageHero` → one or more `<section>`s wrapped in `Container` + `Reveal`, ending with `SocialSection`. See `app/o-nas/page.tsx` and `app/vyrocni-zprava-2025/page.tsx` for the pattern.
- Site-wide constants (name, address, IČ, bank, social links) live in `lib/site.ts` — import `SITE` / `BANK` / `SOCIAL`, don't hard-code.
- SEO: every page exports `metadata` with a `title`, `description`, and `alternates.canonical`. New public routes must also be added to `app/sitemap.ts`. Navigation lives in `lib/nav.ts`.
- The site is Czech-first. Copy is written directly in the JSX in Czech (there is **no** `data-cs`/`data-en` switching anymore).

### E-shop
- Catalog, cart, checkout under `app/obchod/`; shop UI in `components/shop/` (cart state via `CartProvider`, persisted in `localStorage`). Cart logic helpers are in `lib/cart.ts`.
- Orders are placed through **Server Actions** (`app/obchod/actions.ts`), which use `db.transaction()`.
- **Order prices, names, and stock are read from the DB server-side** — never trust amounts coming from the client cart. The client sends product ids + quantities only. Keep this invariant.
- Payment is **bank transfer only** (variable-symbol generation in `lib/payment.ts`); there is no payment gateway.

### Admin panel
- Under `app/admin/`. `app/admin/login/` is public; everything under `app/admin/(panel)/` is gated.
- Auth uses **`iron-session`** (encrypted cookie `nmr_admin`) with **bcrypt**-hashed passwords. `lib/auth.ts` exposes `getSession()` and `requireAdmin()` (which `redirect`s to `/admin/login`). Every protected page/action must call `requireAdmin()`.
- Admin mutations are Server Actions (`app/admin/actions.ts`). Validate input with the Zod schemas in `lib/validation.ts`.
- Product images are uploaded to Netlify Blobs via `lib/storage.ts` and served same-origin through the `app/img/[...key]/route.ts` handler (stored as `/img/<key>`).

### Studio
- `app/studio/` is an internal tool for generating Instagram-carousel slides (client-side canvas + `html-to-image`/`jszip` export). Components in `components/studio/`.

### Config & secrets
- All env access goes through `lib/env.ts` (`req()` throws if a required var is missing; `opt()` has fallbacks). Don't read `process.env` directly elsewhere.
- Required: `DATABASE_URL`, `SESSION_SECRET`. Optional/with-fallbacks: `SMTP_*`, `BANK_*`, `ORDER_PREFIX`, `ADMIN_NOTIFICATION_EMAIL`, `NETLIFY_SITE_ID`, `NETLIFY_AUTH_TOKEN`.
- Secrets live in `web/.env.local` (gitignored). Never print, log, or commit them. `lib/db/`, `lib/auth.ts`, `lib/env.ts`, `lib/storage.ts` are all `import "server-only"` — keep secret-touching code server-side.

## Database

PostgreSQL on Neon, accessed with Drizzle ORM (`@neondatabase/serverless` Pool driver so transactions work).
- Schema: `lib/db/schema.ts` (categories, products, product images, orders, order items, admins).
- After editing the schema: `npm run db:generate` (writes SQL to `drizzle/`) then `npm run db:migrate`. `npm run db:studio` opens Drizzle Studio.
- Create an admin: `npm run admin:create`.

## Develop, test, deploy

All from `web/`:
- **Install**: `npm install`.
- **Dev server**: `npm run dev` → http://localhost:3000. Needs `web/.env.local` (at minimum `DATABASE_URL`, `SESSION_SECRET`) for DB-backed routes; static marketing pages render without it.
- **Lint**: `npm run lint`. **Typecheck**: `npx tsc --noEmit`.
- **Tests**: `npm test` (Vitest unit/integration), `npm run test:e2e` (Playwright). Add/maintain tests for shop, cart, payment, validation, and order logic.
- **Build**: `npm run build`. Note: the production build collects page data and will fail without `DATABASE_URL` set (e.g. on `/obchod/cart-data`) — that's an env requirement, not a code error.
- **Deploy**: push to `main`; Netlify builds from base directory `web` (see `netlify.toml`).

## Conventions when adding pages or endpoints

- **New public page**: create `app/<slug>/page.tsx` as a Server Component, export `metadata` (title/description/canonical), build it from the shared components (`PageHero`, `Container`, `Reveal`, `SectionHeader`, `SocialSection`), write copy in Czech, and add the route to `app/sitemap.ts` (and `lib/nav.ts` if it belongs in the menu).
- **New admin page/action**: place under `app/admin/(panel)/`, call `requireAdmin()` first, validate input with Zod (`lib/validation.ts`), do DB work via `lib/db`.
- **New API route handler**: keep it same-origin (no wildcard CORS), validate input, and access secrets only through `lib/env.ts`.
- Reuse the design tokens and components; match the surrounding code's style.
