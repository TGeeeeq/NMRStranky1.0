import { describe, it, expect } from "vitest";
import { loadKarelStore, saveKarelStore, pickQuote } from "../../components/karel/karel-store";

describe("pickQuote", () => {
  it("neopakuje poslední hlášku (u poolu > 1)", () => {
    const pool = ["a", "b"];
    // rand vrací vždy 0 → první pokus „a"; po zákazu „a" musí přejít na „b"
    let calls = 0;
    const rand = () => (calls++ === 0 ? 0 : 0.9);
    expect(pickQuote(pool, "a", rand)).toBe("b");
  });

  it("u jednoprvkového poolu vrací jedinou hlášku i po sobě", () => {
    expect(pickQuote(["jen já"], "jen já")).toBe("jen já");
  });

  it("prázdný pool nepadá", () => {
    expect(pickQuote([], null)).toBe("");
  });
});

describe("karel-store persistence", () => {
  function memoryStorage(): Pick<Storage, "getItem" | "setItem"> & { data: Map<string, string> } {
    const data = new Map<string, string>();
    return {
      data,
      getItem: (k) => data.get(k) ?? null,
      setItem: (k, v) => void data.set(k, v),
    };
  }

  it("round-trip volby", () => {
    const storage = memoryStorage();
    expect(loadKarelStore(storage)).toEqual({});
    saveKarelStore({ choice: "accepted" }, storage);
    expect(loadKarelStore(storage)).toEqual({ choice: "accepted" });
    saveKarelStore({ choice: "declined" }, storage);
    expect(loadKarelStore(storage)).toEqual({ choice: "declined" });
  });

  it("poškozený JSON nebo neznámá hodnota → prázdný store", () => {
    const storage = memoryStorage();
    storage.data.set("nmr_karel_seno", "{{{");
    expect(loadKarelStore(storage)).toEqual({});
    storage.data.set("nmr_karel_seno", JSON.stringify({ choice: "hacknuto" }));
    expect(loadKarelStore(storage)).toEqual({});
  });
});
