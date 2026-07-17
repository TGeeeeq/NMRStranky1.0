# nechmerust.org — web spolku Nech mě růst z.s.

Webové stránky neziskové organizace **Nech mě růst z.s.** — zvířecího azylu „Louka“ (Nová Ves u Leštiny). Veřejný web, e-shop, administrace a interní nástroje v jednom repozitáři.

> 📖 **Chcete jen upravit text, fotku nebo novinku na webu?** Nemusíte být programátor — otevřete **[MANUAL.md](MANUAL.md)**, návod krok za krokem pro netechnické redaktory (včetně doporučení, jak dávat lidem přístup).

---

## Jak web běží (hosting a nasazení)

```
 GitHub (main)  ──push──►  Vercel (build + hosting)  ──►  https://nechmerust.org
                                                            (DNS: Forpsi → Vercel)
```

- **Produkce = větev `main`.** Každý push na `main` Vercel automaticky sestaví a nasadí (root directory projektu je `web/`). Push na jinou větev vytvoří **preview deployment** s vlastní URL (u pull requestů ji Vercel komentuje přímo do PR).
- **Doména** `nechmerust.org` je registrovaná u Forpsi, DNS míří na Vercel.
- **Databáze**: PostgreSQL na [Neon](https://neon.tech) (produkty, objednávky, admin účty).
- **Obrázky produktů**: Netlify Blobs — Netlify účet slouží **pouze** jako úložiště blobs, web se na Netlify nestaví (`web/netlify.toml` má schválně `ignore = "exit 0"`).
- **E-maily** (potvrzení objednávek): SMTP.

<details>
<summary>Historie hostingu (proč jsou v repu stopy po PHP a Netlify)</summary>

1. Původní web byl statické HTML + PHP/MySQL na sdíleném hostingu Forpsi. Ten už neexistuje — skripty v kořenu repa (`build.py`, `deploy.sh`, `convert_pages.py`, …) jsou nefunkční pozůstatky z této éry.
2. Přepsaný Next.js web krátce běžel na Netlify (projekt `nechmerustorg`). Od července 2026 Netlify nebuildí; účet zůstává jen kvůli Netlify Blobs.
3. Dnes: **Vercel**.

</details>

## Technologie

| Vrstva | Technologie |
|---|---|
| Framework | **Next.js 16** (App Router, React Server Components) + **React 19**, **TypeScript** |
| Styly | **Tailwind CSS v4** (design tokeny jako CSS custom properties v `web/app/globals.css`) |
| Databáze | **PostgreSQL (Neon)** přes **Drizzle ORM** (`@neondatabase/serverless`) |
| Auth (admin) | **iron-session** (šifrovaná cookie) + **bcrypt** |
| Úložiště obrázků | **Netlify Blobs** (servírované same-origin přes `web/app/img/[...key]/route.ts`) |
| Testy | **Vitest** (unit/integration) + **Playwright** (e2e) |
| Hosting | **Vercel** (auto-deploy z GitHubu) |

## Struktura repozitáře

Celá aplikace žije ve **`web/`** — všechny příkazy spouštějte odtud.

```
web/
├── app/            # App Router — jedna složka = jedna stránka (page.tsx)
│   ├── admin/      # administrace e-shopu (iron-session, /admin/login veřejné)
│   ├── obchod/     # e-shop: katalog, košík, checkout (Server Actions)
│   ├── studio/     # interní nástroj na Instagram karusely
│   └── seno/       # sbírka Seno pro Louku (aktuálně skrytá — redirect na /)
├── components/     # sdílené komponenty (Container, PageHero, Reveal, …)
│   ├── admin/ shop/ studio/ ui/
├── lib/            # server helpery: db/, auth, env, storage, email, payment,
│                   # orders, cart, validation, site (konstanty), nav, campaign
├── drizzle/        # generované SQL migrace
├── public/assets/  # obrázky webu (.webp)
├── public/loukarun/app/  # hra Louka Run — kopie z repa TGeeeeq/loukarun, NEEDITOVAT
├── scripts/        # create-admin, sync-loukarun, migrace z Forpsi, QR sbírky
└── tests/          # Vitest + Playwright

docs/               # SETUP-eshop.md a další dokumentace
kampane/            # podklady kampaní (texty, prompty)
MANUAL.md           # návod na úpravy obsahu pro netechnické redaktory
CLAUDE.md           # instrukce pro AI asistenta (Claude Code)
```

## Architektura ve zkratce

- **Veřejný web**: React Server Components, `"use client"` jen kde je interaktivita. Stránky se skládají ze sdílených komponent (`PageHero` → sekce v `Container`+`Reveal` → `SocialSection`). Copy je česky přímo v JSX. Konstanty (adresa, IČ, účet, sociální sítě) v `web/lib/site.ts`. Každá stránka exportuje `metadata` a je v `web/app/sitemap.ts`.
- **E-shop**: objednávky přes Server Actions s `db.transaction()`; ceny, názvy a sklad se **vždy čtou z DB server-side** (klient posílá jen id + počty — tuhle invariantu zachovat). Platba pouze bankovním převodem (VS generuje `lib/payment.ts`).
- **Admin**: vše pod `app/admin/(panel)/` chrání `requireAdmin()`; vstupy validují Zod schémata v `lib/validation.ts`.
- **Env**: veškerý přístup přes `web/lib/env.ts`. Povinné: `DATABASE_URL`, `SESSION_SECRET`; v produkci navíc `NETLIFY_SITE_ID` + `NETLIFY_AUTH_TOKEN` (bez nich nefungují obrázky produktů). Volitelné: `SMTP_*`, `BANK_*`, `ORDER_PREFIX`, `ADMIN_NOTIFICATION_EMAIL`. Tajnosti patří do `web/.env.local` (gitignored) a na Vercel — nikdy do repa.

## Lokální vývoj

```bash
cd web
npm install
cp .env.local.example .env.local   # pokud existuje; jinak vytvořit ručně (DATABASE_URL, SESSION_SECRET)
npm run dev                        # http://localhost:3000
```

| Příkaz | Co dělá |
|---|---|
| `npm run dev` | dev server (statické stránky běží i bez DB) |
| `npm run lint` / `npx tsc --noEmit` | lint / typecheck |
| `npm test` | Vitest (integration testy vyžadují `DATABASE_URL`) |
| `npm run test:e2e` | Playwright |
| `npm run build` | produkční build (vyžaduje `DATABASE_URL`) |
| `npm run db:generate` → `npm run db:migrate` | migrace po změně `lib/db/schema.ts` |
| `npm run db:studio` | Drizzle Studio |
| `npm run admin:create` | založení admin účtu |

## Nasazení

Push na `main` → hotovo. Vercel web sestaví a nasadí sám (1–3 min). Když build selže, produkce zůstává na předchozí verzi — detaily v dashboardu Vercelu.

## Dokumentace

- **[MANUAL.md](MANUAL.md)** — úpravy obsahu pro netechnické (texty, fotky, novinky, zvířata, přístupová práva)
- **[CLAUDE.md](CLAUDE.md)** — podrobné technické konvence a pravidla repa (čte je i AI asistent)
- **[docs/SETUP-eshop.md](docs/SETUP-eshop.md)** — zprovoznění e-shopu
