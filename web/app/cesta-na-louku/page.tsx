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
                Autem: parkujte na adrese Nová Ves u Leštiny 32 na vyznačeném místě. Odtud vás
                vyznačená trasa dovede pěšky až na Louku.
              </p>
              <p>
                Vlakem: vystupte ve stanici Vlkaneč, nebo Nová Ves u Leštiny. Na adresu parkování
                dojdete cca 0,5 km a dál pokračujete po vyznačené trase.
              </p>
              <p>
                Pro navigaci v telefonu poslouží{" "}
                <a
                  href="https://mapy.com/s/larokoloza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-moss underline underline-offset-2 hover:text-moss-deep"
                >
                  mapa na Mapy.com
                </a>
                .
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <SocialSection tone="alt" />
    </>
  );
}
