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
