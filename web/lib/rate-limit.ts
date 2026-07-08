import "server-only";

/**
 * Jednoduchý in-memory sliding-window limiter.
 *
 * Poznámka: na Netlify běží každá serverless instance ve vlastní paměti a instance
 * jsou krátkodobé, takže limit je „best effort" v rámci instance — chrání proti
 * rychlému brute-force z jednoho procesu, ne proti distribuovanému útoku. Pro tvrdší
 * záruku by bylo potřeba sdílené úložiště (DB / Redis). Pro admin login malého webu
 * je to přiměřená beznákladová obrana.
 */
type Bucket = number[];
const store = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowSeconds: number): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const hits = (store.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - hits[0])) / 1000);
    store.set(key, hits);
    return { allowed: false, retryAfter };
  }

  hits.push(now);
  store.set(key, hits);

  // Občasný úklid starých klíčů, ať mapa neroste donekonečna.
  if (store.size > 5000) {
    for (const [k, v] of store) {
      if (v.every((t) => now - t >= windowMs)) store.delete(k);
    }
  }

  return { allowed: true, retryAfter: 0 };
}
