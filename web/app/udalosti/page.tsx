import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";

export const metadata: Metadata = {
  title: "Události",
  description:
    "Zúčastněte se některé z událostí a poznejte život na Louce — brigády, festivaly a setkání se zvířaty.",
  alternates: { canonical: "/udalosti" },
};

const events = [
  {
    title: "Toulky se zvířaty",
    badge: "Termín upřesníme",
    kind: "Dvoudenní putování",
    location: "Střední Čechy",
    description:
      "Dvoudenní putování středočeskou krajinou ve společnosti psů, osla, muflona a dalších zvířecích přátel. Termín bude upřesněn.",
    href: "https://www.facebook.com/share/1BDFbAxfFf/",
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
              <Reveal key={e.title} delay={i * 0.06}>
                <article className="rounded-lg border border-border bg-surface p-7 shadow-soft sm:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-pill bg-accent/40 px-3 py-1 text-xs font-semibold text-moss-deep">
                      {e.badge}
                    </span>
                    <span className="text-sm font-medium text-moss-soft">{e.kind}</span>
                  </div>
                  <h2 className="mt-3 font-serif text-2xl font-semibold text-moss-deep">{e.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={16} aria-hidden /> Termín bude upřesněn
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={16} aria-hidden /> {e.location}
                    </span>
                  </div>
                  <p className="mt-4 leading-relaxed text-text">{e.description}</p>
                  <a
                    href={e.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center rounded-pill bg-moss px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-moss-deep"
                  >
                    Facebook událost
                  </a>
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
