import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { EventPhotos, type EventPhoto } from "./EventPhotos";

export const metadata: Metadata = {
  title: "Události",
  description:
    "Zúčastněte se některé z událostí a poznejte život na Louce — brigády, festivaly a setkání se zvířaty.",
  alternates: { canonical: "/udalosti" },
};

type Event = {
  title: string;
  badge: string;
  kind: string;
  location: string;
  description: string;
  href?: string;
  date?: string;
  motto?: string;
  photos: EventPhoto[];
};

const LOUKADA_MOTTO = "Přijeď makat, louka ti poděkuje.";

const events: Event[] = [
  {
    title: "Loukáda",
    badge: "Novinka",
    kind: "Víkend na Louce",
    location: "Louka — azyl Nech mě růst",
    date: "21.–23. 8. 2026",
    motto: LOUKADA_MOTTO,
    description:
      "Loukáda je náš společný víkend přímo na Louce — čas strávený mezi zvířaty, přírodou a dobrými lidmi. Přijďte poznat každodenní život na azylu, potkat se se zvířecími obyvateli a načerpat klid v souznění s přírodou. Podrobnosti k programu upřesníme.",
    photos: [
      { src: "/assets/loukada1.webp", alt: "Společná práce na Louce" },
      { src: "/assets/louka9.webp", alt: "S ovečkami na Louce" },
    ],
  },
  {
    title: "Loukáda",
    badge: "Novinka",
    kind: "Víkend na Louce",
    location: "Louka — azyl Nech mě růst",
    date: "4.–6. 9. 2026",
    motto: LOUKADA_MOTTO,
    description:
      "Další zářijový termín naší Loukády — víkendu plného setkání se zvířaty, společné práce i odpočinku přímo na Louce. Srdečně zveme všechny, kdo si chtějí užít čas v přírodě a poznat život na azylu. Podrobnosti k programu upřesníme.",
    photos: [
      { src: "/assets/louka5.webp", alt: "Setkání s oslem Karlem" },
      { src: "/assets/louka12.webp", alt: "Zvířecí obyvatelé u přístřešku" },
    ],
  },
  {
    title: "Spolu Mezi Lesy",
    badge: "Nový termín",
    kind: "Festival na Louce",
    location: "Louka — azyl Nech mě růst",
    date: "11.–13. 9. 2026",
    description:
      "Třídenní víkend na pomezí retreatu a festivalu přímo na Louce — příroda, zvířata, intuitivní umění, pohyb a živá hudba. Akce se přesunula na nový zářijový termín. Podrobný program a přihlášení najdete na facebookové události.",
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
    description:
      "Vydejte se s námi na společnou procházku ve společnosti našich zvířecích přátel. Užijeme si čas v přírodě, mazlení se zvířaty i příjemnou atmosféru mezi dobrými lidmi. Sraz a podrobnosti upřesníme.",
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
    description:
      "Dvoudenní putování středočeskou krajinou ve společnosti psů, osla, muflona a dalších zvířecích přátel. Termín bude upřesněn.",
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
        image="/assets/hero-image.webp"
        imageAlt="Události na Louce"
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
                <article className="rounded-lg border border-border bg-surface p-7 shadow-soft sm:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-pill bg-accent/40 px-3 py-1 text-xs font-semibold text-moss-deep">
                      {e.badge}
                    </span>
                    <span className="text-sm font-medium text-moss-soft">{e.kind}</span>
                  </div>
                  <h2 className="mt-3 font-serif text-2xl font-semibold text-moss-deep">{e.title}</h2>
                  {e.motto ? (
                    <p className="mt-1.5 inline-flex items-baseline gap-2 font-serif text-lg italic leading-snug text-terracotta">
                      <span aria-hidden className="h-px w-6 self-center bg-terracotta/50" />
                      „{e.motto}“
                    </p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={16} aria-hidden /> {e.date ?? "Termín bude upřesněn"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={16} aria-hidden /> {e.location}
                    </span>
                  </div>
                  <p className="mt-4 leading-relaxed text-text">{e.description}</p>
                  <EventPhotos photos={e.photos} title={e.title} />
                  {e.href ? (
                    <a
                      href={e.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center rounded-pill bg-moss px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-moss-deep"
                    >
                      Facebook událost
                    </a>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <SocialSection tone="alt" />
    </>
  );
}
