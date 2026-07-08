import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { formatCzk } from "@/lib/money";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  await requireAdmin();
  const rows = await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-moss-deep">Objednávky</h1>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-text-muted">
            <th className="p-3">Číslo</th><th className="p-3">Zákazník</th><th className="p-3">VS</th><th className="p-3">Stav</th><th className="p-3">Platba</th><th className="p-3">Částka</th>
          </tr></thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-b border-border/60">
                <td className="p-3"><Link href={`/admin/orders/${o.id}`} className="font-medium text-moss hover:underline">{o.orderNumber}</Link></td>
                <td className="p-3">{o.customerName}<br /><span className="text-text-muted">{o.customerEmail}</span></td>
                <td className="p-3">{o.variableSymbol}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{o.paymentStatus}</td>
                <td className="p-3">{formatCzk(o.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
