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
