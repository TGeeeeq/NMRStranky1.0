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
      stock_quantity: 1, category_id: 3, image_url: "/img/123-x.webp", is_active: true,
    }).success).toBe(true);
  });
  it("rejects a bad slug", () => {
    expect(productSchema.safeParse({ name: "X", slug: "Bad Slug", price: 10 }).success).toBe(false);
  });
  it("rejects price <= 0", () => {
    expect(productSchema.safeParse({ name: "X", slug: "x", price: 0 }).success).toBe(false);
  });
});
