import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { LoukaMap } from "@/components/louka-map/LoukaMap";
import { getLocale } from "@/lib/i18n.server";
import { pick } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, { cs: "Cesta na Louku", en: "Getting to the Meadow" }),
    description: pick(locale, {
      cs: "Kreslená mapa cesty na Louku — vyberte, kudy přijedete, a mapa vám ukáže pěší trasu od parkoviště nebo od vlaku.",
      en: "An illustrated map of the way to the Meadow — choose how you're arriving and the map shows the walking route from the car park or the station.",
    }),
    alternates: { canonical: "/cesta-na-louku" },
  };
}

export default async function CestaNaLouku() {
  const locale = await getLocale();
  return (
    <>
      <PageHero
        image="/assets/udalosti-hero.webp"
        imageAlt={pick(locale, {
          cs: "Společná procházka lidí s krávami prosluněným lesem",
          en: "People walking together with cows through a sunlit forest",
        })}
        eyebrow={pick(locale, { cs: "Jak k nám", en: "How to reach us" })}
        title={pick(locale, { cs: "Cesta na Louku", en: "Getting to the Meadow" })}
        subtitle={pick(locale, {
          cs: "Vyberte, kudy přijedete, a mapa vám ukáže cestu.",
          en: "Choose how you're arriving and the map will show you the way.",
        })}
      />

      <section className="bg-surface py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeader
              eyebrow={pick(locale, { cs: "Mapa", en: "Map" })}
              title={pick(locale, { cs: "Kudy na Louku", en: "The way to the Meadow" })}
              description={pick(locale, {
                cs: "Kreslená mapa okolí podle skutečných cest. Kliknutím zvolte místo příjezdu — vyznačí se pěší trasa až k nám.",
                en: "An illustrated map of the area drawn from the real paths. Click your point of arrival and the walking route to us will be marked.",
              })}
            />
          </Reveal>

          <Reveal delay={0.06}>
            <LoukaMap />
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-10 space-y-4 leading-relaxed text-text">
              {locale === "en" ? (
                <>
                  <p>
                    <strong>By car:</strong> park in the marked car park by the railway (you'll
                    also spot the little house of our kind neighbour Milan). From there it's a
                    short walk down to the Meadow — the map above shows the way.
                  </p>
                  <p>
                    <strong>By train:</strong> get off at Vlkaneč or Nová Ves u Leštiny station.
                    From Nová Ves you can go either along the road or by the meadow path beside
                    the railway; from Vlkaneč the path leads across the field past the cherry
                    avenue. Click on the map to show where you're coming from and your walking
                    route will be marked.
                  </p>
                  <p>
                    For navigation on your phone, use the <em>&bdquo;Open in Mapy.cz&ldquo;</em>{" "}
                    button in the map above.
                  </p>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </Reveal>
        </Container>
      </section>

      <SocialSection tone="alt" />
    </>
  );
}
