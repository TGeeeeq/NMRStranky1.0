import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { SOCIAL } from "@/lib/site";
import { EventCard, type Event } from "./EventCard";
import type { EventMapData } from "./EventMap";

export const metadata: Metadata = {
  title: "Události",
  description:
    "Zúčastněte se některé z událostí a poznejte život na Louce — brigády, festivaly a setkání se zvířaty.",
  alternates: { canonical: "/udalosti" },
};

const LOUKADA_MOTTO = "Přijeď makat, louka ti poděkuje.";

/** Mapa cesty na Louku (sdíleno z Mapy.com: https://mapy.com/s/larokoloza) —
 *  body parkování, Louka a vlakové stanice Vlkaneč / Nová Ves u Leštiny. */
const LOUKA_MAP: EventMapData = {
  embedUrl:
    "https://mapy.com/cs/letecka?vlastni-body&l=1&ut=parkov%C3%A1n%C3%AD&ut=Louka&ut=Vlkane%C4%8D%20vlak&ut=Nov%C3%A1%20Ves%20u%20Le%C5%A1tiny%20vlak&ut=Louka&uc=9ip0jxW6U1e9w0N5W1jCFBO1f43OljsK&ud=49%C2%B047%2737.969%22N%2C%2015%C2%B023%2750.633%22E&ud=49%C2%B047%2735.536%22N%2C%2015%C2%B023%2728.669%22E&ud=49%C2%B048%2715.566%22N%2C%2015%C2%B024%2716.717%22E&ud=49%C2%B047%272.513%22N%2C%2015%C2%B024%2712.480%22E&ud=49%C2%B047%2750.438%22N%2C%2015%C2%B023%2718.939%22E&x=15.3903545&y=49.7958360&z=16&frame=1",
  linkUrl: "https://mapy.com/s/larokoloza",
  caption:
    "Na mapě je vyznačené parkování (Nová Ves u Leštiny 32), vlakové stanice Vlkaneč a Nová Ves u Leštiny a cesta k nám na Louku.",
};

const kontaktniOdkazy = (
  <p>
    Kdyby vám nebylo něco jasné, pište nám na Instagram{" "}
    <a
      href={SOCIAL.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-moss underline underline-offset-2 hover:text-moss-deep"
    >
      @nech_me_rust
    </a>{" "}
    nebo na e-mail{" "}
    <a
      href="mailto:nechmerust@gmail.com"
      className="font-medium text-moss underline underline-offset-2 hover:text-moss-deep"
    >
      nechmerust@gmail.com
    </a>
    .
  </p>
);

const events: Event[] = [
  {
    title: "Loukáda",
    badge: "Novinka",
    kind: "Víkend na Louce",
    location: "Louka — azyl Nech mě růst",
    date: "21.–23. 8. 2026",
    motto: LOUKADA_MOTTO,
    teaser:
      "Společný víkend přímo na Louce — práce kolem zvířat, staveb a zahrady, večery u ohně a spaní pod širým nebem.",
    description: (
      <>
        <p>
          Krásný den, Přátelníci, je to tu! Od 21. do 23. srpna se můžeme sejít na Louce a
          prožít společný čas v malebném prostředí mezi lesy. U té příležitosti přiložíte
          ruku k dílu, stanete se součástí Louky a zároveň se můžete přiučit manuální práci
          kolem zvířat, staveb a zahradničení. Já už se moc těším.
        </p>
        <p>
          Letos je celé léto speciální tím, že na Louku přibude nový lidský člen — naše
          dcera. Pro mě je to velká věc a těším se, až ji s vámi budu moci posdílet.
        </p>
        <p>
          Na Loukádě bude po celý čas zajištěna rostlinná strava. Pokud budete chtít přivézt
          něco z vaší kuchyně na společný stůl, budeme určitě rádi.
        </p>
        <p>Spaní na Louce ve vlastním stanu, nebo u ohně pod širým nebem.</p>
        <p>
          Vezměte si určitě pracovní oblečení a na večer něco teplejšího — večery a noci tu
          bývají chladné.
        </p>
        <p>
          Kdo pojedete autem, parkujte na adrese Nová Ves u Leštiny 32 na vyznačeném místě.
          Ti z vás, kdo pojedou vlakem, vystoupí ve stanici Vlkaneč nebo Nová Ves u Leštiny
          — na adresu parkování dojdete cca 0,5 km pěšky a odtud pokračujte po vyznačené
          trase až k nám na Louku.
        </p>
        {kontaktniOdkazy}
        <p>
          Přeji vám všem krásné dny, moc se na vás těším a vidíme se na Louce. Nechme sebe a
          přírodu růst. — TomLuk
        </p>
        <p>P.S. Přijeď makat, Louka ti poděkuje. Nebo aspoň sdílej — i to nám moc pomůže. 🙏</p>
      </>
    ),
    photos: [
      { src: "/assets/loukada1.webp", alt: "Společná práce na Louce" },
      { src: "/assets/louka9.webp", alt: "S ovečkami na Louce" },
    ],
    map: LOUKA_MAP,
  },
  {
    title: "Loukáda",
    badge: "Novinka",
    kind: "Víkend na Louce",
    location: "Louka — azyl Nech mě růst",
    date: "4.–6. 9. 2026",
    motto: LOUKADA_MOTTO,
    teaser:
      "Další zářijový termín Loukády — setkání se zvířaty, společná práce i odpočinek přímo na Louce.",
    description: (
      <>
        <p>
          Další zářijový termín naší Loukády — víkendu plného setkání se zvířaty, společné
          práce i odpočinku přímo na Louce. Srdečně zveme všechny, kdo si chtějí užít čas
          v přírodě a poznat život na azylu. Podrobnosti k programu upřesníme.
        </p>
        <p>
          Kdo pojedete autem, parkujte na adrese Nová Ves u Leštiny 32 na vyznačeném místě —
          odtud vás vyznačená trasa dovede až k nám na Louku. Vlakem to jde do stanice
          Vlkaneč nebo Nová Ves u Leštiny.
        </p>
      </>
    ),
    photos: [
      { src: "/assets/louka5.webp", alt: "Setkání s oslem Karlem" },
      { src: "/assets/louka12.webp", alt: "Zvířecí obyvatelé u přístřešku" },
    ],
    map: LOUKA_MAP,
  },
  {
    title: "Spolu Mezi Lesy",
    badge: "Nový termín",
    kind: "Festival na Louce",
    location: "Louka — azyl Nech mě růst",
    date: "11.–13. 9. 2026",
    teaser:
      "Třídenní víkend na pomezí retreatu a festivalu — příroda, zvířata, intuitivní umění, pohyb a živá hudba.",
    description: (
      <p>
        Třídenní víkend na pomezí retreatu a festivalu přímo na Louce — příroda, zvířata,
        intuitivní umění, pohyb a živá hudba. Akce se přesunula na nový zářijový termín.
        Podrobný program a přihlášení najdete na facebookové události.
      </p>
    ),
    href: "https://facebook.com/events/s/spolu-mezi-lesy-presunuto-na-z/2298157060995232/",
    photos: [
      { src: "/assets/mezilesy.jpg", alt: "Plakát festivalu Spolu Mezi Lesy" },
      { src: "/assets/louka3.webp", alt: "Odpočinek se zvířaty na Louce" },
    ],
  },
  {
    title: "Společná procházka",
    badge: "Novinka",
    kind: "Procházka se zvířaty",
    location: "Louka — azyl Nech mě růst",
    date: "26.–27. 9. 2026",
    teaser:
      "Procházka ve společnosti našich zvířecích přátel — čas v přírodě, mazlení a příjemná atmosféra.",
    description: (
      <p>
        Vydejte se s námi na společnou procházku ve společnosti našich zvířecích přátel.
        Užijeme si čas v přírodě, mazlení se zvířaty i příjemnou atmosféru mezi dobrými
        lidmi. Sraz a podrobnosti upřesníme.
      </p>
    ),
    photos: [
      { src: "/assets/walk1.webp", alt: "Procházka se zvířaty podzimní krajinou" },
      { src: "/assets/walk2.webp", alt: "Se zvířecími přáteli na lesní cestě" },
    ],
  },
  {
    title: "Toulky se zvířaty",
    badge: "Termín upřesníme",
    kind: "Dvoudenní putování",
    location: "Střední Čechy",
    teaser:
      "Dvoudenní putování středočeskou krajinou se psy, oslem, muflonem a dalšími zvířecími přáteli.",
    description: (
      <p>
        Dvoudenní putování středočeskou krajinou ve společnosti psů, osla, muflona a
        dalších zvířecích přátel. Termín bude upřesněn.
      </p>
    ),
    href: "https://www.facebook.com/share/1BDFbAxfFf/",
    photos: [
      { src: "/assets/toulky1.webp", alt: "Putování s ovečkami a dalšími zvířaty" },
      { src: "/assets/toulky2.webp", alt: "Ovečky na cestě středočeskou krajinou" },
    ],
  },
];

export default function Udalosti() {
  return (
    <>
      <PageHero
        image="/assets/udalosti-hero.webp"
        imageAlt="Společná procházka lidí s krávami prosluněným lesem"
        objectPosition="object-[38%_50%]"
        eyebrow="Pojďte mezi nás"
        title="Události"
        subtitle="Zúčastněte se některé z událostí a poznejte život na Louce."
      />

      <section className="bg-surface py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeader
              eyebrow="Kalendář"
              title="Nadcházející události"
              description="Pravidelně pořádáme brigády, festivaly a setkání se zvířaty na Louce. Přijďte poznat náš každodenní život v souznění s přírodou."
            />
          </Reveal>

          <div className="space-y-6">
            {events.map((e, i) => (
              <Reveal key={`${e.title}-${e.date ?? i}`} delay={i * 0.06}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <SocialSection tone="alt" />
    </>
  );
}
