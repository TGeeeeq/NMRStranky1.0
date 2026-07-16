import { describe, it, expect } from "vitest";
import { buildSpaydString, campaignProgress, SENO_CAMPAIGN } from "../../lib/campaign";

describe("campaign", () => {
  it("buildSpaydString returns the exact SPAYD payload the printed QR was generated from", () => {
    // Regresní pojistka: změna BANK v lib/site.ts nebo SENO_CAMPAIGN nesmí
    // tiše rozjet kód a už vytištěné/rozeslané QR kódy. Po záměrné změně
    // přegeneruj PNG přes `npm run campaign:qr` a aktualizuj tento string.
    expect(buildSpaydString()).toBe(
      "SPD*1.0*ACC:CZ9820100000002002645872+FIOBCZPP*RN:NECH ME RUST Z.S.*X-VS:20260716*MSG:SENO PRO LOUKU*CC:CZK",
    );
  });

  it("SPAYD payload contains no diacritics or asterisks inside values", () => {
    const values = buildSpaydString().split("*").slice(2);
    for (const v of values) {
      expect(v).toMatch(/^[A-Z-]+:[A-Z0-9 .+]*$/);
    }
  });

  it("campaignProgress computes a rounded percentage", () => {
    expect(campaignProgress(25_000, 100_000)).toBe(25);
    expect(campaignProgress(33_333, 100_000)).toBe(33);
  });

  it("campaignProgress clamps to 0–100 and handles a zero goal", () => {
    expect(campaignProgress(-500, 100_000)).toBe(0);
    expect(campaignProgress(150_000, 100_000)).toBe(100);
    expect(campaignProgress(1, 0)).toBe(0);
  });

  it("goal and bale price stay consistent with the public copy (~125 bales)", () => {
    expect(Math.floor(SENO_CAMPAIGN.goal / SENO_CAMPAIGN.balePrice)).toBe(125);
  });
});
