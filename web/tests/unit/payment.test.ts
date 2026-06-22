import { describe, it, expect } from "vitest";
import { generateOrderNumber, generateVariableSymbol } from "../../lib/payment";

describe("payment", () => {
  it("generateOrderNumber uses prefix, date (YYYYMMDD), and an uppercase hex suffix", () => {
    const n = generateOrderNumber("NMR", { date: new Date("2026-06-22T10:00:00Z"), rand: "abcdef" });
    expect(n).toBe("NMR-20260622-ABCDEF");
  });
  it("generateVariableSymbol takes the first 10 digits of the order number", () => {
    // digits of "NMR-20260622-AB12" => "20260622" + "12" = "2026062212"
    expect(generateVariableSymbol("NMR-20260622-AB12")).toBe("2026062212");
  });
  it("generateVariableSymbol falls back to a 10-digit number when no digits present", () => {
    expect(generateVariableSymbol("ABC-DEF")).toMatch(/^\d{10}$/);
  });
});
