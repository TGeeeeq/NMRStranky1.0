import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { CheckoutForm } from "@/components/shop/CheckoutForm";

export const metadata: Metadata = { title: "Pokladna", robots: { index: false } };

export default function PokladnaPage() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container className="max-w-4xl">
        <h1 className="mb-8 font-serif text-3xl font-semibold text-moss-deep sm:text-4xl">Pokladna</h1>
        <CheckoutForm />
      </Container>
    </section>
  );
}
