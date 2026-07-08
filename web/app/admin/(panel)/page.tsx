import Link from "next/link";
import { sql, desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { formatCzk } from "@/lib/money";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  await requireAdmin();
  const [[products], [active], [orderCount], recent] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(schema.products),
    db.select({ n: sql<number>`count(*)::int` }).from(schema.products).where(eq(schema.products.isActive, true)),
    db.select({ n: sql<number>`count(*)::int` }).from(schema.orders),
    db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt)).limit(8),
  ]);

  const cards = [
    { label: "Produkty", value: products.n },
    { label: "Aktivní", value: active.n },
    { label: "Objednávky", value: orderCount.n },
  ];

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-moss-deep">Přehled</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-border bg-surface p-5">
            <p className="text-sm text-text-muted">{c.label}</p>
            <p className="mt-1 text-3xl font-semibold text-moss-deep">{c.value}</p>
          </div>
        ))}
      </div>
      <h2 className="mb-3 mt-8 font-serif text-lg font-semibold text-moss-deep">Poslední objednávky</h2>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-text-muted">
            <th className="p-3">Číslo</th><th className="p-3">Zákazník</th><th className="p-3">Stav</th><th className="p-3">Částka</th>
          </tr></thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id} className="border-b border-border/60">
                <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-medium text-moss hover:underline">{o.orderNumber}</Link></td>
                <td className="p-3">{o.customerName}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{formatCzk(o.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
