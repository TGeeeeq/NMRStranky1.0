"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "./CartProvider";
import { useCartProducts } from "./useCartProducts";
import { Price } from "./Price";
import { formatCzk } from "@/lib/money";
import { useLocale } from "@/components/LocaleProvider";
import { pick } from "@/lib/i18n";

export function CartContents() {
  const { updateQty, remove, ready } = useCart();
  const { lines, loading } = useCartProducts();
  const { locale } = useLocale();

  if (!ready || loading) return <p className="text-text-muted">{pick(locale, { cs: "Načítám košík…", en: "Loading cart…" })}</p>;
  if (lines.length === 0) {
    return (
      <div className="text-center">
        <p className="text-text-muted">{pick(locale, { cs: "Váš košík je prázdný.", en: "Your cart is empty." })}</p>
        <Link href="/obchod" className="mt-6 inline-flex rounded-pill bg-moss px-6 py-3 font-medium text-cream hover:bg-moss-deep">
          {pick(locale, { cs: "Zpět do obchodu", en: "Back to the shop" })}
        </Link>
      </div>
    );
  }

  const total = lines.reduce((s, l) => s + Number(l.price) * l.quantity, 0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <ul className="divide-y divide-border">
        {lines.map((l) => (
          <li key={l.id} className="flex gap-4 py-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-surface-alt">
              {l.imageUrl ? <Image src={l.imageUrl} alt={l.name} fill sizes="80px" className="object-cover" /> : null}
            </div>
            <div className="flex flex-1 flex-col">
              <Link href={`/obchod/${l.slug}`} className="font-serif text-lg font-semibold text-moss-deep hover:text-moss">{l.name}</Link>
              <Price value={l.price} className="text-sm text-text-muted" />
              <div className="mt-auto flex items-center gap-3">
                <div className="inline-flex items-center rounded-pill border border-border">
                  <button type="button" aria-label={pick(locale, { cs: "Méně", en: "Less" })} onClick={() => updateQty(l.id, l.quantity - 1)} className="px-2.5 py-1.5 text-moss-deep"><Minus size={14} /></button>
                  <span className="min-w-8 text-center text-sm">{l.quantity}</span>
                  <button type="button" aria-label={pick(locale, { cs: "Více", en: "More" })} onClick={() => updateQty(l.id, Math.min(l.stockQuantity, l.quantity + 1))} className="px-2.5 py-1.5 text-moss-deep"><Plus size={14} /></button>
                </div>
                <button type="button" onClick={() => remove(l.id)} className="inline-flex items-center gap-1 text-sm text-terracotta hover:underline">
                  <Trash2 size={14} /> {pick(locale, { cs: "Odebrat", en: "Remove" })}
                </button>
              </div>
            </div>
            <Price value={Number(l.price) * l.quantity} className="font-semibold text-moss-deep" />
          </li>
        ))}
      </ul>
      <aside className="h-fit rounded-lg border border-border bg-surface-alt p-6">
        <h2 className="font-serif text-xl font-semibold text-moss-deep">{pick(locale, { cs: "Shrnutí", en: "Summary" })}</h2>
        <div className="mt-4 flex justify-between text-sm"><span>{pick(locale, { cs: "Mezisoučet", en: "Subtotal" })}</span><strong>{formatCzk(total)}</strong></div>
        <div className="mt-1 flex justify-between text-sm text-text-muted"><span>{pick(locale, { cs: "Doprava", en: "Shipping" })}</span><span>{pick(locale, { cs: "Dle dohody", en: "By arrangement" })}</span></div>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg"><span>{pick(locale, { cs: "Celkem", en: "Total" })}</span><strong className="text-moss">{formatCzk(total)}</strong></div>
        <Link href="/obchod/pokladna" className="mt-6 inline-flex w-full items-center justify-center rounded-pill bg-moss px-6 py-3 font-medium text-cream hover:bg-moss-deep">
          {pick(locale, { cs: "K pokladně", en: "Checkout" })}
        </Link>
      </aside>
    </div>
  );
}
