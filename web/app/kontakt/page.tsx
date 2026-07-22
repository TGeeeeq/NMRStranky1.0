import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, CalendarClock, Check } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { SITE } from "@/lib/site";
import { getLocale } from "@/lib/i18n.server";
import { pick, type Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, { cs: "Kontakt", en: "Contact" }),
    description: pick(locale, {
      cs: "Spojte se s námi a navštivte naši Louku. Návštěvy po předchozí domluvě.",
      en: "Get in touch and come visit our Meadow. Visits by prior arrangement.",
    }),
    alternates: { canonical: "/kontakt" },
  };
}

const expect = [
  {
    cs: "Prohlídka celé Louky a seznámení se zvířaty",
    en: "A tour of the whole Meadow and a chance to meet the animals",
  },
  {
    cs: "Možnost krmení a mazlení se zvířaty",
    en: "The chance to feed and cuddle the animals",
  },
  {
    cs: "Vyprávění o historii každého zvířete",
    en: "Stories about the history of each animal",
  },
  {
    cs: "Informace o našem způsobu života a filozofii",
    en: "Insights into our way of life and philosophy",
  },
  {
    cs: "Možnost zakoupení místních produktů",
    en: "The option to buy local products",
  },
];

const t = {
  cs: {
    heroImageAlt: "Osel Karel s kamarádkou v lese",
    heroEyebrow: "Ozvěte se nám",
    heroTitle: "Kontakt",
    heroSubtitle: "Spojte se s námi a navštivte naši Louku.",
    addressTitle: "Adresa",
    mapLink: "Kreslená mapa cesty na Louku",
    emailTitle: "Email",
    visitsTitle: "Návštěvy",
    visitsText: "Po domluvě. Kontaktujte nás 48 h předem.",
    planEyebrow: "Přijeďte za námi",
    planTitle: "Plánujete návštěvu?",
    planText:
      "Rádi vítáme návštěvníky na naší Louce! Kontaktujte nás prosím alespoň 48 hodin předem a domluvte si termín návštěvy. Pomůže nám to zajistit, aby se zvířata cítila dobře a abychom vám mohli poskytnout co nejlepší zážitek.",
    expectTitle: "Co očekávat při návštěvě:",
    visitImageAlt: "Návštěva Louky",
    ctaLabel: "Domluvit návštěvu",
    mailSubject: "Z%C3%A1jem%20o%20n%C3%A1v%C5%A1t%C4%9Bvu%20Louky",
  },
  en: {
    heroImageAlt: "Karel the donkey with a friend in the forest",
    heroEyebrow: "Reach out to us",
    heroTitle: "Contact",
    heroSubtitle: "Get in touch and come visit our Meadow.",
    addressTitle: "Address",
    mapLink: "Illustrated map of the way to the Meadow",
    emailTitle: "Email",
    visitsTitle: "Visits",
    visitsText: "By arrangement. Please contact us 48 hours in advance.",
    planEyebrow: "Come and see us",
    planTitle: "Planning a visit?",
    planText:
      "We love welcoming visitors to our Meadow! Please contact us at least 48 hours in advance to arrange a time for your visit. This helps us make sure the animals are comfortable and that we can give you the best possible experience.",
    expectTitle: "What to expect on your visit:",
    visitImageAlt: "A visit to the Meadow",
    ctaLabel: "Arrange a visit",
    mailSubject: "Interested%20in%20visiting%20the%20Meadow",
  },
} satisfies Record<Locale, Record<string, string>>;

export default async function Kontakt() {
  const locale = await getLocale();
  const c = t[locale];
  return (
    <>
      <PageHero
        image="/assets/karel5.webp"
        imageAlt={c.heroImageAlt}
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
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
                <h2 className="font-serif text-xl font-semibold text-moss-deep">{c.addressTitle}</h2>
                <a
                  href={SITE.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-text-muted hover:text-moss"
                >
                  {SITE.address}
                </a>
                <Link
                  href="/cesta-na-louku"
                  className="mt-2 block text-text-muted hover:text-moss"
                >
                  {c.mapLink}
                </Link>
              </article>
            </Reveal>
            <Reveal delay={0.06}>
              <article className="h-full rounded-lg border border-border bg-surface p-7 text-center shadow-soft">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-pill bg-moss/10 text-moss">
                  <Mail size={24} aria-hidden />
                </div>
                <h2 className="font-serif text-xl font-semibold text-moss-deep">{c.emailTitle}</h2>
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
                <h2 className="font-serif text-xl font-semibold text-moss-deep">{c.visitsTitle}</h2>
                <p className="mt-2 text-text-muted">{c.visitsText}</p>
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
              <SectionHeader align="left" eyebrow={c.planEyebrow} title={c.planTitle} />
              <p className="text-lg leading-relaxed text-text">
                {c.planText}
              </p>
              <h3 className="mt-7 font-serif text-lg font-semibold text-moss-deep">
                {c.expectTitle}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {expect.map((item) => (
                  <li key={item.cs} className="flex gap-3 text-text">
                    <Check size={20} className="mt-0.5 shrink-0 text-moss" aria-hidden />
                    <span>{pick(locale, item)}</span>
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:${SITE.email}?subject=${c.mailSubject}`}
                className="mt-7 inline-flex items-center rounded-pill bg-moss px-6 py-3 font-medium text-cream transition-colors hover:bg-moss-deep"
              >
                {c.ctaLabel}
              </a>
            </Reveal>
            <Reveal delay={0.1}>
              <Image
                src="/assets/visit-image.webp"
                alt={c.visitImageAlt}
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
