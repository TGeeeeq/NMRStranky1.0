import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/Container";
import { formatCzk } from "@/lib/money";
import { getOrderByNumber } from "@/lib/db/queries";
import { env } from "@/lib/env";

export const metadata: Metadata = { title: "Objednávka přijata", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();
  const bank = env.bank();

  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container className="max-w-2xl">
        <div className="rounded-lg border border-border bg-surface-alt p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-pill bg-moss/10 text-moss">
            <CheckCircle2 size={30} aria-hidden />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-moss-deep sm:text-3xl">Děkujeme za objednávku!</h1>
          <p className="mt-2 text-text-muted">Číslo objednávky <strong>{order.orderNumber}</strong>. Potvrzení jsme poslali na {order.customerEmail}.</p>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-surface p-6">
          <h2 className="font-serif text-lg font-semibold text-moss-deep">Platební údaje (bankovní převod)</h2>
          <dl className="mt-3 space-y-1.5 text-sm">
            {bank.name ? <div className="flex justify-between"><dt className="text-text-muted">Banka</dt><dd>{bank.name}</dd></div> : null}
            {bank.account ? <div className="flex justify-between"><dt className="text-text-muted">Číslo účtu</dt><dd className="font-medium">{bank.account}</dd></div> : null}
            {bank.iban ? <div className="flex justify-between"><dt className="text-text-muted">IBAN</dt><dd>{bank.iban}</dd></div> : null}
            <div className="flex justify-between"><dt className="text-text-muted">Variabilní symbol</dt><dd className="font-medium">{order.variableSymbol}</dd></div>
            <div className="flex justify-between border-t border-border pt-2 text-base"><dt>Částka</dt><dd className="font-semibold text-moss">{formatCzk(order.totalAmount)}</dd></div>
          </dl>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-surface p-6">
          <h2 className="font-serif text-lg font-semibold text-moss-deep">Položky</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {order.items.map((it) => (
              <li key={it.id} className="flex justify-between"><span>{it.productName} ×{it.quantity}</span><span>{formatCzk(it.totalPrice)}</span></li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
