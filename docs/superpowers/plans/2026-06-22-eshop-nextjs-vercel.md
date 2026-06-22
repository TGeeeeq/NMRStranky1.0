# E-shop on Next.js + Netlify — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional bank-transfer e-shop (public shop + cart + checkout + orders + single-account admin) inside the `web/` Next.js 16 app, backed by Neon Postgres and Netlify Blobs, deployed on Netlify (free), replacing the Forpsi PHP shop.

**Architecture:** One Next.js App Router app. Server Components read products from Neon Postgres via Drizzle. Cart is client-side (localStorage); checkout is a Server Action that re-reads prices from the DB, writes the order in a transaction, and emails customer + admin via Forpsi SMTP. Admin is a session-guarded area (iron-session, one bcrypt account) with Server Actions for CRUD and image upload to Netlify Blobs. A one-off script migrates products/categories/photos from a local Forpsi backup snapshot (already exported to `web/data/forpsi-export/`).

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, Drizzle ORM + `@neondatabase/serverless` (Pool, for transactions), `@netlify/blobs`, `iron-session`, `bcryptjs`, `nodemailer`, `zod`, `vitest`, `@playwright/test`. **Host: Netlify** (free Starter). DB: **Neon** (free, direct).

**Spec:** `docs/superpowers/specs/2026-06-22-eshop-nextjs-vercel-design.md`

---

## CRITICAL implementation notes (read before starting)

1. **Next.js 16 has breaking changes** (`web/AGENTS.md`). Before writing page/route code, skim `web/node_modules/next/dist/docs/`. Known: `params` and `searchParams` are **`Promise`s** in pages — `await` them. `cookies()` / `headers()` from `next/headers` are **async** — `await` them.
2. **Transactions need the Neon Pool driver**, not `neon-http`. The HTTP driver cannot do multi-statement transactions. Use `drizzle-orm/neon-serverless` with a `Pool` from `@neondatabase/serverless` (see Task 1.2). The order Server Action depends on this.
3. **Money is `numeric(10,2)`** — Drizzle returns it as a **string**. Always parse with `Number()` / format explicitly; never do float math on raw column values without converting. Helpers live in `lib/money.ts`.
4. **All product prices/names/stock for orders come from the DB**, never from the client payload. The client cart sends `{ id, quantity }` only.
5. **Secrets** live in Netlify env vars / `.env.local` (gitignored). Never commit them, never send them to the client. Server-only modules must not be imported by client components.
6. **Host is Netlify (free Starter).** Product images are stored in **Netlify Blobs** and served **same-origin** via a route handler (`app/img/[...key]/route.ts`), so `image_url` is a path like `/img/<key>` and **no `next/image` remote-host config is needed**. The app lives in the `web/` subdir, so Netlify's **base directory must be `web`** (set in `netlify.toml`). Verify Netlify's Next runtime supports Next 16; if it lags, fall back to a host that runs `next start` (e.g. Render).

## File structure (what gets created)

```
web/
  netlify.toml                            # Netlify build config (base = web)
  drizzle.config.ts                       # drizzle-kit config
  vitest.config.ts                        # unit + integration tests
  playwright.config.ts                    # e2e
  lib/
    env.ts                                # typed env access (server-only)
    money.ts                              # Kč formatting + line/total math (pure)
    payment.ts                            # order number + variable symbol + bank details
    validation.ts                         # zod schemas (checkout, product, category)
    db/
      schema.ts                           # Drizzle tables + enums
      index.ts                            # Neon Pool + drizzle client (transactions)
      queries.ts                          # typed read/write helpers (the data layer)
    email.ts                              # nodemailer transport + order emails (server-only)
    auth.ts                               # iron-session config + login/logout/getSession
    cart.ts                               # client cart store (localStorage), pure helpers
    storage.ts                            # Netlify Blobs writer + /img key helper (server-only)
  app/
    obchod/page.tsx                       # listing + category filter
    obchod/[slug]/page.tsx                # product detail
    obchod/kosik/page.tsx                 # cart page
    obchod/pokladna/page.tsx              # checkout form
    obchod/objednavka/[orderNumber]/page.tsx   # confirmation
    obchod/actions.ts                     # createOrder server action
    obchod/cart-data/route.ts             # GET product data for cart hydration
    img/[...key]/route.ts                 # serves product images from Netlify Blobs (same-origin)
    admin/layout.tsx                      # auth guard + admin chrome
    admin/login/page.tsx                  # login form
    admin/page.tsx                        # dashboard
    admin/products/page.tsx               # product list
    admin/products/new/page.tsx           # create product
    admin/products/[id]/page.tsx          # edit product
    admin/categories/page.tsx             # category CRUD
    admin/orders/page.tsx                 # order list
    admin/orders/[id]/page.tsx            # order detail
    admin/actions.ts                      # admin server actions (auth/product/category/order/upload)
  components/
    shop/{Price,ProductCard,CategoryFilter,ProductGallery,AddToCartButton,
          CartProvider,CartButton,CartContents,CheckoutForm,OrderSummary}.tsx
    admin/{AdminNav,ProductForm,ImageUpload,GalleryManager}.tsx
  data/
    forpsi-export/                        # Forpsi backup snapshot — migration source (DONE)
  scripts/
    export-forpsi.py                      # one-off backup of the live Forpsi shop (DONE)
    migrate-from-forpsi.ts                # one-off: snapshot -> Neon + Netlify Blobs
    create-admin.ts                       # one-off admin account creation
  tests/
    unit/{money,payment,validation,cart}.test.ts
    integration/{queries,order}.test.ts
    e2e/{shop,admin}.spec.ts
```

---

## Phase 0 — Provisioning & tooling

### Task 0.1: Provision Neon + Netlify (dashboard/CLI, not code)

> Host moves from Vercel to **Netlify** (free Starter allows commercial use). DB is **Neon
> direct** (host-independent). Image storage is **Netlify Blobs** (no token needed in prod).

- [ ] **Step 1: Create a Neon Postgres project**

At [neon.tech](https://neon.tech) → New Project (free plan). Copy the **pooled** connection
string → this is `DATABASE_URL`. Put it in `web/.env.local` (gitignored).

- [ ] **Step 2: Create the Netlify site and link it**

```bash
cd web
npx netlify login
npx netlify init        # create a new site, or `netlify link` to an existing one
```
Set the site's **base directory** to `web` (Netlify UI → Site config → Build & deploy, or via
`netlify.toml` in Task 0.2). Netlify Blobs is then available to functions/route handlers with
**no extra token** at runtime.

- [ ] **Step 3: Create a Netlify personal access token for local scripts**

Netlify UI → User settings → Applications → New access token. Put in `web/.env.local`:
`NETLIFY_AUTH_TOKEN=...` and `NETLIFY_SITE_ID=...` (site ID from Site config → General). These
let the local migration script write to Netlify Blobs from your machine.

- [ ] **Step 4: Add the app env vars**

Add to **both** Netlify (Site config → Environment variables) **and** `web/.env.local`:
- `DATABASE_URL` (from Step 1), `SESSION_SECRET` (`openssl rand -base64 32`).
- Email send — copy `SMTP_*` from `www/.env` for now (Google Workspace SMTP once it's set up;
  or set `RESEND_API_KEY` instead and adjust `lib/email.ts`): `SMTP_HOST`, `SMTP_PORT`,
  `SMTP_SECURE`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME`.
- Bank/order — copy from `www/.env`: `BANK_NAME`, `BANK_ACCOUNT`, `BANK_IBAN`, `BANK_SWIFT`,
  `ORDER_PREFIX`, `ADMIN_NOTIFICATION_EMAIL`.
- `NETLIFY_AUTH_TOKEN` + `NETLIFY_SITE_ID` go in `.env.local` only (local scripts), NOT in the site env.

### Task 0.2: Install dependencies & test tooling

**Files:**
- Modify: `web/package.json`
- Create: `web/vitest.config.ts`, `web/playwright.config.ts`

- [ ] **Step 1: Install runtime + dev deps**

Run from `web/`:
```bash
cd web
npm install drizzle-orm @neondatabase/serverless @netlify/blobs iron-session bcryptjs nodemailer zod
npm install -D drizzle-kit @types/bcryptjs @types/nodemailer vitest @vitejs/plugin-react @playwright/test dotenv
npx playwright install chromium
```
Expected: installs succeed, `package.json` updated.

- [ ] **Step 2: Add scripts to `package.json`**

In `web/package.json` `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:studio": "drizzle-kit studio",
"migrate:forpsi": "node --env-file=.env.local --experimental-strip-types scripts/migrate-from-forpsi.ts",
"admin:create": "node --env-file=.env.local --experimental-strip-types scripts/create-admin.ts"
```

- [ ] **Step 3: Create `web/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Stub Next's `server-only` / `client-only` markers so server modules import in node tests.
  resolve: { alias: { "server-only": "/dev/null", "client-only": "/dev/null" } },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
    env: { ...process.env },
  },
});
```

> Note: aliasing to `/dev/null` yields an empty module on Linux (the CI/dev platform here). If on another OS, create `web/tests/empty.ts` (empty file) and alias to it instead.

- [ ] **Step 4: Create `web/playwright.config.ts`**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
    // Point SMTP at a dead address so e2e order placement never sends real mail
    // (the order action catches the send failure and still saves the order).
    env: { ...process.env, SMTP_HOST: "localhost", SMTP_PORT: "2" },
  },
});
```

- [ ] **Step 5: Create `web/netlify.toml`**

```toml
# Netlify reads this from the site's base directory (set base = "web" during `netlify init`).
# @netlify/plugin-nextjs is auto-installed when Netlify detects Next.js.
[build]
  command = "npm run build"
```

- [ ] **Step 6: Commit**

```bash
git add web/package.json web/package-lock.json web/vitest.config.ts web/playwright.config.ts web/netlify.toml
git commit -m "chore(web): add e-shop deps, test tooling, netlify config"
```

---

## Phase 1 — Database schema & data layer

### Task 1.1: Typed env accessor

**Files:**
- Create: `web/lib/env.ts`

- [ ] **Step 1: Write `web/lib/env.ts`**

```ts
import "server-only";

function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}
function opt(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  databaseUrl: () => req("DATABASE_URL"),
  sessionSecret: () => req("SESSION_SECRET"),
  smtp: () => ({
    host: opt("SMTP_HOST", "smtp.forpsi.com"),
    port: Number(opt("SMTP_PORT", "587")),
    secure: opt("SMTP_SECURE", "tls") === "ssl",
    user: opt("SMTP_USERNAME", "info@nechmerust.org"),
    pass: opt("SMTP_PASSWORD"),
    fromEmail: opt("SMTP_FROM_EMAIL", "info@nechmerust.org"),
    fromName: opt("SMTP_FROM_NAME", "Nech mě růst"),
  }),
  bank: () => ({
    name: opt("BANK_NAME"),
    account: opt("BANK_ACCOUNT"),
    iban: opt("BANK_IBAN"),
    swift: opt("BANK_SWIFT"),
  }),
  orderPrefix: () => (opt("ORDER_PREFIX", "NMR").toUpperCase().replace(/[^A-Z0-9]/g, "") || "NMR"),
  adminNotificationEmail: () => opt("ADMIN_NOTIFICATION_EMAIL", opt("SMTP_FROM_EMAIL", "info@nechmerust.org")),
};
```

- [ ] **Step 2: Commit**

```bash
git add web/lib/env.ts && git commit -m "feat(web): typed server-only env accessor"
```

### Task 1.2: Drizzle schema

**Files:**
- Create: `web/lib/db/schema.ts`

- [ ] **Step 1: Write `web/lib/db/schema.ts`**

```ts
import {
  pgTable, serial, varchar, text, integer, numeric, boolean,
  timestamp, pgEnum, index,
} from "drizzle-orm/pg-core";

export const orderStatus = pgEnum("order_status", [
  "pending", "paid", "processing", "shipped", "completed", "cancelled",
]);
export const paymentStatus = pgEnum("payment_status", [
  "pending", "completed", "failed", "refunded",
]);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stockQuantity: integer("stock_quantity").default(0).notNull(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  imageUrl: varchar("image_url", { length: 1000 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_products_category").on(t.categoryId), index("idx_products_active").on(t.isActive)]);

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  imageUrl: varchar("image_url", { length: 1000 }).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
}, (t) => [index("idx_product_images_product").on(t.productId)]);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  variableSymbol: varchar("variable_symbol", { length: 20 }).notNull(),
  customerName: varchar("customer_name", { length: 100 }).notNull(),
  customerEmail: varchar("customer_email", { length: 190 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 30 }),
  shippingAddress: text("shipping_address").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: orderStatus("status").default("pending").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).default("bank_transfer").notNull(),
  paymentStatus: paymentStatus("payment_status").default("pending").notNull(),
  notes: text("notes"),
  customerIp: varchar("customer_ip", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_orders_status").on(t.status), index("idx_orders_email").on(t.customerEmail)]);

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  productName: varchar("product_name", { length: 200 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
}, (t) => [index("idx_order_items_order").on(t.orderId)]);

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  email: varchar("email", { length: 190 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
  lastLoginIp: varchar("last_login_ip", { length: 45 }),
});
```

- [ ] **Step 2: Commit**

```bash
git add web/lib/db/schema.ts && git commit -m "feat(web): drizzle e-shop schema"
```

### Task 1.3: Drizzle config + DB client (Pool, transaction-capable)

**Files:**
- Create: `web/drizzle.config.ts`, `web/lib/db/index.ts`

- [ ] **Step 1: Write `web/drizzle.config.ts`**

```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

- [ ] **Step 2: Write `web/lib/db/index.ts`**

```ts
import "server-only";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import { env } from "../env";

// Pool driver (not neon-http) so the order Server Action can use db.transaction().
const pool = new Pool({ connectionString: env.databaseUrl() });
export const db = drizzle(pool, { schema });
export { schema };
```

- [ ] **Step 3: Generate + apply the migration**

```bash
cd web
npm run db:generate     # writes SQL to web/drizzle/
npm run db:migrate      # applies to the Neon DB
```
Expected: `web/drizzle/0000_*.sql` created; migrate prints applied migration. Verify in `npm run db:studio` that all 6 tables + 2 enums exist.

- [ ] **Step 4: Commit**

```bash
git add web/drizzle.config.ts web/lib/db/index.ts web/drizzle
git commit -m "feat(web): drizzle config + Neon Pool client + initial migration"
```

### Task 1.4: Data layer (queries)

**Files:**
- Create: `web/lib/db/queries.ts`
- Test: `web/tests/integration/queries.test.ts`

> Integration tests run against the real Neon dev DB (`DATABASE_URL` from `.env.local`). They insert and clean up their own rows.

- [ ] **Step 1: Write the failing test `web/tests/integration/queries.test.ts`**

```ts
import { describe, it, expect, afterAll } from "vitest";
import { db, schema } from "../../lib/db";
import { eq } from "drizzle-orm";
import { getActiveProducts, getProductBySlug, getCategoriesWithCounts } from "../../lib/db/queries";

const SLUG = "test-prod-" + Date.now();

describe("queries", () => {
  afterAll(async () => {
    await db.delete(schema.products).where(eq(schema.products.slug, SLUG));
  });

  it("getActiveProducts returns active products, hides inactive", async () => {
    await db.insert(schema.products).values({ name: "T", slug: SLUG, price: "100.00", stockQuantity: 1, isActive: true });
    const all = await getActiveProducts({});
    expect(all.find((p) => p.slug === SLUG)).toBeTruthy();
  });

  it("getProductBySlug returns the product", async () => {
    const p = await getProductBySlug(SLUG);
    expect(p?.slug).toBe(SLUG);
  });

  it("getCategoriesWithCounts returns an array", async () => {
    const cats = await getCategoriesWithCounts();
    expect(Array.isArray(cats)).toBe(true);
  });
});
```

- [ ] **Step 2: Run it to verify failure**

Run: `cd web && npx vitest run tests/integration/queries.test.ts`
Expected: FAIL — `getActiveProducts` is not a function / module not found.

- [ ] **Step 3: Write `web/lib/db/queries.ts`**

```ts
import "server-only";
import { db, schema } from "./index";
import { and, eq, desc, sql, asc } from "drizzle-orm";

const { products, categories, productImages, orders, orderItems } = schema;

export async function getActiveProducts(opts: { categorySlug?: string }) {
  const where = opts.categorySlug
    ? and(eq(products.isActive, true), eq(categories.slug, opts.categorySlug))
    : eq(products.isActive, true);
  return db
    .select({
      id: products.id, name: products.name, slug: products.slug,
      price: products.price, stockQuantity: products.stockQuantity,
      imageUrl: products.imageUrl,
      categoryName: categories.name, categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(where)
    .orderBy(desc(products.createdAt));
}

export async function getProductBySlug(slug: string) {
  const rows = await db
    .select().from(products).where(eq(products.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getProductImages(productId: number) {
  return db.select().from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(asc(productImages.displayOrder));
}

export async function getProductsByIds(ids: number[]) {
  if (ids.length === 0) return [];
  return db.select().from(products)
    .where(and(eq(products.isActive, true), sql`${products.id} = ANY(${ids})`));
}

export async function getCategoriesWithCounts() {
  return db
    .select({
      id: categories.id, name: categories.name, slug: categories.slug,
      displayOrder: categories.displayOrder,
      productCount: sql<number>`count(${products.id})::int`,
    })
    .from(categories)
    .leftJoin(products, and(eq(products.categoryId, categories.id), eq(products.isActive, true)))
    .groupBy(categories.id)
    .orderBy(asc(categories.displayOrder), asc(categories.name));
}

export async function getOrderByNumber(orderNumber: string) {
  const o = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  if (!o[0]) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o[0].id));
  return { ...o[0], items };
}

export async function countRecentOrdersFromIp(ip: string, seconds: number) {
  const rows = await db.select({ n: sql<number>`count(*)::int` }).from(orders)
    .where(and(eq(orders.customerIp, ip), sql`${orders.createdAt} > now() - (${seconds} || ' seconds')::interval`));
  return rows[0]?.n ?? 0;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd web && npx vitest run tests/integration/queries.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add web/lib/db/queries.ts web/tests/integration/queries.test.ts
git commit -m "feat(web): e-shop data layer with integration tests"
```

---

## Phase 2 — Pure logic (money, payment, validation, cart) — TDD

> These modules have **no** `server-only` import and no DB/env dependency, so they unit-test cleanly.

### Task 2.1: Money helpers

**Files:**
- Create: `web/lib/money.ts`
- Test: `web/tests/unit/money.test.ts`

- [ ] **Step 1: Write the failing test `web/tests/unit/money.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { formatCzk, lineTotal, cartTotal } from "../../lib/money";

describe("money", () => {
  it("formatCzk formats integer Kč with space thousands and no decimals", () => {
    expect(formatCzk("1000.00")).toBe("1 000 Kč");
    expect(formatCzk(250)).toBe("250 Kč");
  });
  it("lineTotal multiplies price string by qty, rounded to 2dp", () => {
    expect(lineTotal("300.00", 2)).toBe(600);
    expect(lineTotal("99.90", 3)).toBe(299.7);
  });
  it("cartTotal sums line totals", () => {
    expect(cartTotal([{ price: "300.00", quantity: 2 }, { price: "250.00", quantity: 1 }])).toBe(850);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd web && npx vitest run tests/unit/money.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `web/lib/money.ts`**

```ts
export function lineTotal(price: string | number, quantity: number): number {
  return Math.round(Number(price) * quantity * 100) / 100;
}

export function cartTotal(items: { price: string | number; quantity: number }[]): number {
  return Math.round(items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0) * 100) / 100;
}

// Czech style: ASCII space thousands separator, no decimals (matches PHP number_format(x,0,',',' ')).
// Manual grouping (not toLocaleString — that emits a narrow no-break space and is locale-fragile).
export function formatCzk(value: string | number): string {
  const n = Math.round(Number(value));
  const grouped = Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${n < 0 ? "-" : ""}${grouped} Kč`;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `cd web && npx vitest run tests/unit/money.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add web/lib/money.ts web/tests/unit/money.test.ts
git commit -m "feat(web): money helpers (format, line/cart totals)"
```

### Task 2.2: Payment helpers (order number + variable symbol)

**Files:**
- Create: `web/lib/payment.ts`
- Test: `web/tests/unit/payment.test.ts`

- [ ] **Step 1: Write the failing test `web/tests/unit/payment.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { generateOrderNumber, generateVariableSymbol } from "../../lib/payment";

describe("payment", () => {
  it("generateOrderNumber uses prefix, date (YYYYMMDD), and an uppercase hex suffix", () => {
    const n = generateOrderNumber("NMR", { date: new Date("2026-06-22T10:00:00Z"), rand: "abcdef" });
    expect(n).toBe("NMR-20260622-ABCDEF");
  });
  it("generateVariableSymbol keeps only digits, max 10", () => {
    expect(generateVariableSymbol("NMR-20260622-ABCDEF")).toBe("2026062200"); // wait: digits only
  });
  it("generateVariableSymbol takes the first 10 digits of the order number", () => {
    // digits of "NMR-20260622-AB12" => "20260622" + "12" = "2026062212"
    expect(generateVariableSymbol("NMR-20260622-AB12")).toBe("2026062212");
  });
  it("generateVariableSymbol falls back to a 10-digit number when no digits present", () => {
    const vs = generateVariableSymbol("ABC-DEF");
    expect(vs).toMatch(/^\d{10}$/);
  });
});
```

> Note: delete the first (deliberately-wrong) assertion in step 1 once you confirm the digit rule; it's there only to make you verify the real behavior. Keep the two correct tests.

- [ ] **Step 2: Run to verify failure**

Run: `cd web && npx vitest run tests/unit/payment.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `web/lib/payment.ts`**

```ts
import { randomBytes, randomInt } from "node:crypto";

function pad2(n: number): string { return String(n).padStart(2, "0"); }

export function generateOrderNumber(
  prefix: string,
  inject?: { date?: Date; rand?: string },
): string {
  const d = inject?.date ?? new Date();
  const ymd = `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}`;
  const rand = (inject?.rand ?? randomBytes(3).toString("hex")).toUpperCase();
  return `${prefix}-${ymd}-${rand}`;
}

export function generateVariableSymbol(orderNumber: string): string {
  const digits = orderNumber.replace(/\D/g, "");
  if (!digits) return String(randomInt(1_000_000_000, 9_999_999_999));
  return digits.slice(0, 10);
}
```

- [ ] **Step 4: Fix the test per the note (remove the wrong assertion), then run to verify pass**

Run: `cd web && npx vitest run tests/unit/payment.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/lib/payment.ts web/tests/unit/payment.test.ts
git commit -m "feat(web): order-number + variable-symbol generators"
```

### Task 2.3: Validation schemas (zod)

**Files:**
- Create: `web/lib/validation.ts`
- Test: `web/tests/unit/validation.test.ts`

- [ ] **Step 1: Write the failing test `web/tests/unit/validation.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { checkoutSchema, productSchema } from "../../lib/validation";

const validCheckout = {
  customer_name: "Jan Novák", customer_email: "jan@example.cz", customer_phone: "+420 123",
  street: "Hlavní 1", city: "Praha", postal_code: "11000", notes: "",
  items: [{ product_id: 5, quantity: 2 }],
};

describe("checkoutSchema", () => {
  it("accepts a valid order", () => {
    expect(checkoutSchema.safeParse(validCheckout).success).toBe(true);
  });
  it("rejects a bad email", () => {
    expect(checkoutSchema.safeParse({ ...validCheckout, customer_email: "nope" }).success).toBe(false);
  });
  it("rejects empty items", () => {
    expect(checkoutSchema.safeParse({ ...validCheckout, items: [] }).success).toBe(false);
  });
  it("rejects > 50 items", () => {
    const items = Array.from({ length: 51 }, () => ({ product_id: 1, quantity: 1 }));
    expect(checkoutSchema.safeParse({ ...validCheckout, items }).success).toBe(false);
  });
});

describe("productSchema", () => {
  it("accepts a valid product", () => {
    expect(productSchema.safeParse({
      name: "Přívěšek", slug: "privesek-1", description: "", price: 300,
      stock_quantity: 1, category_id: 3, image_url: "https://x.blob/y.webp", is_active: true,
    }).success).toBe(true);
  });
  it("rejects a bad slug", () => {
    expect(productSchema.safeParse({ name: "X", slug: "Bad Slug", price: 10 }).success).toBe(false);
  });
  it("rejects price <= 0", () => {
    expect(productSchema.safeParse({ name: "X", slug: "x", price: 0 }).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd web && npx vitest run tests/unit/validation.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `web/lib/validation.ts`**

```ts
import { z } from "zod";

export const checkoutSchema = z.object({
  customer_name: z.string().trim().min(1).max(100),
  customer_email: z.string().trim().email().max(190),
  customer_phone: z.string().trim().max(30).optional().default(""),
  street: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  postal_code: z.string().trim().min(1).max(20),
  notes: z.string().trim().max(1000).optional().default(""),
  items: z.array(z.object({
    product_id: z.number().int().positive(),
    quantity: z.number().int().min(1).max(100),
  })).min(1).max(50),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const productSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z.string().trim().regex(/^[a-z0-9-]{2,200}$/, "Slug: jen a-z, 0-9, pomlčky"),
  description: z.string().max(5000).optional().default(""),
  price: z.coerce.number().positive(),
  stock_quantity: z.coerce.number().int().min(0).default(0),
  category_id: z.coerce.number().int().positive().nullable().optional(),
  image_url: z.string().max(1000).optional().default(""),
  is_active: z.coerce.boolean().default(true),
});
export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: z.string().trim().regex(/^[a-z0-9-]{2,100}$/),
  description: z.string().max(2000).optional().default(""),
  display_order: z.coerce.number().int().min(0).default(0),
});
export type CategoryInput = z.infer<typeof categorySchema>;
```

- [ ] **Step 4: Run to verify pass**

Run: `cd web && npx vitest run tests/unit/validation.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/lib/validation.ts web/tests/unit/validation.test.ts
git commit -m "feat(web): zod validation schemas (checkout, product, category)"
```

### Task 2.4: Cart helpers (pure) + localStorage wrappers

**Files:**
- Create: `web/lib/cart.ts`
- Test: `web/tests/unit/cart.test.ts`

- [ ] **Step 1: Write the failing test `web/tests/unit/cart.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { addItem, setQty, removeItem, cartCount } from "../../lib/cart";

describe("cart pure ops", () => {
  it("addItem inserts new and increments existing", () => {
    let c = addItem([], 5, 1);
    expect(c).toEqual([{ id: 5, quantity: 1 }]);
    c = addItem(c, 5, 2);
    expect(c).toEqual([{ id: 5, quantity: 3 }]);
  });
  it("setQty clamps to >=1 and replaces", () => {
    expect(setQty([{ id: 5, quantity: 3 }], 5, 0)).toEqual([{ id: 5, quantity: 1 }]);
  });
  it("removeItem drops the line", () => {
    expect(removeItem([{ id: 5, quantity: 3 }, { id: 6, quantity: 1 }], 5)).toEqual([{ id: 6, quantity: 1 }]);
  });
  it("cartCount sums quantities", () => {
    expect(cartCount([{ id: 5, quantity: 3 }, { id: 6, quantity: 1 }])).toBe(4);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd web && npx vitest run tests/unit/cart.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `web/lib/cart.ts`**

```ts
export type CartItem = { id: number; quantity: number };
const KEY = "nmr_cart";

export function addItem(cart: CartItem[], id: number, qty = 1): CartItem[] {
  const existing = cart.find((i) => i.id === id);
  if (existing) return cart.map((i) => (i.id === id ? { ...i, quantity: i.quantity + qty } : i));
  return [...cart, { id, quantity: qty }];
}
export function setQty(cart: CartItem[], id: number, qty: number): CartItem[] {
  const q = Math.max(1, Math.min(100, Math.floor(qty)));
  return cart.map((i) => (i.id === id ? { ...i, quantity: q } : i));
}
export function removeItem(cart: CartItem[], id: number): CartItem[] {
  return cart.filter((i) => i.id !== id);
}
export function cartCount(cart: CartItem[]): number {
  return cart.reduce((n, i) => n + i.quantity, 0);
}

// localStorage wrappers (browser only)
export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function saveCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(cart));
}
export function clearCart(): void {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}
```

- [ ] **Step 4: Run to verify pass**

Run: `cd web && npx vitest run tests/unit/cart.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/lib/cart.ts web/tests/unit/cart.test.ts
git commit -m "feat(web): cart helpers (pure ops + localStorage)"
```

---

## Phase 3 — Image storage, email, migration scripts

### Task 3.0: Image storage (Netlify Blobs) + serving route

**Files:**
- Create: `web/lib/storage.ts`
- Create: `web/app/img/[...key]/route.ts`

- [ ] **Step 1: Write `web/lib/storage.ts`**

```ts
import "server-only";
import { getStore } from "@netlify/blobs";

const STORE = "product-images";

// On Netlify (prod + `netlify dev`) getStore(name) works with no creds. From a plain Node
// script (the migration) it needs the site id + a personal access token.
export function imageStore() {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_AUTH_TOKEN;
  return siteID && token ? getStore({ name: STORE, siteID, token }) : getStore(STORE);
}

const safe = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, "_");

// Store bytes; return the same-origin path stored as image_url and served by the /img route.
export async function saveImage(filename: string, data: ArrayBuffer, contentType: string): Promise<string> {
  const key = `${Date.now()}-${safe(filename)}`;
  await imageStore().set(key, data, { metadata: { contentType } });
  return `/img/${key}`;
}
```

- [ ] **Step 2: Write `web/app/img/[...key]/route.ts`**

```ts
import { imageStore } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const blob = await imageStore().getWithMetadata(key.join("/"), { type: "arrayBuffer" });
  if (!blob) return new Response("Not found", { status: 404 });
  const contentType = (blob.metadata?.contentType as string) || "application/octet-stream";
  return new Response(blob.data, {
    headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add web/lib/storage.ts "web/app/img/[...key]/route.ts"
git commit -m "feat(web): Netlify Blobs image storage + same-origin serving route"
```

### Task 3.1: Order emails (nodemailer + SMTP — Workspace/Resend)

**Files:**
- Create: `web/lib/email.ts`

> No automated test (sending is a side effect verified manually in Phase 8). Body strings mirror `www/api/create-order.php` `sendOrderEmails()`.

- [ ] **Step 1: Write `web/lib/email.ts`**

```ts
import "server-only";
import nodemailer from "nodemailer";
import { env } from "./env";
import { formatCzk } from "./money";

export type OrderEmailData = {
  orderNumber: string; variableSymbol: string;
  customerName: string; customerEmail: string; customerPhone: string;
  shippingAddress: string; notes: string;
  items: { name: string; quantity: number; lineTotal: number }[];
  total: number;
};

function bankBlock(): string {
  const b = env.bank();
  return [
    b.name ? `Banka:           ${b.name}` : "",
    b.account ? `Číslo účtu:      ${b.account}` : "",
    b.iban ? `IBAN:            ${b.iban}` : "",
    b.swift ? `SWIFT:           ${b.swift}` : "",
  ].filter(Boolean).join("\n");
}

function itemsText(items: OrderEmailData["items"]): string {
  return items.map((i) => `- ${i.name} (${i.quantity}×): ${formatCzk(i.lineTotal)}`).join("\n");
}

export async function sendOrderEmails(o: OrderEmailData): Promise<void> {
  const s = env.smtp();
  const transport = nodemailer.createTransport({
    host: s.host, port: s.port, secure: s.port === 465,
    auth: { user: s.user, pass: s.pass },
  });
  const from = `"${s.fromName}" <${s.fromEmail}>`;
  const totalFmt = formatCzk(o.total);

  const customerBody =
`Děkujeme za vaši objednávku!

Číslo objednávky: ${o.orderNumber}

Položky:
${itemsText(o.items)}

Celkem: ${totalFmt}

PLATEBNÍ ÚDAJE (bankovní převod):
${bankBlock()}
Variabilní symbol: ${o.variableSymbol}
Částka:            ${totalFmt}

Jakmile platbu obdržíme, začneme objednávku připravovat.

S úctou,
Tým Nech mě růst`;

  const adminBody =
`NOVÁ OBJEDNÁVKA: ${o.orderNumber}

Zákazník: ${o.customerName} <${o.customerEmail}>
Telefon:  ${o.customerPhone}
Adresa:   ${o.shippingAddress}

Položky:
${itemsText(o.items)}

Celkem: ${totalFmt}
Variabilní symbol: ${o.variableSymbol}

Poznámka:
${o.notes}`;

  await Promise.all([
    transport.sendMail({ from, to: o.customerEmail, subject: `Potvrzení objednávky ${o.orderNumber} – Nech mě růst`, text: customerBody }),
    transport.sendMail({ from, to: env.adminNotificationEmail(), subject: `NOVÁ OBJEDNÁVKA: ${o.orderNumber}`, text: adminBody }),
  ]);
}
```

- [ ] **Step 2: Commit**

```bash
git add web/lib/email.ts && git commit -m "feat(web): order confirmation + admin notification emails"
```

### Task 3.2: Admin-account creation script

**Files:**
- Create: `web/scripts/create-admin.ts`

- [ ] **Step 1: Write `web/scripts/create-admin.ts`**

```ts
// Run: npm run admin:create  (reads DATABASE_URL from .env.local)
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema.ts";

const rl = createInterface({ input: stdin, output: stdout });
const username = (await rl.question("Admin username: ")).trim();
const email = (await rl.question("Admin email: ")).trim();
const password = (await rl.question("Admin password (min 10 chars): ")).trim();
rl.close();
if (password.length < 10) { console.error("Password too short."); process.exit(1); }

const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL! }), { schema });
const passwordHash = await bcrypt.hash(password, 12);

const existing = await db.select().from(schema.admins).where(eq(schema.admins.username, username));
if (existing[0]) {
  await db.update(schema.admins).set({ passwordHash, email }).where(eq(schema.admins.username, username));
  console.log(`Updated admin '${username}'.`);
} else {
  await db.insert(schema.admins).values({ username, email, passwordHash });
  console.log(`Created admin '${username}'.`);
}
process.exit(0);
```

- [ ] **Step 2: Run it to create the admin**

```bash
cd web && npm run admin:create
```
Expected: prompts, then "Created admin '<name>'." Verify the row in `npm run db:studio`.

- [ ] **Step 3: Commit**

```bash
git add web/scripts/create-admin.ts && git commit -m "feat(web): admin account creation script"
```

### Task 3.3: Snapshot → Neon + Netlify Blobs migration script

**Files:**
- Create: `web/scripts/migrate-from-forpsi.ts`

> Reads the **local backup snapshot** `web/data/forpsi-export/` (already exported by
> `export-forpsi.py`), so it does NOT depend on Forpsi being online. Uploads each photo to
> Netlify Blobs and stores the `/img/<key>` path. Idempotent on slug.

- [ ] **Step 1: Write `web/scripts/migrate-from-forpsi.ts`**

```ts
// Run: npm run migrate:forpsi
// Needs in .env.local: DATABASE_URL, NETLIFY_SITE_ID, NETLIFY_AUTH_TOKEN.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq } from "drizzle-orm";
import { getStore } from "@netlify/blobs";
import * as schema from "../lib/db/schema.ts";

const DIR = join(import.meta.dirname, "../data/forpsi-export");
const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL! }), { schema });
const store = getStore({ name: "product-images", siteID: process.env.NETLIFY_SITE_ID!, token: process.env.NETLIFY_AUTH_TOKEN! });

const readJson = (f: string) => JSON.parse(readFileSync(join(DIR, f), "utf-8"));
const EXT_TYPE: Record<string, string> = { webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };

async function uploadLocal(imagePath: string): Promise<string | null> {
  if (!imagePath) return null;
  const filename = imagePath.split("/").pop()!;
  let bytes: Buffer;
  try { bytes = readFileSync(join(DIR, "images", filename)); }
  catch { console.warn(`! missing image file ${filename}`); return null; }
  const ext = filename.split(".").pop()!.toLowerCase();
  const key = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  await store.set(key, bytes, { metadata: { contentType: EXT_TYPE[ext] ?? "application/octet-stream" } });
  return `/img/${key}`;
}

// 1) categories
const cats = readJson("categories.json").categories as any[];
const catIdBySlug = new Map<string, number>();
for (const c of cats) {
  const existing = await db.select().from(schema.categories).where(eq(schema.categories.slug, c.slug));
  let id: number;
  if (existing[0]) {
    id = existing[0].id;
    await db.update(schema.categories).set({ name: c.name, description: c.description ?? null, displayOrder: c.display_order ?? 0 }).where(eq(schema.categories.id, id));
  } else {
    const ins = await db.insert(schema.categories).values({ name: c.name, slug: c.slug, description: c.description ?? null, displayOrder: c.display_order ?? 0 }).returning({ id: schema.categories.id });
    id = ins[0].id;
  }
  catIdBySlug.set(c.slug, id);
  console.log(`category: ${c.slug} -> #${id}`);
}

// 2) products (+ main image to Netlify Blobs)
const prods = readJson("products.json").products as any[];
const gallery = readJson("gallery.json") as Record<string, any[]>;
for (const p of prods) {
  const imageUrl = await uploadLocal(p.image_url);
  const categoryId = p.category_slug ? catIdBySlug.get(p.category_slug) ?? null : null;
  const existing = await db.select().from(schema.products).where(eq(schema.products.slug, p.slug));
  const values = {
    name: p.name, slug: p.slug, description: p.description ?? "",
    price: String(p.price), stockQuantity: Number(p.stock_quantity ?? 0),
    categoryId, imageUrl, isActive: true,
  };
  let pid: number;
  if (existing[0]) { pid = existing[0].id; await db.update(schema.products).set(values).where(eq(schema.products.id, pid)); }
  else { const ins = await db.insert(schema.products).values(values).returning({ id: schema.products.id }); pid = ins[0].id; }
  console.log(`product: ${p.slug} -> #${pid}`);

  // gallery (empty in the current snapshot, handled if present)
  const imgs = gallery[String(p.id)] ?? [];
  if (imgs.length) {
    await db.delete(schema.productImages).where(eq(schema.productImages.productId, pid));
    let order = 0;
    for (const im of imgs) {
      const u = await uploadLocal(im.image_url);
      if (u) await db.insert(schema.productImages).values({ productId: pid, imageUrl: u, displayOrder: order++ });
    }
  }
}

console.log("Migration done.");
process.exit(0);
```

- [ ] **Step 2: Run it**

```bash
cd web && npm run migrate:forpsi
```
Expected: logs each category/product; ends "Migration done." Open `npm run db:studio` and confirm
**6 categories + 26 products**, each product `image_url` a `/img/...` path.

- [ ] **Step 3: Spot-check an image loads**

With `npm run dev` (or after deploy), open `http://localhost:3000<image_url>` (e.g. `/img/...`)
— it should render the webp via the serving route.

- [ ] **Step 4: Commit**

```bash
git add web/scripts/migrate-from-forpsi.ts
git commit -m "feat(web): snapshot->Neon+Netlify Blobs migration script"
```

---

## Phase 4 — Public shop (listing, detail, cart provider)

### Task 4.1: Mount CartProvider

**Files:**
- Modify: `web/next.config.ts`
- Modify: `web/app/layout.tsx`
- Create: `web/components/shop/CartProvider.tsx`

- [ ] **Step 1: No `next.config.ts` image change needed**

Product images are served **same-origin** at `/img/<key>` (Task 3.0), so `next/image` needs
**no** `remotePatterns`. Leave `web/next.config.ts` as-is. (Skip to Step 2.)

- [ ] **Step 2: Write `web/components/shop/CartProvider.tsx`**

```tsx
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { CartItem } from "@/lib/cart";
import { addItem, setQty, removeItem, cartCount, loadCart, saveCart, clearCart } from "@/lib/cart";

type CartCtx = {
  items: CartItem[];
  count: number;
  add: (id: number, qty?: number) => void;
  updateQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  ready: boolean;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => { setItems(loadCart()); setReady(true); }, []);
  useEffect(() => { if (ready) saveCart(items); }, [items, ready]);

  const add = useCallback((id: number, qty = 1) => setItems((c) => addItem(c, id, qty)), []);
  const updateQty = useCallback((id: number, qty: number) => setItems((c) => setQty(c, id, qty)), []);
  const remove = useCallback((id: number) => setItems((c) => removeItem(c, id)), []);
  const clear = useCallback(() => { clearCart(); setItems([]); }, []);

  return (
    <Ctx.Provider value={{ items, count: cartCount(items), add, updateQty, remove, clear, ready }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside CartProvider");
  return v;
}
```

- [ ] **Step 3: Wrap the app in `CartProvider` in `web/app/layout.tsx`**

Add the import and wrap the `MotionProvider` subtree. Add near the other imports:
```tsx
import { CartProvider } from "@/components/shop/CartProvider";
```
Then change the body so `CartProvider` wraps everything inside `MotionProvider` (it must sit above `Navbar`):
```tsx
        <MotionProvider>
          <CartProvider>
            <SmoothScroll />
            <Cursor />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-moss focus:px-4 focus:py-2 focus:text-cream"
            >
              Přeskočit na obsah
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </MotionProvider>
```

- [ ] **Step 4: Verify build still compiles**

Run: `cd web && npm run build`
Expected: build succeeds (no usages of the cart yet, but the provider compiles).

- [ ] **Step 5: Commit**

```bash
git add web/app/layout.tsx web/components/shop/CartProvider.tsx
git commit -m "feat(web): mount CartProvider"
```

### Task 4.2: Presentational shop components (Price, CartButton, AddToCartButton)

**Files:**
- Create: `web/components/shop/Price.tsx`, `web/components/shop/CartButton.tsx`, `web/components/shop/AddToCartButton.tsx`
- Modify: `web/components/Navbar.tsx`

- [ ] **Step 1: Write `web/components/shop/Price.tsx`**

```tsx
import { formatCzk } from "@/lib/money";

export function Price({ value, className }: { value: string | number; className?: string }) {
  return <span className={className}>{formatCzk(value)}</span>;
}
```

- [ ] **Step 2: Write `web/components/shop/CartButton.tsx`**

```tsx
"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export function CartButton() {
  const { count } = useCart();
  return (
    <Link
      href="/obchod/kosik"
      aria-label={`Košík (${count})`}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-md text-moss-deep transition-colors hover:text-moss"
    >
      <ShoppingBag size={22} aria-hidden />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-terracotta px-1 text-xs font-semibold text-cream">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
```

- [ ] **Step 3: Add `CartButton` to `web/components/Navbar.tsx`**

Add the import after the `navItems` import:
```tsx
import { CartButton } from "@/components/shop/CartButton";
```
Inside the right-side `<div className="flex items-center gap-3">`, add `<CartButton />` as the **first** child (before the "Přispět" `Link`):
```tsx
        <div className="flex items-center gap-3">
          <CartButton />
          <Link
            href="/virtualni-adopce"
```

- [ ] **Step 4: Write `web/components/shop/AddToCartButton.tsx`**

```tsx
"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "./CartProvider";

export function AddToCartButton({ productId, disabled }: { productId: number; disabled?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  if (disabled) {
    return (
      <button type="button" disabled className="inline-flex items-center gap-2 rounded-pill bg-surface-alt px-6 py-3 font-medium text-text-muted">
        Vyprodáno
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => { add(productId, 1); setAdded(true); setTimeout(() => setAdded(false), 1800); }}
      className="inline-flex items-center gap-2 rounded-pill bg-moss px-6 py-3 font-medium text-cream transition-colors hover:bg-moss-deep"
    >
      {added ? <><Check size={18} aria-hidden /> Přidáno</> : <><ShoppingBag size={18} aria-hidden /> Do košíku</>}
    </button>
  );
}
```

- [ ] **Step 5: Verify build + commit**

Run: `cd web && npm run build` → Expected: succeeds.
```bash
git add web/components/shop/Price.tsx web/components/shop/CartButton.tsx web/components/shop/AddToCartButton.tsx web/components/Navbar.tsx
git commit -m "feat(web): cart button in navbar, add-to-cart, price"
```

### Task 4.3: Product card + category filter

**Files:**
- Create: `web/components/shop/ProductCard.tsx`, `web/components/shop/CategoryFilter.tsx`

- [ ] **Step 1: Write `web/components/shop/ProductCard.tsx`**

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Price } from "./Price";

export type ProductCardData = {
  slug: string; name: string; price: string;
  imageUrl: string | null; stockQuantity: number; categoryName: string | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const soldOut = product.stockQuantity <= 0;
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-soft transition-[box-shadow,border-color] duration-300 hover:border-accent hover:shadow-lift"
    >
      <Link href={`/obchod/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-surface-alt">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
          {soldOut ? (
            <span className="absolute left-3 top-3 rounded-pill bg-text-muted px-3 py-1 text-xs font-semibold text-cream">
              Vyprodáno
            </span>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {product.categoryName ? (
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{product.categoryName}</p>
        ) : null}
        <h2 className="mt-1 font-serif text-lg font-semibold text-moss-deep">
          <Link href={`/obchod/${product.slug}`} className="hover:text-moss">{product.name}</Link>
        </h2>
        <div className="mt-auto pt-3">
          <Price value={product.price} className="text-lg font-semibold text-moss-deep" />
        </div>
      </div>
    </motion.article>
  );
}
```

- [ ] **Step 2: Write `web/components/shop/CategoryFilter.tsx`** (server component)

```tsx
import Link from "next/link";
import { cn } from "@/lib/cn";

type Cat = { slug: string; name: string; productCount: number };

export function CategoryFilter({ categories, active }: { categories: Cat[]; active?: string }) {
  const pill = "rounded-pill border px-4 py-2 text-sm font-medium transition-colors";
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/obchod"
        className={cn(pill, !active ? "border-moss bg-moss text-cream" : "border-border text-moss-deep hover:bg-surface-alt")}
      >
        Vše
      </Link>
      {categories.filter((c) => c.productCount > 0).map((c) => (
        <Link
          key={c.slug}
          href={`/obchod?kategorie=${c.slug}`}
          className={cn(pill, active === c.slug ? "border-moss bg-moss text-cream" : "border-border text-moss-deep hover:bg-surface-alt")}
        >
          {c.name} <span className="opacity-60">({c.productCount})</span>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verify build + commit**

Run: `cd web && npm run build` → Expected: succeeds.
```bash
git add web/components/shop/ProductCard.tsx web/components/shop/CategoryFilter.tsx
git commit -m "feat(web): product card + category filter"
```

### Task 4.4: Shop listing page

**Files:**
- Modify (replace placeholder): `web/app/obchod/page.tsx`

- [ ] **Step 1: Replace `web/app/obchod/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SocialSection } from "@/components/SocialSection";
import { CategoryFilter } from "@/components/shop/CategoryFilter";
import { ProductCard } from "@/components/shop/ProductCard";
import { getActiveProducts, getCategoriesWithCounts } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Luční obchůdek",
  description: "Ručně vyráběné výrobky z Louky — dřevovýroba, šperky, plakáty a výrobky našich přátel. Výtěžek jde na péči o zvířata.",
  alternates: { canonical: "/obchod" },
};

export const dynamic = "force-dynamic"; // always fresh after admin edits

export default async function Obchod({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const { kategorie } = await searchParams;
  const [categories, products] = await Promise.all([
    getCategoriesWithCounts(),
    getActiveProducts({ categorySlug: kategorie }),
  ]);

  return (
    <>
      <PageHero
        image="/assets/animals-hero.webp"
        imageAlt="Luční obchůdek"
        eyebrow="Podpořte nás nákupem"
        title="Luční obchůdek"
        subtitle="Ručně vyráběné kousky z Louky. Každý nákup putuje přímo na péči o zvířata."
      />
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <CategoryFilter categories={categories} active={kategorie} />
          {products.length === 0 ? (
            <p className="mt-12 text-center text-text-muted">V této kategorii zatím nic není.</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i * 0.04, 0.3)}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
      <SocialSection tone="alt" />
    </>
  );
}
```

- [ ] **Step 2: Verify it renders**

Run: `cd web && npm run dev`, open `http://localhost:3000/obchod`.
Expected: hero + category pills + product grid with migrated products and prices. Filtering by a pill changes the list.

- [ ] **Step 3: Commit**

```bash
git add web/app/obchod/page.tsx
git commit -m "feat(web): shop listing page with category filter"
```

### Task 4.5: Product gallery + detail page

**Files:**
- Create: `web/components/shop/ProductGallery.tsx`
- Create: `web/app/obchod/[slug]/page.tsx`

- [ ] **Step 1: Write `web/components/shop/ProductGallery.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [];
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface-alt">
        {list[active] ? (
          <Image src={list[active]} alt={alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority />
        ) : null}
      </div>
      {list.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {list.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2",
                i === active ? "border-moss" : "border-border",
              )}
            >
              <Image src={src} alt={`${alt} – náhled ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Write `web/app/obchod/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";
import { Price } from "@/components/shop/Price";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { getProductBySlug, getProductImages } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Produkt nenalezen" };
  return {
    title: p.name,
    description: p.description || `${p.name} — Luční obchůdek Nech mě růst.`,
    alternates: { canonical: `/obchod/${p.slug}` },
  };
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.isActive) notFound();

  const gallery = await getProductImages(product.id);
  const images = [product.imageUrl, ...gallery.map((g) => g.imageUrl)].filter(Boolean) as string[];
  const soldOut = product.stockQuantity <= 0;

  return (
    <section className="bg-surface py-12 sm:py-16">
      <Container>
        <Link href="/obchod" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-moss-deep hover:text-moss">
          <ArrowLeft size={16} aria-hidden /> Zpět do obchodu
        </Link>
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={images} alt={product.name} />
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl font-semibold text-moss-deep sm:text-4xl">{product.name}</h1>
            <Price value={product.price} className="mt-4 text-2xl font-semibold text-moss" />
            <p className={`mt-2 text-sm ${soldOut ? "text-terracotta" : "text-text-muted"}`}>
              {soldOut ? "Momentálně vyprodáno" : `Skladem: ${product.stockQuantity} ks`}
            </p>
            {product.description ? (
              <p className="mt-6 whitespace-pre-line leading-relaxed text-text">{product.description}</p>
            ) : null}
            <div className="mt-8">
              <AddToCartButton productId={product.id} disabled={soldOut} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Verify it renders**

With `npm run dev`, click a product on `/obchod`. Expected: detail page with gallery, price, stock, "Do košíku" updates the navbar cart count.

- [ ] **Step 4: Commit**

```bash
git add web/components/shop/ProductGallery.tsx web/app/obchod/[slug]/page.tsx
git commit -m "feat(web): product detail page with gallery"
```

---

## Phase 5 — Cart page, checkout, order creation

### Task 5.1: Cart-data route + cart products hook

**Files:**
- Create: `web/app/obchod/cart-data/route.ts`
- Create: `web/components/shop/useCartProducts.ts`

- [ ] **Step 1: Write `web/app/obchod/cart-data/route.ts`**

```ts
import { getProductsByIds } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const idsParam = new URL(req.url).searchParams.get("ids") ?? "";
  const ids = idsParam.split(",").map(Number).filter((n) => Number.isInteger(n) && n > 0);
  const rows = await getProductsByIds(ids);
  const products = rows.map((p) => ({
    id: p.id, name: p.name, slug: p.slug, price: p.price,
    imageUrl: p.imageUrl, stockQuantity: p.stockQuantity,
  }));
  return Response.json({ products });
}
```

- [ ] **Step 2: Write `web/components/shop/useCartProducts.ts`**

```ts
"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

export type CartProduct = {
  id: number; name: string; slug: string; price: string;
  imageUrl: string | null; stockQuantity: number;
};
export type CartLine = CartProduct & { quantity: number };

export function useCartProducts(): { lines: CartLine[]; loading: boolean } {
  const { items } = useCart();
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const idsKey = items.map((i) => i.id).sort((a, b) => a - b).join(",");

  useEffect(() => {
    if (!idsKey) { setProducts([]); setLoading(false); return; }
    setLoading(true);
    fetch(`/obchod/cart-data?ids=${idsKey}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .finally(() => setLoading(false));
  }, [idsKey]);

  const lines = items
    .map((i) => {
      const p = products.find((x) => x.id === i.id);
      return p ? { ...p, quantity: i.quantity } : null;
    })
    .filter((x): x is CartLine => x !== null);

  return { lines, loading };
}
```

- [ ] **Step 3: Commit**

```bash
git add web/app/obchod/cart-data/route.ts web/components/shop/useCartProducts.ts
git commit -m "feat(web): cart-data route + useCartProducts hook"
```

### Task 5.2: Cart page

**Files:**
- Create: `web/components/shop/CartContents.tsx`
- Create: `web/app/obchod/kosik/page.tsx`

- [ ] **Step 1: Write `web/components/shop/CartContents.tsx`**

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "./CartProvider";
import { useCartProducts } from "./useCartProducts";
import { Price } from "./Price";
import { formatCzk } from "@/lib/money";

export function CartContents() {
  const { updateQty, remove, ready } = useCart();
  const { lines, loading } = useCartProducts();

  if (!ready || loading) return <p className="text-text-muted">Načítám košík…</p>;
  if (lines.length === 0) {
    return (
      <div className="text-center">
        <p className="text-text-muted">Váš košík je prázdný.</p>
        <Link href="/obchod" className="mt-6 inline-flex rounded-pill bg-moss px-6 py-3 font-medium text-cream hover:bg-moss-deep">
          Zpět do obchodu
        </Link>
      </div>
    );
  }

  const total = lines.reduce((s, l) => s + Number(l.price) * l.quantity, 0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <ul className="divide-y divide-border">
        {lines.map((l) => (
          <li key={l.id} className="flex gap-4 py-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-surface-alt">
              {l.imageUrl ? <Image src={l.imageUrl} alt={l.name} fill sizes="80px" className="object-cover" /> : null}
            </div>
            <div className="flex flex-1 flex-col">
              <Link href={`/obchod/${l.slug}`} className="font-serif text-lg font-semibold text-moss-deep hover:text-moss">{l.name}</Link>
              <Price value={l.price} className="text-sm text-text-muted" />
              <div className="mt-auto flex items-center gap-3">
                <div className="inline-flex items-center rounded-pill border border-border">
                  <button type="button" aria-label="Méně" onClick={() => updateQty(l.id, l.quantity - 1)} className="px-2.5 py-1.5 text-moss-deep"><Minus size={14} /></button>
                  <span className="min-w-8 text-center text-sm">{l.quantity}</span>
                  <button type="button" aria-label="Více" onClick={() => updateQty(l.id, Math.min(l.stockQuantity, l.quantity + 1))} className="px-2.5 py-1.5 text-moss-deep"><Plus size={14} /></button>
                </div>
                <button type="button" onClick={() => remove(l.id)} className="inline-flex items-center gap-1 text-sm text-terracotta hover:underline">
                  <Trash2 size={14} /> Odebrat
                </button>
              </div>
            </div>
            <Price value={Number(l.price) * l.quantity} className="font-semibold text-moss-deep" />
          </li>
        ))}
      </ul>
      <aside className="h-fit rounded-lg border border-border bg-surface-alt p-6">
        <h2 className="font-serif text-xl font-semibold text-moss-deep">Shrnutí</h2>
        <div className="mt-4 flex justify-between text-sm"><span>Mezisoučet</span><strong>{formatCzk(total)}</strong></div>
        <div className="mt-1 flex justify-between text-sm text-text-muted"><span>Doprava</span><span>Dle dohody</span></div>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg"><span>Celkem</span><strong className="text-moss">{formatCzk(total)}</strong></div>
        <Link href="/obchod/pokladna" className="mt-6 inline-flex w-full items-center justify-center rounded-pill bg-moss px-6 py-3 font-medium text-cream hover:bg-moss-deep">
          K pokladně
        </Link>
      </aside>
    </div>
  );
}
```

- [ ] **Step 2: Write `web/app/obchod/kosik/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { CartContents } from "@/components/shop/CartContents";

export const metadata: Metadata = { title: "Košík", robots: { index: false } };

export default function KosikPage() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container className="max-w-4xl">
        <h1 className="mb-8 font-serif text-3xl font-semibold text-moss-deep sm:text-4xl">Košík</h1>
        <CartContents />
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: Verify, then commit**

`npm run dev` → add items → open `/obchod/kosik`. Expected: lines, qty +/-, remove, totals.
```bash
git add web/components/shop/CartContents.tsx web/app/obchod/kosik/page.tsx
git commit -m "feat(web): cart page"
```

### Task 5.3: Order placement core (`placeOrder`) + integration test

**Files:**
- Create: `web/lib/orders.ts`
- Test: `web/tests/integration/order.test.ts`

- [ ] **Step 1: Write the failing test `web/tests/integration/order.test.ts`**

```ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db, schema } from "../../lib/db";
import { eq } from "drizzle-orm";
import { placeOrder } from "../../lib/orders";

const SLUG = "order-test-" + Date.now();
let productId: number;
const createdOrderNumbers: string[] = [];

const baseInput = {
  customer_name: "Test Tester", customer_email: "test@example.cz", customer_phone: "+420 1",
  street: "Ulice 1", city: "Praha", postal_code: "11000", notes: "",
};

describe("placeOrder", () => {
  beforeAll(async () => {
    const ins = await db.insert(schema.products)
      .values({ name: "Order Test", slug: SLUG, price: "100.00", stockQuantity: 3, isActive: true })
      .returning({ id: schema.products.id });
    productId = ins[0].id;
  });
  afterAll(async () => {
    for (const n of createdOrderNumbers) {
      const o = await db.select().from(schema.orders).where(eq(schema.orders.orderNumber, n));
      if (o[0]) await db.delete(schema.orders).where(eq(schema.orders.id, o[0].id)); // cascades order_items
    }
    await db.delete(schema.products).where(eq(schema.products.id, productId));
  });

  it("creates an order, computes total from DB, decrements stock", async () => {
    const res = await placeOrder({ ...baseInput, items: [{ product_id: productId, quantity: 2 }] }, "1.2.3.4");
    expect(res.ok).toBe(true);
    if (res.ok) {
      createdOrderNumbers.push(res.order.orderNumber);
      expect(res.order.total).toBe(200);
      expect(res.order.variableSymbol).toMatch(/^\d{1,10}$/);
    }
    const p = await db.select().from(schema.products).where(eq(schema.products.id, productId));
    expect(p[0].stockQuantity).toBe(1);
  });

  it("rejects an over-stock order without changing stock", async () => {
    const res = await placeOrder({ ...baseInput, items: [{ product_id: productId, quantity: 5 }] }, "1.2.3.4");
    expect(res.ok).toBe(false);
    const p = await db.select().from(schema.products).where(eq(schema.products.id, productId));
    expect(p[0].stockQuantity).toBe(1); // unchanged
  });

  it("rejects an unknown product id", async () => {
    const res = await placeOrder({ ...baseInput, items: [{ product_id: 999999999, quantity: 1 }] }, "1.2.3.4");
    expect(res.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd web && npx vitest run tests/integration/order.test.ts`
Expected: FAIL — `placeOrder` not found.

- [ ] **Step 3: Write `web/lib/orders.ts`**

```ts
import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { db, schema } from "./db";
import { checkoutSchema } from "./validation";
import { generateOrderNumber, generateVariableSymbol } from "./payment";
import { lineTotal } from "./money";
import { env } from "./env";

class OrderError extends Error {}

export type PlacedOrder = {
  orderNumber: string; variableSymbol: string; total: number;
  customerName: string; customerEmail: string; customerPhone: string;
  shippingAddress: string; notes: string;
  items: { name: string; quantity: number; lineTotal: number }[];
};

export type PlaceOrderResult =
  | { ok: true; order: PlacedOrder }
  | { ok: false; error: string };

export async function placeOrder(rawInput: unknown, ip: string): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(rawInput);
  if (!parsed.success) return { ok: false, error: "Neplatná data objednávky." };
  const input = parsed.data;

  const shippingAddress = `${input.street}, ${input.postal_code} ${input.city}`;
  const orderNumber = generateOrderNumber(env.orderPrefix());
  const variableSymbol = generateVariableSymbol(orderNumber);

  try {
    const result = await db.transaction(async (tx) => {
      let total = 0;
      const resolved: { productId: number; name: string; quantity: number; unitPrice: string; lineTotal: number }[] = [];

      for (const it of input.items) {
        const rows = await tx
          .select().from(schema.products)
          .where(and(eq(schema.products.id, it.product_id), eq(schema.products.isActive, true)))
          .for("update");
        const product = rows[0];
        if (!product) throw new OrderError("Některý produkt už není dostupný.");
        if (it.quantity > product.stockQuantity) {
          throw new OrderError(`Produkt „${product.name}" není skladem v požadovaném množství.`);
        }
        const lt = lineTotal(product.price, it.quantity);
        total += lt;
        resolved.push({ productId: product.id, name: product.name, quantity: it.quantity, unitPrice: product.price, lineTotal: lt });
      }
      if (resolved.length === 0 || total <= 0) throw new OrderError("Košík je prázdný.");

      const ins = await tx.insert(schema.orders).values({
        orderNumber, variableSymbol,
        customerName: input.customer_name, customerEmail: input.customer_email,
        customerPhone: input.customer_phone, shippingAddress,
        totalAmount: String(total), notes: input.notes, customerIp: ip,
      }).returning({ id: schema.orders.id });
      const orderId = ins[0].id;

      for (const r of resolved) {
        await tx.insert(schema.orderItems).values({
          orderId, productId: r.productId, productName: r.name,
          quantity: r.quantity, unitPrice: String(r.unitPrice), totalPrice: String(r.lineTotal),
        });
        await tx.update(schema.products)
          .set({ stockQuantity: sql`${schema.products.stockQuantity} - ${r.quantity}` })
          .where(eq(schema.products.id, r.productId));
      }
      return { total, items: resolved.map((r) => ({ name: r.name, quantity: r.quantity, lineTotal: r.lineTotal })) };
    });

    return {
      ok: true,
      order: {
        orderNumber, variableSymbol, total: result.total,
        customerName: input.customer_name, customerEmail: input.customer_email,
        customerPhone: input.customer_phone, shippingAddress, notes: input.notes, items: result.items,
      },
    };
  } catch (e) {
    if (e instanceof OrderError) return { ok: false, error: e.message };
    console.error("[placeOrder]", e);
    return { ok: false, error: "Chyba při zpracování objednávky. Zkuste to prosím znovu." };
  }
}
```

- [ ] **Step 4: Run to verify pass**

Run: `cd web && npx vitest run tests/integration/order.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add web/lib/orders.ts web/tests/integration/order.test.ts
git commit -m "feat(web): transactional order placement with integration tests"
```

### Task 5.4: createOrder Server Action + checkout form

**Files:**
- Create: `web/app/obchod/actions.ts`
- Create: `web/components/shop/CheckoutForm.tsx`
- Create: `web/app/obchod/pokladna/page.tsx`

- [ ] **Step 1: Write `web/app/obchod/actions.ts`**

```ts
"use server";

import { headers } from "next/headers";
import { placeOrder } from "@/lib/orders";
import { sendOrderEmails } from "@/lib/email";
import { countRecentOrdersFromIp } from "@/lib/db/queries";

export async function createOrder(raw: unknown): Promise<{ ok: true; orderNumber: string } | { ok: false; error: string }> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "0.0.0.0";

  if ((await countRecentOrdersFromIp(ip, 60)) >= 5) {
    return { ok: false, error: "Příliš mnoho požadavků. Zkuste to prosím za chvíli." };
  }

  const res = await placeOrder(raw, ip);
  if (!res.ok) return res;

  try {
    await sendOrderEmails({
      orderNumber: res.order.orderNumber, variableSymbol: res.order.variableSymbol,
      customerName: res.order.customerName, customerEmail: res.order.customerEmail,
      customerPhone: res.order.customerPhone, shippingAddress: res.order.shippingAddress,
      notes: res.order.notes, items: res.order.items, total: res.order.total,
    });
  } catch (e) {
    console.error("[createOrder email]", e); // order already saved; don't fail
  }
  return { ok: true, orderNumber: res.order.orderNumber };
}
```

- [ ] **Step 2: Write `web/components/shop/CheckoutForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { useCartProducts } from "./useCartProducts";
import { formatCzk } from "@/lib/money";
import { createOrder } from "@/app/obchod/actions";

const field = "w-full rounded-md border border-border bg-surface px-3 py-2.5 text-text focus:border-moss focus:outline-none";

export function CheckoutForm() {
  const router = useRouter();
  const { items, clear, ready } = useCart();
  const { lines, loading } = useCartProducts();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!ready || loading) return <p className="text-text-muted">Načítám…</p>;
  if (lines.length === 0) {
    return (
      <div className="text-center">
        <p className="text-text-muted">Košík je prázdný.</p>
        <Link href="/obchod" className="mt-6 inline-flex rounded-pill bg-moss px-6 py-3 font-medium text-cream hover:bg-moss-deep">Do obchodu</Link>
      </div>
    );
  }

  const total = lines.reduce((s, l) => s + Number(l.price) * l.quantity, 0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      customer_name: String(fd.get("customer_name") ?? ""),
      customer_email: String(fd.get("customer_email") ?? ""),
      customer_phone: String(fd.get("customer_phone") ?? ""),
      street: String(fd.get("street") ?? ""),
      city: String(fd.get("city") ?? ""),
      postal_code: String(fd.get("postal_code") ?? ""),
      notes: String(fd.get("notes") ?? ""),
      items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
    };
    const res = await createOrder(payload);
    if (res.ok) {
      clear();
      router.push(`/obchod/objednavka/${res.orderNumber}`);
    } else {
      setError(res.error); setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <fieldset className="rounded-lg border border-border bg-surface p-6">
          <legend className="px-2 font-serif text-lg font-semibold text-moss-deep">Kontaktní údaje</legend>
          <div className="grid gap-4">
            <label className="block"><span className="text-sm font-medium">Jméno a příjmení *</span>
              <input name="customer_name" required maxLength={100} className={field} /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block"><span className="text-sm font-medium">E-mail *</span>
                <input name="customer_email" type="email" required maxLength={190} className={field} /></label>
              <label className="block"><span className="text-sm font-medium">Telefon</span>
                <input name="customer_phone" maxLength={30} className={field} /></label>
            </div>
          </div>
        </fieldset>
        <fieldset className="rounded-lg border border-border bg-surface p-6">
          <legend className="px-2 font-serif text-lg font-semibold text-moss-deep">Doručovací adresa</legend>
          <div className="grid gap-4">
            <label className="block"><span className="text-sm font-medium">Ulice a č.p. *</span>
              <input name="street" required maxLength={200} className={field} /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block"><span className="text-sm font-medium">Město *</span>
                <input name="city" required maxLength={100} className={field} /></label>
              <label className="block"><span className="text-sm font-medium">PSČ *</span>
                <input name="postal_code" required maxLength={20} className={field} /></label>
            </div>
            <label className="block"><span className="text-sm font-medium">Poznámka</span>
              <textarea name="notes" rows={3} maxLength={1000} className={field} /></label>
          </div>
        </fieldset>
        <p className="text-sm text-text-muted">Platba probíhá <strong>bankovním převodem</strong> — po odeslání objednávky obdržíte e-mailem platební údaje (číslo účtu a variabilní symbol).</p>
        {error ? <p className="rounded-md bg-terracotta/10 px-4 py-3 text-sm text-terracotta">{error}</p> : null}
      </div>

      <aside className="h-fit rounded-lg border border-border bg-surface-alt p-6">
        <h2 className="font-serif text-xl font-semibold text-moss-deep">Shrnutí</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {lines.map((l) => (
            <li key={l.id} className="flex justify-between"><span>{l.name} ×{l.quantity}</span><span>{formatCzk(Number(l.price) * l.quantity)}</span></li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between text-sm text-text-muted"><span>Doprava</span><span>Dle dohody</span></div>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg"><span>Celkem</span><strong className="text-moss">{formatCzk(total)}</strong></div>
        <button type="submit" disabled={submitting} className="mt-6 inline-flex w-full items-center justify-center rounded-pill bg-moss px-6 py-3 font-medium text-cream hover:bg-moss-deep disabled:opacity-60">
          {submitting ? "Odesílám…" : "Odeslat objednávku"}
        </button>
      </aside>
    </form>
  );
}
```

- [ ] **Step 3: Write `web/app/obchod/pokladna/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { CheckoutForm } from "@/components/shop/CheckoutForm";

export const metadata: Metadata = { title: "Pokladna", robots: { index: false } };

export default function PokladnaPage() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container className="max-w-4xl">
        <h1 className="mb-8 font-serif text-3xl font-semibold text-moss-deep sm:text-4xl">Pokladna</h1>
        <CheckoutForm />
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add web/app/obchod/actions.ts web/components/shop/CheckoutForm.tsx web/app/obchod/pokladna/page.tsx
git commit -m "feat(web): checkout form + createOrder server action"
```

### Task 5.5: Order confirmation page

**Files:**
- Create: `web/app/obchod/objednavka/[orderNumber]/page.tsx`

- [ ] **Step 1: Write `web/app/obchod/objednavka/[orderNumber]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/Container";
import { formatCzk } from "@/lib/money";
import { getOrderByNumber } from "@/lib/db/queries";
import { env } from "@/lib/env";

export const metadata: Metadata = { title: "Objednávka přijata", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();
  const bank = env.bank();

  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container className="max-w-2xl">
        <div className="rounded-lg border border-border bg-surface-alt p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-pill bg-moss/10 text-moss">
            <CheckCircle2 size={30} aria-hidden />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-moss-deep sm:text-3xl">Děkujeme za objednávku!</h1>
          <p className="mt-2 text-text-muted">Číslo objednávky <strong>{order.orderNumber}</strong>. Potvrzení jsme poslali na {order.customerEmail}.</p>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-surface p-6">
          <h2 className="font-serif text-lg font-semibold text-moss-deep">Platební údaje (bankovní převod)</h2>
          <dl className="mt-3 space-y-1.5 text-sm">
            {bank.name ? <div className="flex justify-between"><dt className="text-text-muted">Banka</dt><dd>{bank.name}</dd></div> : null}
            {bank.account ? <div className="flex justify-between"><dt className="text-text-muted">Číslo účtu</dt><dd className="font-medium">{bank.account}</dd></div> : null}
            {bank.iban ? <div className="flex justify-between"><dt className="text-text-muted">IBAN</dt><dd>{bank.iban}</dd></div> : null}
            <div className="flex justify-between"><dt className="text-text-muted">Variabilní symbol</dt><dd className="font-medium">{order.variableSymbol}</dd></div>
            <div className="flex justify-between border-t border-border pt-2 text-base"><dt>Částka</dt><dd className="font-semibold text-moss">{formatCzk(order.totalAmount)}</dd></div>
          </dl>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-surface p-6">
          <h2 className="font-serif text-lg font-semibold text-moss-deep">Položky</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {order.items.map((it) => (
              <li key={it.id} className="flex justify-between"><span>{it.productName} ×{it.quantity}</span><span>{formatCzk(it.totalPrice)}</span></li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify the full flow**

`npm run dev`: add to cart → checkout → fill form → submit. Expected: redirect to `/obchod/objednavka/NMR-...` showing bank details + VS; navbar cart resets to 0; an order row appears in `db:studio`. (Email arrival is verified in Phase 8.)

- [ ] **Step 3: Commit**

```bash
git add web/app/obchod/objednavka/[orderNumber]/page.tsx
git commit -m "feat(web): order confirmation page"
```

---

## Phase 6 — Admin authentication

> **Layout structure:** admin pages live in a route group `app/admin/(panel)/` whose layout
> guards the session; `app/admin/login` sits **outside** that group so it isn't guarded (no
> redirect loop). The site's root layout (public navbar/footer) still wraps admin — acceptable
> for an internal one-user tool; a dedicated admin root layout is a possible future cleanup.

### Task 6.1: Session + auth helpers

**Files:**
- Create: `web/lib/auth.ts`

- [ ] **Step 1: Write `web/lib/auth.ts`**

```ts
import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "./env";

export interface SessionData {
  adminId?: number;
  username?: string;
}

export const sessionOptions: SessionOptions = {
  password: env.sessionSecret(),
  cookieName: "nmr_admin",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function requireAdmin(): Promise<SessionData> {
  const session = await getSession();
  if (!session.adminId) redirect("/admin/login");
  return session;
}
```

- [ ] **Step 2: Commit**

```bash
git add web/lib/auth.ts && git commit -m "feat(web): iron-session admin auth helpers"
```

### Task 6.2: Admin server actions file (auth actions)

**Files:**
- Create: `web/app/admin/actions.ts`

> This file holds **all** admin Server Actions. It starts with auth; product/category/order
> actions are appended in Phase 7. Every action re-checks the session.

- [ ] **Step 1: Write `web/app/admin/actions.ts`**

```ts
"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, schema } from "@/lib/db";
import { getSession } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const rows = await db.select().from(schema.admins).where(eq(schema.admins.username, username));
  const admin = rows[0];
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return { error: "Nesprávné jméno nebo heslo." };
  }

  const session = await getSession();
  session.adminId = admin.id;
  session.username = admin.username;
  await session.save();

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || null;
  await db.update(schema.admins).set({ lastLoginAt: new Date(), lastLoginIp: ip }).where(eq(schema.admins.id, admin.id));

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
```

- [ ] **Step 2: Commit**

```bash
git add web/app/admin/actions.ts && git commit -m "feat(web): admin login/logout server actions"
```

### Task 6.3: Login page

**Files:**
- Create: `web/app/admin/login/page.tsx`

- [ ] **Step 1: Write `web/app/admin/login/page.tsx`**

```tsx
"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "../actions";

const initial: LoginState = {};

export default function AdminLogin() {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-sm rounded-lg border border-border bg-surface-alt p-8">
        <h1 className="font-serif text-2xl font-semibold text-moss-deep">Administrace</h1>
        <form action={action} className="mt-6 space-y-4">
          <label className="block"><span className="text-sm font-medium">Uživatel</span>
            <input name="username" required autoComplete="username"
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 focus:border-moss focus:outline-none" /></label>
          <label className="block"><span className="text-sm font-medium">Heslo</span>
            <input name="password" type="password" required autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 focus:border-moss focus:outline-none" /></label>
          {state.error ? <p className="rounded-md bg-terracotta/10 px-3 py-2 text-sm text-terracotta">{state.error}</p> : null}
          <button type="submit" disabled={pending}
            className="inline-flex w-full items-center justify-center rounded-pill bg-moss px-6 py-3 font-medium text-cream hover:bg-moss-deep disabled:opacity-60">
            {pending ? "Přihlašuji…" : "Přihlásit se"}
          </button>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add web/app/admin/login/page.tsx && git commit -m "feat(web): admin login page"
```

### Task 6.4: Admin chrome (guarded layout + nav) + dashboard

**Files:**
- Create: `web/components/admin/AdminNav.tsx`
- Create: `web/app/admin/(panel)/layout.tsx`
- Create: `web/app/admin/(panel)/page.tsx`

- [ ] **Step 1: Write `web/components/admin/AdminNav.tsx`**

```tsx
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export function AdminNav({ username }: { username?: string }) {
  const link = "rounded-md px-3 py-2 text-sm font-medium text-moss-deep hover:bg-surface-alt";
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-1 px-5 py-3">
        <span className="mr-4 font-serif font-semibold text-moss-deep">Administrace</span>
        <Link href="/admin" className={link}>Přehled</Link>
        <Link href="/admin/products" className={link}>Produkty</Link>
        <Link href="/admin/categories" className={link}>Kategorie</Link>
        <Link href="/admin/orders" className={link}>Objednávky</Link>
        <form action={logoutAction} className="ml-auto flex items-center gap-3">
          {username ? <span className="text-sm text-text-muted">{username}</span> : null}
          <button type="submit" className="rounded-md px-3 py-2 text-sm font-medium text-terracotta hover:bg-surface-alt">Odhlásit</button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `web/app/admin/(panel)/layout.tsx`**

```tsx
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="min-h-screen bg-surface-alt/40">
      <AdminNav username={session.username} />
      <div className="mx-auto max-w-[1180px] px-5 py-8">{children}</div>
    </div>
  );
}
```

- [ ] **Step 3: Write `web/app/admin/(panel)/page.tsx` (dashboard)**

```tsx
import Link from "next/link";
import { sql, desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { formatCzk } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [[products], [active], [orderCount], recent] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(schema.products),
    db.select({ n: sql<number>`count(*)::int` }).from(schema.products).where(eq(schema.products.isActive, true)),
    db.select({ n: sql<number>`count(*)::int` }).from(schema.orders),
    db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt)).limit(8),
  ]);

  const cards = [
    { label: "Produkty", value: products.n },
    { label: "Aktivní", value: active.n },
    { label: "Objednávky", value: orderCount.n },
  ];

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-moss-deep">Přehled</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-border bg-surface p-5">
            <p className="text-sm text-text-muted">{c.label}</p>
            <p className="mt-1 text-3xl font-semibold text-moss-deep">{c.value}</p>
          </div>
        ))}
      </div>
      <h2 className="mb-3 mt-8 font-serif text-lg font-semibold text-moss-deep">Poslední objednávky</h2>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-text-muted">
            <th className="p-3">Číslo</th><th className="p-3">Zákazník</th><th className="p-3">Stav</th><th className="p-3">Částka</th>
          </tr></thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id} className="border-b border-border/60">
                <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-medium text-moss hover:underline">{o.orderNumber}</Link></td>
                <td className="p-3">{o.customerName}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{formatCzk(o.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify the guard works**

`npm run dev`: open `/admin` while logged out → redirect to `/admin/login`. Log in with the account from Task 3.2 → dashboard with counts + recent orders. `/admin/login` while logged in still shows the form (acceptable); after login it redirects to `/admin`.

- [ ] **Step 5: Commit**

```bash
git add web/components/admin/AdminNav.tsx "web/app/admin/(panel)/layout.tsx" "web/app/admin/(panel)/page.tsx"
git commit -m "feat(web): guarded admin layout + dashboard"
```

---

## Phase 7 — Admin CRUD (products, categories, orders, image upload)

### Task 7.1: Admin CRUD server actions

**Files:**
- Modify: `web/app/admin/actions.ts`

- [ ] **Step 1: Add imports at the top of `web/app/admin/actions.ts`**

After the existing imports, add:
```ts
import { revalidatePath } from "next/cache";
import { sql } from "drizzle-orm";
import { saveImage } from "@/lib/storage";
import { requireAdmin } from "@/lib/auth";
import { productSchema, categorySchema } from "@/lib/validation";
```

- [ ] **Step 2: Append the CRUD actions to `web/app/admin/actions.ts`**

```ts
// ---- images ----
export async function uploadImage(formData: FormData): Promise<{ url: string } | { error: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Žádný soubor." };
  if (file.size > 5 * 1024 * 1024) return { error: "Soubor je větší než 5 MB." };
  const allowed: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  const ext = allowed[file.type];
  if (!ext) return { error: "Povolené formáty: JPG, PNG, WebP." };
  // saveImage stores to Netlify Blobs and returns the same-origin /img/<key> path.
  const url = await saveImage(`upload.${ext}`, await file.arrayBuffer(), file.type);
  return { url };
}

// ---- products ----
export type FormState = { error?: string };

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") ?? "",
    price: formData.get("price"),
    stock_quantity: formData.get("stock_quantity") ?? 0,
    category_id: formData.get("category_id") || null,
    image_url: formData.get("image_url") || "",
    is_active: formData.get("is_active") === "on" || formData.get("is_active") === "1",
  });
  if (!parsed.success) {
    return { error: "Zkontrolujte pole: " + parsed.error.issues.map((i) => i.path.join(".")).join(", ") };
  }
  const v = parsed.data;
  const values = {
    name: v.name, slug: v.slug, description: v.description, price: String(v.price),
    stockQuantity: v.stock_quantity, categoryId: v.category_id ?? null,
    imageUrl: v.image_url || null, isActive: v.is_active, updatedAt: new Date(),
  };

  try {
    if (id) await db.update(schema.products).set(values).where(eq(schema.products.id, id));
    else await db.insert(schema.products).values(values);
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === "23505") return { error: "Tento slug už existuje, zvolte jiný." };
    console.error("[saveProduct]", e);
    return { error: "Chyba při uložení." };
  }

  revalidatePath("/obchod");
  revalidatePath(`/obchod/${v.slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) await db.delete(schema.products).where(eq(schema.products.id, id));
  revalidatePath("/obchod");
  redirect("/admin/products");
}

export async function addProductImage(productId: number, url: string): Promise<void> {
  await requireAdmin();
  const max = await db
    .select({ m: sql<number>`coalesce(max(${schema.productImages.displayOrder}), -1)::int` })
    .from(schema.productImages).where(eq(schema.productImages.productId, productId));
  await db.insert(schema.productImages).values({ productId, imageUrl: url, displayOrder: (max[0]?.m ?? -1) + 1 });
}

export async function deleteProductImage(imageId: number): Promise<void> {
  await requireAdmin();
  await db.delete(schema.productImages).where(eq(schema.productImages.id, imageId));
}

// ---- categories ----
export async function saveCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;
  const parsed = categorySchema.safeParse({
    name: formData.get("name"), slug: formData.get("slug"),
    description: formData.get("description") ?? "", display_order: formData.get("display_order") ?? 0,
  });
  if (!parsed.success) return { error: "Zkontrolujte pole kategorie." };
  const v = parsed.data;
  const values = { name: v.name, slug: v.slug, description: v.description, displayOrder: v.display_order };
  try {
    if (id) await db.update(schema.categories).set(values).where(eq(schema.categories.id, id));
    else await db.insert(schema.categories).values(values);
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === "23505") return { error: "Tento slug kategorie už existuje." };
    console.error("[saveCategory]", e);
    return { error: "Chyba při uložení kategorie." };
  }
  revalidatePath("/obchod");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) await db.delete(schema.categories).where(eq(schema.categories.id, id));
  revalidatePath("/obchod");
  redirect("/admin/categories");
}

// ---- orders ----
const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "completed", "cancelled"] as const;
const PAYMENT_STATUSES = ["pending", "completed", "failed", "refunded"] as const;

export async function updateOrderStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  const paymentStatus = String(formData.get("payment_status"));
  if (!id || !ORDER_STATUSES.includes(status as never) || !PAYMENT_STATUSES.includes(paymentStatus as never)) return;
  await db.update(schema.orders)
    .set({ status: status as (typeof ORDER_STATUSES)[number], paymentStatus: paymentStatus as (typeof PAYMENT_STATUSES)[number], updatedAt: new Date() })
    .where(eq(schema.orders.id, id));
  redirect(`/admin/orders/${id}`);
}
```

- [ ] **Step 3: Verify it compiles**

Run: `cd web && npx tsc --noEmit` → Expected: no type errors.

- [ ] **Step 4: Commit**

```bash
git add web/app/admin/actions.ts && git commit -m "feat(web): admin CRUD server actions (product/category/order/upload)"
```

### Task 7.2: Image upload + product form components

**Files:**
- Create: `web/components/admin/ImageUpload.tsx`
- Create: `web/components/admin/ProductForm.tsx`
- Create: `web/components/admin/GalleryManager.tsx`

- [ ] **Step 1: Write `web/components/admin/ImageUpload.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/app/admin/actions";

export function ImageUpload({ value, onUploaded }: { value?: string; onUploaded: (url: string) => void }) {
  const [preview, setPreview] = useState(value ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setError("");
    const fd = new FormData(); fd.append("file", file);
    const res = await uploadImage(fd);
    setBusy(false);
    if ("url" in res) { setPreview(res.url); onUploaded(res.url); }
    else setError(res.error);
  }

  return (
    <div className="rounded-md border-2 border-dashed border-border p-4">
      {preview ? (
        <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-md bg-surface-alt">
          <Image src={preview} alt="Náhled" fill sizes="96px" className="object-cover" />
        </div>
      ) : null}
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onChange} disabled={busy} className="text-sm" />
      {busy ? <p className="mt-1 text-sm text-text-muted">Nahrávám…</p> : null}
      {error ? <p className="mt-1 text-sm text-terracotta">{error}</p> : null}
      <p className="mt-1 text-xs text-text-muted">JPG, PNG nebo WebP, max 5 MB.</p>
    </div>
  );
}
```

- [ ] **Step 2: Write `web/components/admin/ProductForm.tsx`**

```tsx
"use client";

import { useActionState, useState } from "react";
import { saveProduct, type FormState } from "@/app/admin/actions";
import { ImageUpload } from "./ImageUpload";

type Category = { id: number; name: string };
type Product = {
  id: number; name: string; slug: string; description: string | null;
  price: string; stockQuantity: number; categoryId: number | null; imageUrl: string | null; isActive: boolean;
};

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const field = "w-full rounded-md border border-border bg-surface px-3 py-2.5 focus:border-moss focus:outline-none";
const initial: FormState = {};

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const [state, action, pending] = useActionState(saveProduct, initial);
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");

  return (
    <form action={action} className="max-w-2xl space-y-5">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="image_url" value={imageUrl} />

      <label className="block"><span className="text-sm font-medium">Název *</span>
        <input name="name" required maxLength={200} defaultValue={product?.name}
          onChange={(e) => { if (!product) setSlug(slugify(e.target.value)); }} className={field} /></label>

      <label className="block"><span className="text-sm font-medium">URL slug *</span>
        <input name="slug" required pattern="[a-z0-9-]+" value={slug} onChange={(e) => setSlug(e.target.value)} className={field} />
        <span className="text-xs text-text-muted">Jen malá písmena bez diakritiky, číslice, pomlčky.</span></label>

      <label className="block"><span className="text-sm font-medium">Kategorie</span>
        <select name="category_id" defaultValue={product?.categoryId ?? ""} className={field}>
          <option value="">— Bez kategorie —</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select></label>

      <label className="block"><span className="text-sm font-medium">Popis</span>
        <textarea name="description" rows={5} defaultValue={product?.description ?? ""} className={field} /></label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="text-sm font-medium">Cena (Kč) *</span>
          <input name="price" type="number" min={1} step={1} required defaultValue={product?.price} className={field} /></label>
        <label className="block"><span className="text-sm font-medium">Skladem (ks)</span>
          <input name="stock_quantity" type="number" min={0} defaultValue={product?.stockQuantity ?? 0} className={field} /></label>
      </div>

      <div><span className="text-sm font-medium">Hlavní obrázek</span>
        <div className="mt-1"><ImageUpload value={imageUrl} onUploaded={setImageUrl} /></div></div>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="is_active" defaultChecked={product ? product.isActive : true} />
        <span className="text-sm font-medium">Aktivní (zobrazit v obchodě)</span></label>

      {state.error ? <p className="rounded-md bg-terracotta/10 px-3 py-2 text-sm text-terracotta">{state.error}</p> : null}

      <button type="submit" disabled={pending}
        className="inline-flex items-center rounded-pill bg-moss px-6 py-3 font-medium text-cream hover:bg-moss-deep disabled:opacity-60">
        {pending ? "Ukládám…" : product ? "Uložit změny" : "Vytvořit produkt"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Write `web/components/admin/GalleryManager.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadImage, addProductImage, deleteProductImage } from "@/app/admin/actions";

type Img = { id: number; imageUrl: string };

export function GalleryManager({ productId, initial }: { productId: number; initial: Img[] }) {
  const [images, setImages] = useState<Img[]>(initial);
  const [busy, setBusy] = useState(false);

  async function onAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const fd = new FormData(); fd.append("file", file);
    const res = await uploadImage(fd);
    if ("url" in res) {
      await addProductImage(productId, res.url);
      // optimistic: refetch is overkill — show immediately with a temp id
      setImages((cur) => [...cur, { id: Date.now(), imageUrl: res.url }]);
    }
    setBusy(false);
    e.target.value = "";
  }

  async function onDelete(id: number) {
    await deleteProductImage(id);
    setImages((cur) => cur.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((im) => (
          <div key={im.id} className="relative">
            <div className="relative h-24 w-24 overflow-hidden rounded-md bg-surface-alt">
              <Image src={im.imageUrl} alt="" fill sizes="96px" className="object-cover" />
            </div>
            <button type="button" onClick={() => onDelete(im.id)}
              className="mt-1 w-full text-xs text-terracotta hover:underline">Smazat</button>
          </div>
        ))}
      </div>
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onAdd} disabled={busy} className="mt-3 text-sm" />
      {busy ? <p className="mt-1 text-sm text-text-muted">Nahrávám…</p> : null}
    </div>
  );
}
```

- [ ] **Step 4: Verify compile + commit**

Run: `cd web && npx tsc --noEmit` → Expected: no errors.
```bash
git add web/components/admin/ImageUpload.tsx web/components/admin/ProductForm.tsx web/components/admin/GalleryManager.tsx
git commit -m "feat(web): admin image upload + product form + gallery manager"
```

### Task 7.3: Product admin pages (list, new, edit)

**Files:**
- Create: `web/app/admin/(panel)/products/page.tsx`
- Create: `web/app/admin/(panel)/products/new/page.tsx`
- Create: `web/app/admin/(panel)/products/[id]/page.tsx`

- [ ] **Step 1: Write `web/app/admin/(panel)/products/page.tsx`**

```tsx
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { formatCzk } from "@/lib/money";
import { deleteProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const rows = await db.select().from(schema.products).orderBy(desc(schema.products.createdAt));
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-moss-deep">Produkty</h1>
        <Link href="/admin/products/new" className="rounded-pill bg-moss px-5 py-2.5 text-sm font-medium text-cream hover:bg-moss-deep">+ Přidat produkt</Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-text-muted">
            <th className="p-3">Název</th><th className="p-3">Cena</th><th className="p-3">Sklad</th><th className="p-3">Stav</th><th className="p-3"></th>
          </tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-border/60">
                <td className="p-3"><Link href={`/admin/products/${p.id}`} className="font-medium text-moss hover:underline">{p.name}</Link></td>
                <td className="p-3">{formatCzk(p.price)}</td>
                <td className="p-3">{p.stockQuantity}</td>
                <td className="p-3">{p.isActive ? "aktivní" : "skrytý"}</td>
                <td className="p-3 text-right">
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-xs text-terracotta hover:underline">Smazat</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `web/app/admin/(panel)/products/new/page.tsx`**

```tsx
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProduct() {
  const categories = await db.select({ id: schema.categories.id, name: schema.categories.name })
    .from(schema.categories).orderBy(asc(schema.categories.displayOrder));
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-moss-deep">Přidat produkt</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
```

- [ ] **Step 3: Write `web/app/admin/(panel)/products/[id]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { getProductImages } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(schema.products).where(eq(schema.products.id, Number(id)));
  const product = rows[0];
  if (!product) notFound();

  const [categories, images] = await Promise.all([
    db.select({ id: schema.categories.id, name: schema.categories.name }).from(schema.categories).orderBy(asc(schema.categories.displayOrder)),
    getProductImages(product.id),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-moss-deep">Upravit produkt</h1>
      <ProductForm product={product} categories={categories} />
      <div className="mt-10 max-w-2xl">
        <h2 className="mb-3 font-serif text-lg font-semibold text-moss-deep">Další fotografie</h2>
        <GalleryManager productId={product.id} initial={images.map((i) => ({ id: i.id, imageUrl: i.imageUrl }))} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify**

`npm run dev`, logged in: `/admin/products` lists products; "Přidat produkt" → fill, upload an image, save → appears in `/obchod`; edit a product, add a gallery photo → shows on the product detail page; delete works.

- [ ] **Step 5: Commit**

```bash
git add "web/app/admin/(panel)/products"
git commit -m "feat(web): admin product list/new/edit pages"
```

### Task 7.4: Category + order admin pages

**Files:**
- Create: `web/app/admin/(panel)/categories/page.tsx`
- Create: `web/app/admin/(panel)/orders/page.tsx`
- Create: `web/app/admin/(panel)/orders/[id]/page.tsx`

- [ ] **Step 1: Write `web/app/admin/(panel)/categories/page.tsx`**

```tsx
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { saveCategory, deleteCategory } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
const field = "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-moss focus:outline-none";

export default async function AdminCategories() {
  const cats = await db.select().from(schema.categories).orderBy(asc(schema.categories.displayOrder));
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-serif text-2xl font-semibold text-moss-deep">Kategorie</h1>

      <form action={saveCategory.bind(null, {})} className="mb-8 grid gap-3 rounded-lg border border-border bg-surface p-5 sm:grid-cols-[1fr_1fr_80px_auto] sm:items-end">
        <label className="block"><span className="text-xs font-medium">Název</span><input name="name" required className={field} /></label>
        <label className="block"><span className="text-xs font-medium">Slug</span><input name="slug" required pattern="[a-z0-9-]+" className={field} /></label>
        <label className="block"><span className="text-xs font-medium">Pořadí</span><input name="display_order" type="number" min={0} defaultValue={cats.length + 1} className={field} /></label>
        <button type="submit" className="rounded-pill bg-moss px-5 py-2 text-sm font-medium text-cream hover:bg-moss-deep">Přidat</button>
      </form>

      <div className="space-y-3">
        {cats.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-surface p-4">
            <form action={saveCategory.bind(null, {})} className="grid gap-3 sm:grid-cols-[1fr_1fr_80px_auto] sm:items-end">
              <input type="hidden" name="id" value={c.id} />
              <label className="block"><span className="text-xs font-medium">Název</span><input name="name" required defaultValue={c.name} className={field} /></label>
              <label className="block"><span className="text-xs font-medium">Slug</span><input name="slug" required pattern="[a-z0-9-]+" defaultValue={c.slug} className={field} /></label>
              <label className="block"><span className="text-xs font-medium">Pořadí</span><input name="display_order" type="number" min={0} defaultValue={c.displayOrder} className={field} /></label>
              <button type="submit" className="rounded-pill border border-border px-4 py-2 text-sm font-medium text-moss-deep hover:bg-surface-alt">Uložit</button>
            </form>
            <form action={deleteCategory} className="mt-2">
              <input type="hidden" name="id" value={c.id} />
              <button type="submit" className="text-xs text-terracotta hover:underline">Smazat kategorii</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `web/app/admin/(panel)/orders/page.tsx`**

```tsx
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { formatCzk } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const rows = await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-moss-deep">Objednávky</h1>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-text-muted">
            <th className="p-3">Číslo</th><th className="p-3">Zákazník</th><th className="p-3">VS</th><th className="p-3">Stav</th><th className="p-3">Platba</th><th className="p-3">Částka</th>
          </tr></thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-b border-border/60">
                <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-medium text-moss hover:underline">{o.orderNumber}</Link></td>
                <td className="p-3">{o.customerName}<br /><span className="text-text-muted">{o.customerEmail}</span></td>
                <td className="p-3">{o.variableSymbol}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{o.paymentStatus}</td>
                <td className="p-3">{formatCzk(o.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write `web/app/admin/(panel)/orders/[id]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { formatCzk } from "@/lib/money";
import { updateOrderStatus } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "completed", "cancelled"];
const PAYMENT_STATUSES = ["pending", "completed", "failed", "refunded"];
const sel = "rounded-md border border-border bg-surface px-3 py-2 text-sm";

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(schema.orders).where(eq(schema.orders.id, Number(id)));
  const order = rows[0];
  if (!order) notFound();
  const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, order.id));

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 font-serif text-2xl font-semibold text-moss-deep">{order.orderNumber}</h1>
      <p className="mb-6 text-sm text-text-muted">{new Date(order.createdAt).toLocaleString("cs-CZ")}</p>

      <div className="rounded-lg border border-border bg-surface p-5 text-sm">
        <p><strong>{order.customerName}</strong> &lt;{order.customerEmail}&gt;</p>
        {order.customerPhone ? <p>Telefon: {order.customerPhone}</p> : null}
        <p>Adresa: {order.shippingAddress}</p>
        <p>VS: {order.variableSymbol}</p>
        {order.notes ? <p className="mt-2 whitespace-pre-line">Poznámka: {order.notes}</p> : null}
      </div>

      <ul className="mt-4 rounded-lg border border-border bg-surface p-5 text-sm">
        {items.map((it) => (
          <li key={it.id} className="flex justify-between py-1"><span>{it.productName} ×{it.quantity}</span><span>{formatCzk(it.totalPrice)}</span></li>
        ))}
        <li className="mt-2 flex justify-between border-t border-border pt-2 text-base font-semibold"><span>Celkem</span><span>{formatCzk(order.totalAmount)}</span></li>
      </ul>

      <form action={updateOrderStatus} className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-5">
        <input type="hidden" name="id" value={order.id} />
        <label className="block"><span className="text-xs font-medium">Stav objednávky</span><br />
          <select name="status" defaultValue={order.status} className={sel}>{ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
        <label className="block"><span className="text-xs font-medium">Stav platby</span><br />
          <select name="payment_status" defaultValue={order.paymentStatus} className={sel}>{PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
        <button type="submit" className="rounded-pill bg-moss px-5 py-2 text-sm font-medium text-cream hover:bg-moss-deep">Uložit stav</button>
      </form>
    </div>
  );
}
```

- [ ] **Step 4: Verify**

`/admin/categories`: add, edit, delete a category (out-of-use slugs only). `/admin/orders`: list shows the test order from Phase 5; open it, change status to `paid` and payment to `completed` → persists on reload.

- [ ] **Step 5: Commit**

```bash
git add "web/app/admin/(panel)/categories" "web/app/admin/(panel)/orders"
git commit -m "feat(web): admin category + order management pages"
```

---

## Phase 8 — E2E tests, verification, deploy, cutover

### Task 8.1: End-to-end tests (Playwright)

**Files:**
- Create: `web/tests/e2e/shop.spec.ts`
- Create: `web/tests/e2e/admin.spec.ts`

> Prereqs: the Neon dev DB is migrated (Phase 3) with ≥1 active, in-stock product, and the
> admin account exists. Admin creds come from env `E2E_ADMIN_USER` / `E2E_ADMIN_PASS`.

- [ ] **Step 1: Write `web/tests/e2e/shop.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test("browse → add to cart → checkout → confirmation", async ({ page }) => {
  await page.goto("/obchod");
  await expect(page.getByRole("heading", { name: "Luční obchůdek" })).toBeVisible();

  // open the first product
  const firstProduct = page.locator("article a").first();
  await firstProduct.click();
  await expect(page.getByRole("button", { name: /Do košíku|Vyprodáno/ })).toBeVisible();

  const addBtn = page.getByRole("button", { name: "Do košíku" });
  if (!(await addBtn.isVisible())) test.skip(true, "first product sold out");
  await addBtn.click();

  await page.goto("/obchod/kosik");
  await page.getByRole("link", { name: "K pokladně" }).click();

  await page.getByLabel("Jméno a příjmení *").fill("E2E Test");
  await page.getByLabel("E-mail *").fill("e2e@example.cz");
  await page.getByLabel("Ulice a č.p. *").fill("Testovací 1");
  await page.getByLabel("Město *").fill("Praha");
  await page.getByLabel("PSČ *").fill("11000");
  await page.getByRole("button", { name: "Odeslat objednávku" }).click();

  await expect(page).toHaveURL(/\/obchod\/objednavka\//);
  await expect(page.getByText("Variabilní symbol")).toBeVisible();
});
```

- [ ] **Step 2: Write `web/tests/e2e/admin.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

const user = process.env.E2E_ADMIN_USER;
const pass = process.env.E2E_ADMIN_PASS;

test.describe("admin", () => {
  test.skip(!user || !pass, "E2E_ADMIN_USER / E2E_ADMIN_PASS not set");

  test("guard redirects, login works, dashboard renders", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.getByLabel("Uživatel").fill(user!);
    await page.getByLabel("Heslo").fill(pass!);
    await page.getByRole("button", { name: "Přihlásit se" }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { name: "Přehled" })).toBeVisible();
  });
});
```

- [ ] **Step 3: Run the e2e suite**

```bash
cd web && E2E_ADMIN_USER=<user> E2E_ADMIN_PASS=<pass> npm run test:e2e
```
Expected: shop flow passes; admin test passes. (Order placed during the test can be deleted afterward in `/admin/orders` or `db:studio`.)

- [ ] **Step 4: Commit**

```bash
git add web/tests/e2e web/playwright.config.ts
git commit -m "test(web): e2e shop + admin flows"
```

### Task 8.2: Full local verification gate

- [ ] **Step 1: Run the whole unit + integration suite**

```bash
cd web && npm run test
```
Expected: all suites green (money, payment, validation, cart, queries, order).

- [ ] **Step 2: Production build**

```bash
cd web && npm run build
```
Expected: build succeeds with no type errors; shop + admin routes listed (dynamic).

- [ ] **Step 3: Manual smoke (dev server)**

`npm run dev` and confirm in a browser:
- `/obchod` shows migrated products with real Blob photos; category filter works.
- Product detail gallery + add to cart + cart count.
- Checkout → confirmation shows correct bank details (from env) + VS.
- Admin: create/edit/delete a product, upload main + gallery photo, manage categories, change an order's status.

### Task 8.3: Deploy to Netlify

- [ ] **Step 1: Confirm env vars in Netlify**

Netlify → Site config → Environment variables: `DATABASE_URL`, `SESSION_SECRET`, the email set
(`SMTP_*` or `RESEND_API_KEY`), and `BANK_*`, `ORDER_PREFIX`, `ADMIN_NOTIFICATION_EMAIL`.
(Netlify Blobs needs no token at runtime; `NETLIFY_*` tokens are local-only.)

- [ ] **Step 2: Deploy a preview (draft) build**

```bash
cd web && npx netlify deploy
```
Expected: a draft deploy URL. Migration already applied to the shared Neon DB. Smoke-test:
`/obchod`, `/admin` login. (To avoid sending real mail while testing, temporarily unset SMTP.)

- [ ] **Step 3: Promote to production**

```bash
cd web && npx netlify deploy --prod
```
Expected: production deploy on the Netlify site URL. Smoke-test once more.

- [ ] **Step 4: Confirm Next.js 16 built cleanly on Netlify**

Check the deploy log for the Next.js runtime/plugin and a successful build. If the runtime
doesn't support Next 16 yet, fall back to a host that runs `next start` (e.g. Render) — the app
code is unchanged; only the deploy target differs.

### Task 8.4: Cutover checklist (USER-ASSISTED — do not automate)

> Domain `nechmerust.org` stays **registered at Forpsi** (renewed). Forpsi keeps serving DNS while
> registration is active, so we change records in the **Forpsi DNS panel** — no registrar transfer.
> Forpsi mailboxes end **29 Jun**, so the MX move to Google Workspace must happen by then.

- [ ] **Step 1: Add the custom domain in Netlify**

Netlify → Domain management → add `nechmerust.org` (+ `www`). Netlify shows the A/CNAME targets.

- [ ] **Step 2: In the Forpsi DNS panel — web + mail records**

- Web: point A `@` / CNAME `www` at **Netlify's** targets.
- Mail: point **MX** at **Google Workspace** (per Workspace's MX setup) and add the Workspace
  **SPF/DKIM TXT** records. This is what keeps `info@nechmerust.org` receiving mail after the 29th.
- App order emails go out via Workspace/Resend (not Forpsi SMTP), so they're unaffected.

- [ ] **Step 3: Verify after propagation**

- `https://nechmerust.org/obchod` serves the Netlify shop.
- Send + receive a test mail at `info@nechmerust.org` (now on Workspace).
- Place a test order → confirmation + admin emails arrive (Workspace/Resend).

- [ ] **Step 4: Retire the old Forpsi shop**

Once confirmed, the old `www/` Forpsi site can be shut down. Make sure the Neon DB + Netlify Blobs
(now the system of record) are backed up. Keep the local `web/data/forpsi-export/` snapshot in git.

---

## Self-review (completed by plan author)

**Spec coverage:** image storage (Netlify Blobs) + serving route (3.0) ✓; DB schema (1.2) ✓; data layer (1.4) ✓; migration from local snapshot → Neon + Blobs (3.3) ✓; listing+filter (4.4) ✓; product detail+gallery (4.5) ✓; cart (5.1/5.2) ✓; checkout+order action with DB-priced, transactional, stock-checked, rate-limited placement (5.3/5.4) ✓; confirmation (5.5) ✓; emails (3.1) ✓; admin auth single account (6.x) ✓; product/category/order CRUD + Netlify Blobs upload (7.x) ✓; security invariants (prices server-side, validation, server-only secrets, session-checked actions) ✓; env vars (0.1) ✓; Netlify deploy (8.3) + cutover web→Netlify / MX→Workspace (8.4) ✓; historical orders not migrated ✓; tests (unit/integration/e2e) ✓.

**Type consistency:** `CartItem {id,quantity}` used uniformly (cart.ts, CartProvider, useCartProducts, CheckoutForm). `placeOrder`/`PlaceOrderResult` consumed by `createOrder`. `FormState`/`LoginState` shared between actions and forms. Drizzle `numeric` → string handled via `Number()`/`String()` everywhere. `getProductsByIds` used by cart-data route. Product images are same-origin (`/img/[...key]`, Task 3.0), so `next/image` needs no remote-host config. `saveImage` (lib/storage) used by both the admin upload action and the migration.

**Known accepted trade-offs (not gaps):** admin pages render inside the public site shell (route-group guard, no separate admin root layout); e2e places a real order row (cleaned up manually); rate limit counts recent orders by IP (no extra store).

**Future sub-projects (separate specs):** event registration migration; newsletter signup migration; optional dedicated admin root layout; optional sitemap entries for product pages.
