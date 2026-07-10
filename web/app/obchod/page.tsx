import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SocialSection } from "@/components/SocialSection";
import { CategoryFilter } from "@/components/shop/CategoryFilter";
import { ProductCard } from "@/components/shop/ProductCard";
import { getActiveProducts, getCategoriesWithCounts } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Luční obchůdek",
  description:
    "Ručně vyráběné výrobky z Louky — dřevovýroba, šperky, plakáty a výrobky našich přátel. Výtěžek jde na péči o zvířata.",
  alternates: { canonical: "/obchod" },
};

export const dynamic = "force-dynamic"; // always fresh after admin edits

export default async function Obchod({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const { kategorie } = await searchParams;
  const [categories, products] = await Promise.all([
    getCategoriesWithCounts(),
    getActiveProducts({ categorySlug: kategorie }),
  ]);

  return (
    <>
      <PageHero
        image="/assets/obchod-hero.webp"
        imageAlt="Košíky čerstvě natrhaných třešní z Louky"
        eyebrow="Podpořte nás nákupem"
        title="Luční obchůdek"
        subtitle="Ručně vyráběné kousky z Louky. Každý nákup putuje přímo na péči o zvířata."
      />
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <CategoryFilter categories={categories} active={kategorie} />
          {products.length === 0 ? (
            <p className="mt-12 text-center text-text-muted">V této kategorii zatím nic není.</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i * 0.04, 0.3)}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
      <SocialSection tone="alt" />
    </>
  );
}
