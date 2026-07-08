import { sealData, unsealData } from "iron-session";
import { randomBytes } from "crypto";

// Přístup ke hře Louka Run: podepsaná cookie vydaná po uplatnění pozvánkového kódu.
// Bez next/headers a "server-only", aby unseal fungoval i v middleware (edge runtime).

export const GAME_COOKIE = "nmr_game";
export const GAME_COOKIE_TTL = 60 * 60 * 24 * 365; // 1 rok

export interface GameAccessData {
  inviteId: number;
}

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("Missing required env var: SESSION_SECRET");
  return s;
}

export async function sealGameAccess(data: GameAccessData): Promise<string> {
  return sealData(data, { password: secret(), ttl: GAME_COOKIE_TTL });
}

export async function unsealGameAccess(seal: string): Promise<GameAccessData | null> {
  try {
    const data = await unsealData<GameAccessData>(seal, { password: secret(), ttl: GAME_COOKIE_TTL });
    return typeof data?.inviteId === "number" ? data : null;
  } catch {
    return null;
  }
}

// Bez záměnných znaků (0/O, 1/I/L), ať se kód dobře diktuje po telefonu.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateInviteCode(): string {
  const bytes = randomBytes(8);
  const chars = Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]);
  return `LOUKA-${chars.slice(0, 4).join("")}-${chars.slice(4).join("")}`;
}

export function normalizeInviteCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, "");
}
