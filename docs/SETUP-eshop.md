# Spuštění e-shopu — runbook (co udělám já vs. ty)

Stav: veškerý **kód e-shopu je hotový a commitnutý** na větvi `vercel-nextjs-rewrite`
(unit testy 17/17, `tsc` čistý, migrační SQL vygenerované, produkty zazálohované v
`web/data/forpsi-export/`). Chybí jen napojení na živé služby — to jsou kroky níže.

Legenda: **[TY]** = uděláš ty (dashboard/příkaz), **[JÁ]** = udělám já, až mi dáš echo.

---

## 1. [TY] Databáze Neon (~5 min)
1. [neon.tech](https://neon.tech) → Sign up (GitHub/Google) → **New Project**, region EU
   (Frankfurt), free plan.
2. Zkopíruj **Connection string** — vyber variantu **„Pooled connection"**. Vypadá:
   `postgresql://user:pass@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require`

## 2. [TY] Netlify site (~10 min)
1. [netlify.com](https://netlify.com) → Sign up (GitHub).
2. **Add new site → Import an existing project** → tenhle repozitář, branch
   `vercel-nextjs-rewrite`.
3. **Base directory: `web`** ← důležité. Build command i publish nech automatické
   (Netlify Next.js pozná). První build zatím nemusí projít (chybí env) — to je OK.
4. Zkopíruj **Site ID**: Site configuration → General → Site ID.
5. Vytvoř **token**: avatar → User settings → Applications → **New access token**.

## 3. [TY] Soubor `web/.env.local` (~5 min)
Vytvoř `web/.env.local` (je v `.gitignore`, necommitne se) a doplň hodnoty:
```ini
DATABASE_URL=postgresql://...        # z Neonu (Pooled), krok 1
SESSION_SECRET=                      # vygeneruj: openssl rand -base64 32
NETLIFY_SITE_ID=...                  # z Netlify, krok 2
NETLIFY_AUTH_TOKEN=...               # z Netlify, krok 2

# Banka + objednávky — zkopíruj z www/.env
BANK_NAME=
BANK_ACCOUNT=
BANK_IBAN=
BANK_SWIFT=
ORDER_PREFIX=NMR
ADMIN_NOTIFICATION_EMAIL=info@nechmerust.org

# Odesílání e-mailů — doplníme v kroku 7 (zatím může zůstat prázdné)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=tls
SMTP_USERNAME=info@nechmerust.org
SMTP_PASSWORD=
SMTP_FROM_EMAIL=info@nechmerust.org
SMTP_FROM_NAME=Nech mě růst
```
Stejné hodnoty (kromě `NETLIFY_*`, ty jsou jen lokální) zadej i do
**Netlify → Site configuration → Environment variables**.

➡️ **Pak mi napiš „.env.local hotovo" a převezmu to.**

## 4. [JÁ] Naplnění DB + ověření
Spustím za tebe:
- `npm run db:migrate` — vytvoří tabulky v Neonu.
- `npm run migrate:forpsi` — nahraje 26 produktů + 6 kategorií + fotky (z lokální zálohy)
  do Neonu a Netlify Blobs.
- integrační testy (objednávka v transakci, dotazy) proti DB.

## 5. [TY] Admin účet (1 příkaz)
Heslo si volíš sám, nikam ho neposílej:
```bash
cd web && npm run admin:create
```
(zeptá se na jméno, e-mail, heslo — min. 10 znaků)

## 6. [TY/spolu] Nasazení na Netlify
```bash
cd web && npx netlify deploy --prod
```
Poprvé tě to provede přihlášením. V deploy logu zkontroluj, že **Next.js 16 prošel**
(kdyby ne, máme zálohu — hosting, co spouští `next start`, např. Render; kód se nemění).

## 7. [TY, provedu tě] E-mail přes Google Workspace
Dvě věci:
- **Příjem pošty (do 29.!):** v DNS panelu Forpsi přepiš **MX** záznamy na Google Workspace
  (Workspace ti je ukáže v Admin console → Domains → Activate Gmail). Tím začne
  `info@nechmerust.org` chodit do Workspace místo Forpsi.
- **Odesílání objednávek z webu:** nejjednodušší přes Workspace SMTP — v Google účtu
  zapni 2-Step Verification a vytvoř **App password**; do `.env.local` i Netlify doplň
  `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_SECURE=tls`,
  `SMTP_USERNAME=info@nechmerust.org`, `SMTP_PASSWORD=<app password>`.
  (Alternativa: Resend, free tier — řekni a nastavím.)

## 8. [TY, až bude vše ověřené] Cutover webu
V DNS panelu Forpsi přesměruj **A/CNAME** na Netlify (Netlify ukáže cílové hodnoty
v Domain management). Doména zůstává registrovaná na Forpsi.

---

### Co je out-of-scope (zvlášť, později)
Registrace na události a přihlášení k newsletteru z Forpsi — malé, uděláme jako dodatek
po e-shopu (jsou to dva PHP endpointy přepsané na Next.js Server Actions + e-mail).
