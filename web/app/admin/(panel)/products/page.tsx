import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { formatCzk } from "@/lib/money";
import { deleteProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const rows = await db.select().from(schema.products).orderBy(desc(schema.products.createdAt));
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-moss-deep">Produkty</h1>
        <Link href="/admin/products/new" className="rounded-pill bg-moss px-5 py-2.5 text-sm font-medium text-cream hover:bg-moss-deep">+ Přidat produkt</Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-text-muted">
            <th className="p-3">Název</th><th className="p-3">Cena</th><th className="p-3">Sklad</th><th className="p-3">Stav</th><th className="p-3"></th>
          </tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-border/60">
                <td className="p-3"><Link href={`/admin/products/${p.id}`} className="font-medium text-moss hover:underline">{p.name}</Link></td>
                <td className="p-3">{formatCzk(p.price)}</td>
                <td className="p-3">{p.stockQuantity}</td>
                <td className="p-3">{p.isActive ? "aktivní" : "skrytý"}</td>
                <td className="p-3 text-right">
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-xs text-terracotta hover:underline">Smazat</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
