import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { createGameInvites, revokeGameInvite } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
const field = "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-moss focus:outline-none";

export default async function AdminGameInvites() {
  await requireAdmin();
  const invites = await db.select().from(schema.gameInvites).orderBy(desc(schema.gameInvites.createdAt));

  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 font-serif text-2xl font-semibold text-moss-deep">Hra — pozvánkové kódy</h1>
      <p className="mb-6 text-sm text-text-muted">
        Kód pošli dárci po přijetí donate. Kód je víceužitelný (více zařízení jednoho dárce) a platí,
        dokud ho nezrušíš. Zrušení zastaví nová uplatnění; už přihlášená zařízení hrají dál (max. rok).
      </p>

      <form action={createGameInvites} className="mb-8 grid gap-3 rounded-lg border border-border bg-surface p-5 sm:grid-cols-[100px_1fr_auto] sm:items-end">
        <label className="block"><span className="text-xs font-medium">Počet</span><input name="count" type="number" min={1} max={50} defaultValue={1} className={field} /></label>
        <label className="block"><span className="text-xs font-medium">Poznámka (pro koho / jaký dar)</span><input name="note" maxLength={200} placeholder="např. Jana N. — 300 Kč, 8. 7. 2026" className={field} /></label>
        <button type="submit" className="rounded-pill bg-moss px-5 py-2 text-sm font-medium text-cream hover:bg-moss-deep">Vygenerovat</button>
      </form>

      <div className="space-y-2">
        {invites.length === 0 && <p className="text-sm text-text-muted">Zatím žádné kódy.</p>}
        {invites.map((inv) => (
          <div key={inv.id} className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border bg-surface p-4 ${inv.revokedAt ? "opacity-50" : ""}`}>
            <code className="font-mono text-sm font-semibold tracking-wide text-moss-deep">{inv.code}</code>
            <span className="text-xs text-text-muted">
              {inv.note ?? "bez poznámky"} · vytvořen {inv.createdAt.toLocaleDateString("cs-CZ")}
              {" · "}uplatněn {inv.redeemCount}×
              {inv.lastRedeemedAt && `, naposledy ${inv.lastRedeemedAt.toLocaleDateString("cs-CZ")}`}
            </span>
            {inv.revokedAt ? (
              <span className="ml-auto text-xs font-medium text-terracotta">zrušen {inv.revokedAt.toLocaleDateString("cs-CZ")}</span>
            ) : (
              <form action={revokeGameInvite} className="ml-auto">
                <input type="hidden" name="id" value={inv.id} />
                <button type="submit" className="text-xs text-terracotta hover:underline">Zrušit kód</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
