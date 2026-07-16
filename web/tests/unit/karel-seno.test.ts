import { describe, it, expect } from "vitest";
import {
  BLOCK_ORDER,
  KAREL_COMMENTARY,
  KAREL_HERO,
  KAREL_IDLE,
  KAREL_REACTIONS,
  KAREL_STORY,
  KAREL_TIP_TEXTS,
  KAREL_WAY_TEXTS,
} from "../../app/seno/karel/karel-texts";
import { loadKarelStore, saveKarelStore, pickQuote } from "../../app/seno/karel/karel-store";
import { SENO_CAMPAIGN } from "../../lib/campaign";

describe("Karlova verze /seno — fakta sbírky zůstávají", () => {
  const story = KAREL_STORY.paragraphs.join(" ");

  it("drží cíl sbírky a počet balíků", () => {
    expect(story).toContain("100 000 Kč");
    expect(story).toContain("125 balíků");
    expect(SENO_CAMPAIGN.goal).toBe(100_000);
  });

  it("drží letošní cenu balíku", () => {
    expect(story).toContain("800");
    expect(SENO_CAMPAIGN.balePrice).toBe(800);
  });

  it("drží spotřebu stáda (krávy 15 kg, Karel 10 kg, zvířata jménem)", () => {
    expect(story).toContain("15 kilo");
    expect(story).toMatch(/Avala/);
    expect(story).toMatch(/Květa/);
    expect(story).toMatch(/Yakul/);
  });

  it("zmiňuje transparentní účet", () => {
    expect(story).toMatch(/transparentní účet/i);
  });

  it("tipy odpovídají násobkům ceny balíku", () => {
    expect(KAREL_TIP_TEXTS.map((t) => t.amount)).toEqual(["400 Kč", "800 Kč", "1 600 Kč"]);
  });

  it("karta Louka Run zachovává podmínku přístupu (200 Kč a víc)", () => {
    const hra = KAREL_WAY_TEXTS.find((w) => w.key === "hra");
    expect(hra?.text).toContain("200 Kč");
  });

  it("hero zůstává o senu", () => {
    expect(`${KAREL_HERO.title} ${KAREL_HERO.subtitle}`).toMatch(/[Ss]eno|stodola/);
  });

  it("každý komentář proměny patří existujícímu bloku", () => {
    for (const id of Object.keys(KAREL_COMMENTARY)) {
      expect(BLOCK_ORDER).toContain(id);
    }
  });

  it("reakce mají neprázdné pooly", () => {
    for (const pool of Object.values(KAREL_REACTIONS)) {
      expect(pool.length).toBeGreaterThan(0);
    }
  });
});

describe("pickQuote", () => {
  it("neopakuje poslední hlášku (u poolu > 1)", () => {
    const pool = ["a", "b"];
    // rand vrací vždy 0 → první pokus "a"; po zákazu "a" musí přejít na "b"
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

  it("idle pool je dost velký, aby se hlášky netočily", () => {
    expect(KAREL_IDLE.length).toBeGreaterThanOrEqual(5);
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
