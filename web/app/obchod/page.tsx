import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SocialSection } from "@/components/SocialSection";
import { CategoryFilter } from "@/components/shop/CategoryFilter";
import { ProductCard } from "@/components/shop/ProductCard";
import { getActiveProducts, getCategoriesWithCounts } from "@/lib/db/queries";
import { getLocale } from "@/lib/i18n.server";
import { pick } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, { cs: "Luční obchůdek", en: "The Meadow shop" }),
    description: pick(locale, {
      cs: "Ručně vyráběné výrobky z Louky — dřevovýroba, šperky, plakáty a výrobky našich přátel. Výtěžek jde na péči o zvířata.",
      en: "Handmade goods from the Meadow — woodwork, jewellery, posters and creations by our friends. All proceeds go toward caring for the animals.",
    }),
    alternates: { canonical: "/obchod" },
  };
}

export const dynamic = "force-dynamic"; // always fresh after admin edits

export default async function Obchod({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const { kategorie } = await searchParams;
  const locale = await getLocale();
  const [categories, products] = await Promise.all([
    getCategoriesWithCounts(),
    getActiveProducts({ categorySlug: kategorie }),
  ]);

  return (
    <>
      <PageHero
        image="/assets/obchod-hero.webp"
        imageAlt={pick(locale, { cs: "Košíky čerstvě natrhaných třešní z Louky", en: "Baskets of freshly picked cherries from the Meadow" })}
        eyebrow={pick(locale, { cs: "Podpořte nás nákupem", en: "Support us with a purchase" })}
        title={pick(locale, { cs: "Luční obchůdek", en: "The Meadow shop" })}
        subtitle={pick(locale, {
          cs: "Ručně vyráběné kousky z Louky. Každý nákup putuje přímo na péči o zvířata.",
          en: "Handmade pieces from the Meadow. Every purchase goes straight to caring for the animals.",
        })}
      />
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <CategoryFilter categories={categories} active={kategorie} />
          {products.length === 0 ? (
            <p className="mt-12 text-center text-text-muted">{pick(locale, { cs: "V této kategorii zatím nic není.", en: "Nothing here in this category yet." })}</p>
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
