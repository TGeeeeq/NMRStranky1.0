import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Container } from "@/components/Container";
import { SocialSection } from "@/components/SocialSection";

export const metadata: Metadata = {
  title: "Luční obchůdek",
  description: "Náš dobročinný obchůdek právě přesouváme na novou platformu. Brzy bude opět online.",
  alternates: { canonical: "/obchod" },
  robots: { index: false },
};

export default function Obchod() {
  return (
    <>
      <section className="bg-surface py-24 sm:py-28">
        <Container className="max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-pill bg-moss/10 text-moss">
            <ShoppingBag size={30} aria-hidden />
          </div>
          <h1 className="font-serif text-3xl font-semibold text-moss-deep sm:text-4xl">
            Luční obchůdek
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-text-muted">
            Náš dobročinný obchůdek právě přesouváme na novou platformu, aby byl rychlejší
            a pohodlnější. Brzy ho tu zase najdete. Mezitím nás můžete podpořit i jinými způsoby —
            každá pomoc putuje přímo na péči o zvířata.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/jak-se-zapojit"
              className="rounded-pill bg-moss px-6 py-3 font-medium text-cream transition-colors hover:bg-moss-deep"
            >
              Jak se zapojit
            </Link>
            <Link
              href="/virtualni-adopce"
              className="rounded-pill border border-border px-6 py-3 font-medium text-moss-deep transition-colors hover:bg-surface-alt"
            >
              Virtuální adopce
            </Link>
          </div>
        </Container>
      </section>
      <SocialSection tone="alt" />
    </>
  );
}
