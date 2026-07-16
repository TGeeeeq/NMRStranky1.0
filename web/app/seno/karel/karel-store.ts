/** Čisté pomocné funkce Karlova převzetí /seno — persistence volby
 *  a výběr hlášek. Storage/random jsou injektovatelné kvůli testům. */

export type KarelChoice = "accepted" | "declined";

export type KarelSenoStore = {
  /** Jak návštěvník odpověděl na Karlovu nabídku překopat stránku. */
  choice?: KarelChoice;
};

const KEY = "nmr_karel_seno";

type StorageLike = Pick<Storage, "getItem" | "setItem">;

export function loadKarelStore(storage?: StorageLike): KarelSenoStore {
  try {
    const s = storage ?? window.localStorage;
    const raw = s.getItem(KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const choice = (parsed as { choice?: unknown }).choice;
    return choice === "accepted" || choice === "declined" ? { choice } : {};
  } catch {
    return {};
  }
}

export function saveKarelStore(patch: Partial<KarelSenoStore>, storage?: StorageLike): void {
  try {
    const s = storage ?? window.localStorage;
    s.setItem(KEY, JSON.stringify({ ...loadKarelStore(s), ...patch }));
  } catch {
    // private mode apod. — Karel se prostě zeptá příště znovu
  }
}

/** Náhodná hláška z poolu, která se neopakuje hned po `last`. */
export function pickQuote(pool: string[], last: string | null, rand: () => number = Math.random): string {
  if (pool.length === 0) return "";
  if (pool.length === 1) return pool[0];
  let quote = pool[Math.floor(rand() * pool.length)];
  while (quote === last) {
    quote = pool[Math.floor(rand() * pool.length)];
  }
  return quote;
}
