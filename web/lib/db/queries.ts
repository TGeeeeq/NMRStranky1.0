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
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
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
