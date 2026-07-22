import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { getLocale } from "@/lib/i18n.server";
import { pick } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, { cs: "Pokladna", en: "Checkout" }), robots: { index: false } };
}

export default async function PokladnaPage() {
  const locale = await getLocale();
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container className="max-w-4xl">
        <h1 className="mb-8 font-serif text-3xl font-semibold text-moss-deep sm:text-4xl">{pick(locale, { cs: "Pokladna", en: "Checkout" })}</h1>
        <CheckoutForm />
      </Container>
    </section>
  );
}
