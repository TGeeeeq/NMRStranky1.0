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
