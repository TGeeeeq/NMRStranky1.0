import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { SOCIAL } from "@/lib/site";
import { EventCard, type Event } from "./EventCard";
import { getLocale } from "@/lib/i18n.server";
import { pick, type Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, { cs: "Události", en: "Events" }),
    description: pick(locale, {
      cs: "Zúčastněte se některé z událostí a poznejte život na Louce — brigády, festivaly a setkání se zvířaty.",
      en: "Join one of our events and get to know life at the Meadow — work weekends, festivals and gatherings with the animals.",
    }),
    alternates: { canonical: "/udalosti" },
  };
}

const LOUKADA_MOTTO = {
  cs: "Přijeď makat, louka ti poděkuje.",
  en: "Come and pitch in — the meadow will thank you.",
};

const kontaktniOdkazy = (locale: Locale) => (
  <p>
    {locale === "en" ? "If anything is unclear, message us on Instagram" : "Kdyby vám nebylo něco jasné, pište nám na Instagram"}{" "}
    <a
      href={SOCIAL.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-moss underline underline-offset-2 hover:text-moss-deep"
    >
      @nech_me_rust
    </a>{" "}
    {locale === "en" ? "or by e-mail at" : "nebo na e-mail"}{" "}
    <a
      href="mailto:nechmerust@gmail.com"
      className="font-medium text-moss underline underline-offset-2 hover:text-moss-deep"
    >
      nechmerust@gmail.com
    </a>
    .
  </p>
);

const buildEvents = (locale: Locale): Event[] => [
  {
    title: "Loukáda",
    badge: pick(locale, { cs: "Novinka", en: "New" }),
    kind: pick(locale, { cs: "Víkend na Louce", en: "Weekend at the Meadow" }),
    location: pick(locale, { cs: "Louka — azyl Nech mě růst", en: "The Meadow — Nech mě růst sanctuary" }),
    date: "21.–23. 8. 2026",
    motto: pick(locale, LOUKADA_MOTTO),
    teaser: pick(locale, {
      cs: "Společný víkend přímo na Louce — práce kolem zvířat, staveb a zahrady, večery u ohně a spaní pod širým nebem.",
      en: "A weekend together right at the Meadow — work around the animals, buildings and garden, evenings by the fire and sleeping under the open sky.",
    }),
    description: locale === "en" ? (
      <>
        <p>
          Lovely day to you, dear Friends — the time has come! From 21 to 23 August we can gather
          at the Meadow and spend time together in a picturesque setting among the forests. You’ll
          lend a hand, become part of the Meadow, and along the way you can learn some hands-on work
          around the animals, buildings and gardening. I’m already really looking forward to it.
        </p>
        <p>
          This whole summer is special because the Meadow is gaining a new human member — our
          daughter. For me that’s a big thing, and I’m looking forward to sharing her with you.
        </p>
        <p>
          Plant-based food will be provided throughout the Loukáda. If you’d like to bring something
          from your own kitchen for the shared table, we’ll certainly be glad.
        </p>
        <p>Sleeping at the Meadow in your own tent, or by the fire under the open sky.</p>
        <p>
          Do bring work clothes and something warmer for the evening — the evenings and nights here
          tend to be chilly.
        </p>
        <p>
          Those coming by car, park at the address Nová Ves u Leštiny 32 in the marked spot. Those
          of you coming by train will get off at Vlkaneč or Nová Ves u Leštiny station — it’s about
          0.5 km on foot to the parking address, and from there follow the marked route all the way
          to us at the Meadow.
        </p>
        {kontaktniOdkazy(locale)}
        <p>
          I wish you all lovely days, I’m very much looking forward to seeing you, and see you at
          the Meadow. Let’s let ourselves and nature grow. — TomLuk
        </p>
        <p>P.S. Come and pitch in, the Meadow will thank you. Or at least share this — that helps us a lot too. 🙏</p>
      </>
    ) : (
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
        {kontaktniOdkazy(locale)}
        <p>
          Přeji vám všem krásné dny, moc se na vás těším a vidíme se na Louce. Nechme sebe a
          přírodu růst. — TomLuk
        </p>
        <p>P.S. Přijeď makat, Louka ti poděkuje. Nebo aspoň sdílej — i to nám moc pomůže. 🙏</p>
      </>
    ),
    photos: [
      { src: "/assets/loukada1.webp", alt: pick(locale, { cs: "Společná práce na Louce", en: "Working together at the Meadow" }) },
      { src: "/assets/louka9.webp", alt: pick(locale, { cs: "S ovečkami na Louce", en: "With the sheep at the Meadow" }) },
    ],
    showMap: true,
  },
  {
    title: "Loukáda",
    badge: pick(locale, { cs: "Novinka", en: "New" }),
    kind: pick(locale, { cs: "Víkend na Louce", en: "Weekend at the Meadow" }),
    location: pick(locale, { cs: "Louka — azyl Nech mě růst", en: "The Meadow — Nech mě růst sanctuary" }),
    date: "4.–6. 9. 2026",
    motto: pick(locale, LOUKADA_MOTTO),
    teaser: pick(locale, {
      cs: "Další zářijový termín Loukády — setkání se zvířaty, společná práce i odpočinek přímo na Louce.",
      en: "Another September date for the Loukáda — time with the animals, working together and resting right at the Meadow.",
    }),
    description: locale === "en" ? (
      <>
        <p>
          Another September date for our Loukáda — a weekend full of time with the animals, working
          together and resting right at the Meadow. We warmly invite everyone who’d like to enjoy
          time in nature and get to know life at the sanctuary. Details of the programme to follow.
        </p>
        <p>
          Those coming by car, park at the address Nová Ves u Leštiny 32 in the marked spot — from
          there the marked route will lead you all the way to us at the Meadow. By train you can
          reach Vlkaneč or Nová Ves u Leštiny station.
        </p>
      </>
    ) : (
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
      { src: "/assets/louka5.webp", alt: pick(locale, { cs: "Setkání s oslem Karlem", en: "Meeting Karel the donkey" }) },
      { src: "/assets/louka12.webp", alt: pick(locale, { cs: "Zvířecí obyvatelé u přístřešku", en: "The animals by the shelter" }) },
    ],
    showMap: true,
  },
  {
    title: "Spolu Mezi Lesy",
    badge: pick(locale, { cs: "Nový termín", en: "New date" }),
    kind: pick(locale, { cs: "Festival na Louce", en: "Festival at the Meadow" }),
    location: pick(locale, { cs: "Louka — azyl Nech mě růst", en: "The Meadow — Nech mě růst sanctuary" }),
    date: "11.–13. 9. 2026",
    teaser: pick(locale, {
      cs: "Třídenní víkend na pomezí retreatu a festivalu — příroda, zvířata, intuitivní umění, pohyb a živá hudba.",
      en: "A three-day weekend somewhere between a retreat and a festival — nature, animals, intuitive art, movement and live music.",
    }),
    description: locale === "en" ? (
      <p>
        A three-day weekend somewhere between a retreat and a festival, right at the Meadow —
        nature, animals, intuitive art, movement and live music. The event has been moved to a
        new September date. You’ll find the full programme and sign-up on the Facebook event.
      </p>
    ) : (
      <p>
        Třídenní víkend na pomezí retreatu a festivalu přímo na Louce — příroda, zvířata,
        intuitivní umění, pohyb a živá hudba. Akce se přesunula na nový zářijový termín.
        Podrobný program a přihlášení najdete na facebookové události.
      </p>
    ),
    href: "https://facebook.com/events/s/spolu-mezi-lesy-presunuto-na-z/2298157060995232/",
    photos: [
      { src: "/assets/mezilesy.jpg", alt: pick(locale, { cs: "Plakát festivalu Spolu Mezi Lesy", en: "Poster for the Spolu Mezi Lesy festival" }) },
      { src: "/assets/louka3.webp", alt: pick(locale, { cs: "Odpočinek se zvířaty na Louce", en: "Resting with the animals at the Meadow" }) },
    ],
  },
  {
    title: pick(locale, { cs: "Společná procházka", en: "A walk together" }),
    badge: pick(locale, { cs: "Novinka", en: "New" }),
    kind: pick(locale, { cs: "Procházka se zvířaty", en: "A walk with the animals" }),
    location: pick(locale, { cs: "Louka — azyl Nech mě růst", en: "The Meadow — Nech mě růst sanctuary" }),
    date: "26.9. 2026",
    teaser: pick(locale, {
      cs: "Procházka ve společnosti našich zvířecích přátel — čas v přírodě, mazlení a příjemná atmosféra.",
      en: "A walk in the company of our animal friends — time in nature, cuddles and a lovely atmosphere.",
    }),
    description: locale === "en" ? (
      <p>
        Come along with us for a walk in the company of our animal friends. We’ll enjoy time in
        nature, cuddles with the animals and a lovely atmosphere among good people. Meeting point
        and details to follow.
      </p>
    ) : (
      <p>
        Vydejte se s námi na společnou procházku ve společnosti našich zvířecích přátel.
        Užijeme si čas v přírodě, mazlení se zvířaty i příjemnou atmosféru mezi dobrými
        lidmi. Sraz a podrobnosti upřesníme.
      </p>
    ),
    photos: [
      { src: "/assets/walk1.webp", alt: pick(locale, { cs: "Procházka se zvířaty podzimní krajinou", en: "A walk with the animals through the autumn landscape" }) },
      { src: "/assets/walk2.webp", alt: pick(locale, { cs: "Se zvířecími přáteli na lesní cestě", en: "With animal friends on a forest path" }) },
    ],
  },
  {
    title: pick(locale, { cs: "Toulky se zvířaty", en: "Wandering with the animals" }),
    badge: pick(locale, { cs: "Termín upřesníme", en: "Date to be confirmed" }),
    kind: pick(locale, { cs: "Dvoudenní putování", en: "Two-day journey" }),
    location: pick(locale, { cs: "Střední Čechy", en: "Central Bohemia" }),
    teaser: pick(locale, {
      cs: "Dvoudenní putování středočeskou krajinou se psy, oslem, muflonem a dalšími zvířecími přáteli.",
      en: "A two-day journey through the Central Bohemian countryside with dogs, a donkey, a mouflon and other animal friends.",
    }),
    description: locale === "en" ? (
      <p>
        A two-day journey through the Central Bohemian countryside in the company of dogs, a donkey,
        a mouflon and other animal friends. The date will be confirmed.
      </p>
    ) : (
      <p>
        Dvoudenní putování středočeskou krajinou ve společnosti psů, osla, muflona a
        dalších zvířecích přátel. Termín bude upřesněn.
      </p>
    ),
    href: "https://www.facebook.com/share/1BDFbAxfFf/",
    photos: [
      { src: "/assets/toulky1.webp", alt: pick(locale, { cs: "Putování s ovečkami a dalšími zvířaty", en: "Wandering with sheep and other animals" }) },
      { src: "/assets/toulky2.webp", alt: pick(locale, { cs: "Ovečky na cestě středočeskou krajinou", en: "Sheep on a path through the Central Bohemian countryside" }) },
    ],
  },
];

export default async function Udalosti() {
  const locale = await getLocale();
  const events = buildEvents(locale);
  return (
    <>
      <PageHero
        image="/assets/udalosti-hero.webp"
        imageAlt={pick(locale, {
          cs: "Společná procházka lidí s krávami prosluněným lesem",
          en: "People walking together with cows through a sunlit forest",
        })}
        objectPosition="object-[38%_50%]"
        eyebrow={pick(locale, { cs: "Pojďte mezi nás", en: "Come and join us" })}
        title={pick(locale, { cs: "Události", en: "Events" })}
        subtitle={pick(locale, {
          cs: "Zúčastněte se některé z událostí a poznejte život na Louce.",
          en: "Join one of our events and get to know life at the Meadow.",
        })}
      />

      <section className="bg-surface py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeader
              eyebrow={pick(locale, { cs: "Kalendář", en: "Calendar" })}
              title={pick(locale, { cs: "Nadcházející události", en: "Upcoming events" })}
              description={pick(locale, {
                cs: "Pravidelně pořádáme brigády, festivaly a setkání se zvířaty na Louce. Přijďte poznat náš každodenní život v souznění s přírodou.",
                en: "We regularly hold work weekends, festivals and gatherings with the animals at the Meadow. Come and discover our everyday life in harmony with nature.",
              })}
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
