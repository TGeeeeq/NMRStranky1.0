import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { LoukaMap } from "@/components/louka-map/LoukaMap";

export const metadata: Metadata = {
  title: "Cesta na Louku",
  description:
    "Kreslená mapa cesty na Louku — vyberte, kudy přijedete, a mapa vám ukáže pěší trasu od parkoviště nebo od vlaku.",
  alternates: { canonical: "/cesta-na-louku" },
};

export default function CestaNaLouku() {
  return (
    <>
      <PageHero
        image="/assets/udalosti-hero.webp"
        imageAlt="Společná procházka lidí s krávami prosluněným lesem"
        eyebrow="Jak k nám"
        title="Cesta na Louku"
        subtitle="Vyberte, kudy přijedete, a mapa vám ukáže cestu."
      />

      <section className="bg-surface py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeader
              eyebrow="Mapa"
              title="Kudy na Louku"
              description="Kreslená mapa okolí podle skutečných cest. Kliknutím zvolte místo příjezdu — vyznačí se pěší trasa až k nám."
            />
          </Reveal>

          <Reveal delay={0.06}>
            <LoukaMap />
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-10 space-y-4 leading-relaxed text-text">
              <p>
                <strong>Autem:</strong> zaparkujte na vyznačeném parkovišti u trati (najdete tam
                i baráček našeho hodného souseda Milana). Odtud už je to pěšky kousek dolů na
                Louku — trasu vám ukáže mapa výše.
              </p>
              <p>
                <strong>Vlakem:</strong> vystupte ve stanici Vlkaneč, nebo Nová Ves u Leštiny.
                Z Nové Vsi můžete jít buď po silnici, nebo luční cestou podél trati; z Vlkanče
                vede cesta polem kolem třešňové aleje. Na mapě si klikněte, odkud přijdete, a
                pěší trasa se vám vyznačí.
              </p>
              <p>
                Pro navigaci v telefonu použijte tlačítko <em>„Otevřít v Mapy.cz“</em> přímo
                v mapě výše.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <SocialSection tone="alt" />
    </>
  );
}
