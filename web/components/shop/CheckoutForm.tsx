"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { useCartProducts } from "./useCartProducts";
import { formatCzk } from "@/lib/money";
import { createOrder } from "@/app/obchod/actions";
import { useLocale } from "@/components/LocaleProvider";
import { pick } from "@/lib/i18n";

const field = "w-full rounded-md border border-border bg-surface px-3 py-2.5 text-text focus:border-moss focus:outline-none";

export function CheckoutForm() {
  const router = useRouter();
  const { items, clear, ready } = useCart();
  const { lines, loading } = useCartProducts();
  const { locale } = useLocale();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!ready || loading) return <p className="text-text-muted">{pick(locale, { cs: "Načítám…", en: "Loading…" })}</p>;
  if (lines.length === 0) {
    return (
      <div className="text-center">
        <p className="text-text-muted">{pick(locale, { cs: "Košík je prázdný.", en: "Your cart is empty." })}</p>
        <Link href="/obchod" className="mt-6 inline-flex rounded-pill bg-moss px-6 py-3 font-medium text-cream hover:bg-moss-deep">{pick(locale, { cs: "Do obchodu", en: "To the shop" })}</Link>
      </div>
    );
  }

  const total = lines.reduce((s, l) => s + Number(l.price) * l.quantity, 0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      customer_name: String(fd.get("customer_name") ?? ""),
      customer_email: String(fd.get("customer_email") ?? ""),
      customer_phone: String(fd.get("customer_phone") ?? ""),
      street: String(fd.get("street") ?? ""),
      city: String(fd.get("city") ?? ""),
      postal_code: String(fd.get("postal_code") ?? ""),
      notes: String(fd.get("notes") ?? ""),
      items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
    };
    const res = await createOrder(payload);
    if (res.ok) {
      clear();
      router.push(`/obchod/objednavka/${res.orderNumber}`);
    } else {
      setError(res.error);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <fieldset className="rounded-lg border border-border bg-surface p-6">
          <legend className="px-2 font-serif text-lg font-semibold text-moss-deep">{pick(locale, { cs: "Kontaktní údaje", en: "Contact details" })}</legend>
          <div className="grid gap-4">
            <label className="block"><span className="text-sm font-medium">{pick(locale, { cs: "Jméno a příjmení *", en: "Full name *" })}</span>
              <input name="customer_name" required maxLength={100} className={field} /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block"><span className="text-sm font-medium">{pick(locale, { cs: "E-mail *", en: "Email *" })}</span>
                <input name="customer_email" type="email" required maxLength={190} className={field} /></label>
              <label className="block"><span className="text-sm font-medium">{pick(locale, { cs: "Telefon", en: "Phone" })}</span>
                <input name="customer_phone" maxLength={30} className={field} /></label>
            </div>
          </div>
        </fieldset>
        <fieldset className="rounded-lg border border-border bg-surface p-6">
          <legend className="px-2 font-serif text-lg font-semibold text-moss-deep">{pick(locale, { cs: "Doručovací adresa", en: "Shipping address" })}</legend>
          <div className="grid gap-4">
            <label className="block"><span className="text-sm font-medium">{pick(locale, { cs: "Ulice a č.p. *", en: "Street and number *" })}</span>
              <input name="street" required maxLength={200} className={field} /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block"><span className="text-sm font-medium">{pick(locale, { cs: "Město *", en: "City *" })}</span>
                <input name="city" required maxLength={100} className={field} /></label>
              <label className="block"><span className="text-sm font-medium">{pick(locale, { cs: "PSČ *", en: "Postal code *" })}</span>
                <input name="postal_code" required maxLength={20} className={field} /></label>
            </div>
            <label className="block"><span className="text-sm font-medium">{pick(locale, { cs: "Poznámka", en: "Note" })}</span>
              <textarea name="notes" rows={3} maxLength={1000} className={field} /></label>
          </div>
        </fieldset>
        <p className="text-sm text-text-muted">{pick(locale, { cs: <>Platba probíhá <strong>bankovním převodem</strong> — po odeslání objednávky obdržíte e-mailem platební údaje (číslo účtu a variabilní symbol).</>, en: <>Payment is by <strong>bank transfer</strong> — once you place your order you will receive the payment details (account number and variable symbol) by email.</> })}</p>
        {error ? <p className="rounded-md bg-terracotta/10 px-4 py-3 text-sm text-terracotta">{error}</p> : null}
      </div>

      <aside className="h-fit rounded-lg border border-border bg-surface-alt p-6">
        <h2 className="font-serif text-xl font-semibold text-moss-deep">{pick(locale, { cs: "Shrnutí", en: "Summary" })}</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {lines.map((l) => (
            <li key={l.id} className="flex justify-between"><span>{l.name} ×{l.quantity}</span><span>{formatCzk(Number(l.price) * l.quantity)}</span></li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between text-sm text-text-muted"><span>{pick(locale, { cs: "Doprava", en: "Shipping" })}</span><span>{pick(locale, { cs: "Dle dohody", en: "By arrangement" })}</span></div>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg"><span>{pick(locale, { cs: "Celkem", en: "Total" })}</span><strong className="text-moss">{formatCzk(total)}</strong></div>
        <button type="submit" disabled={submitting} className="mt-6 inline-flex w-full items-center justify-center rounded-pill bg-moss px-6 py-3 font-medium text-cream hover:bg-moss-deep disabled:opacity-60">
          {submitting ? pick(locale, { cs: "Odesílám…", en: "Submitting…" }) : pick(locale, { cs: "Odeslat objednávku", en: "Place order" })}
        </button>
      </aside>
    </form>
  );
}
