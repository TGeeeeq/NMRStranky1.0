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
