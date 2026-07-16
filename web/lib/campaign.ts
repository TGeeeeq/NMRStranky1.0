import { BANK } from "./site";

/** Aktuální sbírka „Seno pro Louku" — ručně aktualizované hodnoty.
 *  Po každém větším přírůstku na transparentním účtu uprav `raised`
 *  a `updatedAt` a pushni na main. */
export const SENO_CAMPAIGN = {
  title: "Seno pro Louku",
  goal: 100_000,
  raised: 0,
  updatedAt: "16. 7. 2026",
  currency: "CZK",
  /** Variabilní symbol kampaně — dary se seny poznají na transparentním účtu. */
  variableSymbol: "20260716",
  message: "SENO PRO LOUKU",
  /** Letošní cena jednoho balíku sena (Kč) — potvrzeno, minimálně 800 Kč. */
  balePrice: 800,
} as const;

/** Procento splnění cíle, oříznuté na 0–100. */
export function campaignProgress(raised: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((raised / goal) * 100)));
}

/** Jméno příjemce bez diakritiky — SPAYD doporučuje ASCII kvůli
 *  kompatibilitě starších bankovních aplikací. */
const RECIPIENT_NAME_ASCII = "NECH ME RUST Z.S.";

/** SPAYD (Short Payment Descriptor) řetězec pro QR platbu na transparentní
 *  účet. Používá ho jen scripts/generate-seno-qr.mts — po změně VS, zprávy
 *  nebo účtu přegeneruj PNG přes `npm run campaign:qr`. */
export function buildSpaydString(): string {
  const iban = BANK.iban.replace(/\s/g, "");
  return [
    "SPD*1.0",
    `ACC:${iban}+${BANK.swift}`,
    `RN:${RECIPIENT_NAME_ASCII}`,
    `X-VS:${SENO_CAMPAIGN.variableSymbol}`,
    `MSG:${SENO_CAMPAIGN.message}`,
    `CC:${SENO_CAMPAIGN.currency}`,
  ].join("*");
}
