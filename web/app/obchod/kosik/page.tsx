import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { CartContents } from "@/components/shop/CartContents";

export const metadata: Metadata = { title: "Košík", robots: { index: false } };

export default function KosikPage() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container className="max-w-4xl">
        <h1 className="mb-8 font-serif text-3xl font-semibold text-moss-deep sm:text-4xl">Košík</h1>
        <CartContents />
      </Container>
    </section>
  );
}
