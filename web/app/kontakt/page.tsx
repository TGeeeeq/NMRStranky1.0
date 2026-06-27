import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Mail, CalendarClock, Check } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Spojte se s námi a navštivte naši Louku. Návštěvy po předchozí domluvě.",
  alternates: { canonical: "/kontakt" },
};

const expect = [
  "Prohlídka celé Louky a seznámení se zvířaty",
  "Možnost krmení a mazlení se zvířaty",
  "Vyprávění o historii každého zvířete",
  "Informace o našem způsobu života a filozofii",
  "Možnost zakoupení místních produktů",
];

export default function Kontakt() {
  return (
    <>
      <PageHero
        image="/assets/contact-hero.webp"
        imageAlt="Kontakt"
        eyebrow="Ozvěte se nám"
        title="Kontakt"
        subtitle="Spojte se s námi a navštivte naši Louku."
      />

      {/* Kontaktní karty */}
      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            <Reveal>
              <article className="h-full rounded-lg border border-border bg-surface p-7 text-center shadow-soft">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-pill bg-moss/10 text-moss">
                  <MapPin size={24} aria-hidden />
                </div>
                <h2 className="font-serif text-xl font-semibold text-moss-deep">Adresa</h2>
                <a
                  href={SITE.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-text-muted hover:text-moss"
                >
                  {SITE.address}
                </a>
              </article>
            </Reveal>
            <Reveal delay={0.06}>
              <article className="h-full rounded-lg border border-border bg-surface p-7 text-center shadow-soft">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-pill bg-moss/10 text-moss">
                  <Mail size={24} aria-hidden />
                </div>
                <h2 className="font-serif text-xl font-semibold text-moss-deep">Email</h2>
                <a href={`mailto:${SITE.email}`} className="mt-2 block text-text-muted hover:text-moss">
                  {SITE.email}
                </a>
              </article>
            </Reveal>
            <Reveal delay={0.12}>
              <article className="h-full rounded-lg border border-border bg-surface p-7 text-center shadow-soft">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-pill bg-moss/10 text-moss">
                  <CalendarClock size={24} aria-hidden />
                </div>
                <h2 className="font-serif text-xl font-semibold text-moss-deep">Návštěvy</h2>
                <p className="mt-2 text-text-muted">Po domluvě. Kontaktujte nás 48 h předem.</p>
              </article>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Plánujete návštěvu */}
      <section className="bg-surface-alt py-20 sm:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <SectionHeader align="left" eyebrow="Přijeďte za námi" title="Plánujete návštěvu?" />
              <p className="text-lg leading-relaxed text-text">
                Rádi vítáme návštěvníky na naší Louce! Kontaktujte nás prosím alespoň 48 hodin
                předem a domluvte si termín návštěvy. Pomůže nám to zajistit, aby se zvířata cítila
                dobře a abychom vám mohli poskytnout co nejlepší zážitek.
              </p>
              <h3 className="mt-7 font-serif text-lg font-semibold text-moss-deep">
                Co očekávat při návštěvě:
              </h3>
              <ul className="mt-3 space-y-2.5">
                {expect.map((item) => (
                  <li key={item} className="flex gap-3 text-text">
                    <Check size={20} className="mt-0.5 shrink-0 text-moss" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:${SITE.email}?subject=Z%C3%A1jem%20o%20n%C3%A1v%C5%A1t%C4%9Bvu%20Louky`}
                className="mt-7 inline-flex items-center rounded-pill bg-moss px-6 py-3 font-medium text-cream transition-colors hover:bg-moss-deep"
              >
                Domluvit návštěvu
              </a>
            </Reveal>
            <Reveal delay={0.1}>
              <Image
                src="/assets/visit-image.webp"
                alt="Návštěva Louky"
                width={760}
                height={560}
                className="w-full rounded-lg object-cover shadow-soft"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      <SocialSection />
    </>
  );
}
