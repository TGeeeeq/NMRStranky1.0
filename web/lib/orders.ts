import "server-only";
import { and, eq, gte, sql } from "drizzle-orm";
import { db, schema } from "./db";
import { checkoutSchema } from "./validation";
import { generateOrderNumber, generateVariableSymbol } from "./payment";
import { lineTotal } from "./money";
import { env } from "./env";

class OrderError extends Error {}

export type PlacedOrder = {
  orderNumber: string; variableSymbol: string; total: number;
  customerName: string; customerEmail: string; customerPhone: string;
  shippingAddress: string; notes: string;
  items: { name: string; quantity: number; lineTotal: number }[];
};

export type PlaceOrderResult =
  | { ok: true; order: PlacedOrder }
  | { ok: false; error: string };

export async function placeOrder(rawInput: unknown, ip: string): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(rawInput);
  if (!parsed.success) return { ok: false, error: "Neplatná data objednávky." };
  const input = parsed.data;

  const shippingAddress = `${input.street}, ${input.postal_code} ${input.city}`;
  const orderNumber = generateOrderNumber(env.orderPrefix());
  const variableSymbol = generateVariableSymbol(orderNumber);

  try {
    const result = await db.transaction(async (tx) => {
      let total = 0;
      const resolved: { productId: number; name: string; quantity: number; unitPrice: string; lineTotal: number }[] = [];

      // Sečti množství podle produktu — klient může poslat stejné product_id vícekrát
      // a bez agregace by kontrola skladu prošla dvakrát proti stejné skladové hodnotě.
      const wanted = new Map<number, number>();
      for (const it of input.items) {
        wanted.set(it.product_id, (wanted.get(it.product_id) ?? 0) + it.quantity);
      }

      for (const [productId, quantity] of wanted) {
        const rows = await tx
          .select().from(schema.products)
          .where(and(eq(schema.products.id, productId), eq(schema.products.isActive, true)))
          .for("update");
        const product = rows[0];
        if (!product) throw new OrderError("Některý produkt už není dostupný.");
        if (quantity > product.stockQuantity) {
          throw new OrderError(`Produkt „${product.name}" není skladem v požadovaném množství.`);
        }
        const lt = lineTotal(product.price, quantity);
        total += lt;
        resolved.push({ productId: product.id, name: product.name, quantity, unitPrice: product.price, lineTotal: lt });
      }
      if (resolved.length === 0 || total <= 0) throw new OrderError("Košík je prázdný.");

      const ins = await tx.insert(schema.orders).values({
        orderNumber, variableSymbol,
        customerName: input.customer_name, customerEmail: input.customer_email,
        customerPhone: input.customer_phone, shippingAddress,
        totalAmount: String(total), notes: input.notes, customerIp: ip,
      }).returning({ id: schema.orders.id });
      const orderId = ins[0].id;

      for (const r of resolved) {
        await tx.insert(schema.orderItems).values({
          orderId, productId: r.productId, productName: r.name,
          quantity: r.quantity, unitPrice: String(r.unitPrice), totalPrice: String(r.lineTotal),
        });
        // Atomický odečet s pojistkou proti přeprodeji: sníží sklad jen když je dost kusů.
        const dec = await tx.update(schema.products)
          .set({ stockQuantity: sql`${schema.products.stockQuantity} - ${r.quantity}` })
          .where(and(eq(schema.products.id, r.productId), gte(schema.products.stockQuantity, r.quantity)))
          .returning({ id: schema.products.id });
        if (dec.length === 0) throw new OrderError(`Produkt „${r.name}" není skladem v požadovaném množství.`);
      }
      return { total, items: resolved.map((r) => ({ name: r.name, quantity: r.quantity, lineTotal: r.lineTotal })) };
    });

    return {
      ok: true,
      order: {
        orderNumber, variableSymbol, total: result.total,
        customerName: input.customer_name, customerEmail: input.customer_email,
        customerPhone: input.customer_phone, shippingAddress, notes: input.notes, items: result.items,
      },
    };
  } catch (e) {
    if (e instanceof OrderError) return { ok: false, error: e.message };
    console.error("[placeOrder]", e);
    return { ok: false, error: "Chyba při zpracování objednávky. Zkuste to prosím znovu." };
  }
}
