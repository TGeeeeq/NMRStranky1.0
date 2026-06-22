// Run: npm run migrate:forpsi
// Needs in .env.local: DATABASE_URL, NETLIFY_SITE_ID, NETLIFY_AUTH_TOKEN.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema.ts";

const DIR = join(import.meta.dirname, "../data/forpsi-export");
const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL! }), { schema });

const readJson = (f: string) => JSON.parse(readFileSync(join(DIR, f), "utf-8"));

// Existing product images ship as committed static files in public/products/ (copied
// from data/forpsi-export/images/). Admin-uploaded NEW images use Netlify Blobs at runtime.
async function uploadLocal(imagePath: string): Promise<string | null> {
  if (!imagePath) return null;
  const filename = imagePath.split("/").pop()!;
  try {
    readFileSync(join(DIR, "images", filename));
  } catch {
    console.warn(`! missing image file ${filename}`);
    return null;
  }
  return `/products/${filename}`;
}

// 1) categories
const cats = readJson("categories.json").categories as Array<{ name: string; slug: string; description?: string; display_order?: number }>;
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
const prods = readJson("products.json").products as Array<Record<string, unknown>>;
const gallery = readJson("gallery.json") as Record<string, Array<{ image_url: string }>>;
for (const p of prods) {
  const imageUrl = await uploadLocal(p.image_url as string);
  const categoryId = p.category_slug ? catIdBySlug.get(p.category_slug as string) ?? null : null;
  const slug = p.slug as string;
  const existing = await db.select().from(schema.products).where(eq(schema.products.slug, slug));
  const values = {
    name: p.name as string, slug, description: (p.description as string) ?? "",
    price: String(p.price), stockQuantity: Number(p.stock_quantity ?? 0),
    categoryId, imageUrl, isActive: true,
  };
  let pid: number;
  if (existing[0]) {
    pid = existing[0].id;
    await db.update(schema.products).set(values).where(eq(schema.products.id, pid));
  } else {
    const ins = await db.insert(schema.products).values(values).returning({ id: schema.products.id });
    pid = ins[0].id;
  }
  console.log(`product: ${slug} -> #${pid}`);

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
