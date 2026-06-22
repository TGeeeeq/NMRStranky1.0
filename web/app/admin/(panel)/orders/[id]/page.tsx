import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { formatCzk } from "@/lib/money";
import { updateOrderStatus } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "completed", "cancelled"];
const PAYMENT_STATUSES = ["pending", "completed", "failed", "refunded"];
const sel = "rounded-md border border-border bg-surface px-3 py-2 text-sm";

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(schema.orders).where(eq(schema.orders.id, Number(id)));
  const order = rows[0];
  if (!order) notFound();
  const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, order.id));

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 font-serif text-2xl font-semibold text-moss-deep">{order.orderNumber}</h1>
      <p className="mb-6 text-sm text-text-muted">{new Date(order.createdAt).toLocaleString("cs-CZ")}</p>

      <div className="rounded-lg border border-border bg-surface p-5 text-sm">
        <p><strong>{order.customerName}</strong> &lt;{order.customerEmail}&gt;</p>
        {order.customerPhone ? <p>Telefon: {order.customerPhone}</p> : null}
        <p>Adresa: {order.shippingAddress}</p>
        <p>VS: {order.variableSymbol}</p>
        {order.notes ? <p className="mt-2 whitespace-pre-line">Poznámka: {order.notes}</p> : null}
      </div>

      <ul className="mt-4 rounded-lg border border-border bg-surface p-5 text-sm">
        {items.map((it) => (
          <li key={it.id} className="flex justify-between py-1"><span>{it.productName} ×{it.quantity}</span><span>{formatCzk(it.totalPrice)}</span></li>
        ))}
        <li className="mt-2 flex justify-between border-t border-border pt-2 text-base font-semibold"><span>Celkem</span><span>{formatCzk(order.totalAmount)}</span></li>
      </ul>

      <form action={updateOrderStatus} className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-5">
        <input type="hidden" name="id" value={order.id} />
        <label className="block"><span className="text-xs font-medium">Stav objednávky</span><br />
          <select name="status" defaultValue={order.status} className={sel}>{ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
        <label className="block"><span className="text-xs font-medium">Stav platby</span><br />
          <select name="payment_status" defaultValue={order.paymentStatus} className={sel}>{PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
        <button type="submit" className="rounded-pill bg-moss px-5 py-2 text-sm font-medium text-cream hover:bg-moss-deep">Uložit stav</button>
      </form>
    </div>
  );
}
