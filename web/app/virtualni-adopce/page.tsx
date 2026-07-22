import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { CopyButton } from "@/components/CopyButton";
import { BANK } from "@/lib/site";
import { getLocale } from "@/lib/i18n.server";
import { pick, type Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, { cs: "Virtuální adopce", en: "Virtual adoption" }),
    description: pick(locale, {
      cs: "Staňte se patronem zvířete, které si oblíbíte. Podpořte konkrétního zvířecího obyvatele Louky pravidelným příspěvkem.",
      en: "Become the patron of an animal you grow fond of. Support a specific resident of the Meadow with a regular contribution.",
    }),
    alternates: { canonical: "/virtualni-adopce" },
  };
}

const steps = [
  {
    n: 1,
    title: { cs: "Výběr zvířete", en: "Choose an animal" },
    text: { cs: "Vyberte si zvíře, které vás zaujme.", en: "Pick an animal that catches your eye." },
  },
  {
    n: 2,
    title: { cs: "Projev zájmu", en: "Express your interest" },
    text: { cs: "Kontaktujte nás s projevem zájmu o patronát.", en: "Get in touch to let us know you'd like to become a patron." },
  },
  {
    n: 3,
    title: { cs: "Nastavení trvalého příkazu", en: "Set up a standing order" },
    text: {
      cs: "Nastavte trvalý příkaz na náš transparentní účet. Do poznámky můžete uvést, pro které zvíře je příspěvek určen.",
      en: "Set up a standing order to our transparent account. In the note you can specify which animal the contribution is for.",
    },
  },
  {
    n: 4,
    title: { cs: "Certifikace", en: "Certificate" },
    text: { cs: "Vystavíme vám certifikát potvrzující nabytí patronátu.", en: "We'll issue you a certificate confirming your patronage." },
  },
];

const t = {
  cs: {
    heroImageAlt: "Tomáš objímá krávu Květu v lese",
    heroEyebrow: "Adoptujte na dálku",
    heroTitle: "Virtuální adopce",
    heroSubtitle: "Staňte se patronem zvířete, které si oblíbíte.",
    introEyebrow: "Splňte si sen",
    introTitle: "Staňte se patronem",
    intro1:
      "Pokud jste si vždy přáli mít doma například krávu či ovce, ale okolnosti vám to nedovolily, patronát představuje ideální příležitost, jak si alespoň částečně splnit tento sen. Věříme, že sny se mají plnit, a to nejen o Vánocích.",
    intro2:
      "Jako patron budete mít možnost kdykoli navštívit zvíře, vzít ho na procházku nebo se s ním pomazlit. Tyto interakce jsou prospěšné jak pro vás, tak pro zvířata. V případě, že vám bude chybět přímý kontakt, můžeme vám zaslat aktuální fotografie či videa, abyste měli přehled o tom, jak se vašemu patronovanému zvířeti daří.",
    introImageAlt: "Virtuální adopce",
    processEyebrow: "Jak na to",
    processTitle: "Proces patronátu",
    bankLabel: "Transparentní účet",
    bankNote: "Do poznámky uveďte jméno zvířete, kterého chcete adoptovat.",
    copyAccount: "Kopírovat číslo účtu",
    viewAccount: "Zobrazit účet",
  },
  en: {
    heroImageAlt: "Tomáš hugging Květa the cow in the forest",
    heroEyebrow: "Adopt from afar",
    heroTitle: "Virtual adoption",
    heroSubtitle: "Become the patron of an animal you grow fond of.",
    introEyebrow: "Make a dream come true",
    introTitle: "Become a patron",
    intro1:
      "If you've always wished to have, say, a cow or sheep at home but circumstances never allowed it, patronage is the perfect chance to make that dream at least partly come true. We believe dreams are meant to be fulfilled — and not only at Christmas.",
    intro2:
      "As a patron you'll be able to visit your animal at any time, take it for a walk or have a cuddle. These interactions are good for you and for the animals alike. And if you find yourself missing that direct contact, we can send you up-to-date photos or videos so you always know how your sponsored animal is doing.",
    introImageAlt: "Virtual adoption",
    processEyebrow: "How it works",
    processTitle: "The patronage process",
    bankLabel: "Transparent account",
    bankNote: "In the note, please state the name of the animal you'd like to adopt.",
    copyAccount: "Copy account number",
    viewAccount: "View account",
  },
} satisfies Record<Locale, Record<string, string>>;

export default async function VirtualniAdopce() {
  const locale = await getLocale();
  const c = t[locale];
  return (
    <>
      <PageHero
        image="/assets/kveta7.webp"
        imageAlt={c.heroImageAlt}
        objectPosition="object-[50%_30%]"
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
      />

      {/* Staňte se patronem */}
      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <SectionHeader align="left" eyebrow={c.introEyebrow} title={c.introTitle} />
              <div className="space-y-5 text-lg leading-relaxed text-text">
                <p>
                  {c.intro1}
                </p>
                <p>
                  {c.intro2}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Image
                src="/assets/virtual-adoption.webp"
                alt={c.introImageAlt}
                width={760}
                height={560}
                className="w-full rounded-lg object-cover shadow-soft"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Proces patronátu */}
      <section className="bg-surface-alt py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader eyebrow={c.processEyebrow} title={c.processTitle} />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.06}>
                <article className="h-full rounded-lg border border-border bg-surface p-7 shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-pill bg-moss font-serif text-lg font-semibold text-cream">
                    {s.n}
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-moss-deep">{pick(locale, s.title)}</h3>
                  <p className="mt-2 text-text-muted">{pick(locale, s.text)}</p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Bank info */}
          <Reveal className="mx-auto mt-10 max-w-xl rounded-lg border border-border bg-surface p-8 text-center shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-wide text-moss-soft">{c.bankLabel}</p>
            <p className="mt-2 font-serif text-2xl font-semibold text-moss-deep">{BANK.account}</p>
            <p className="mt-1 text-text-muted">{BANK.bank}</p>
            <p className="mt-4 text-sm text-text-muted">
              {c.bankNote}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <CopyButton value="2002645872/2010" label={c.copyAccount} />
              <a
                href={BANK.transparentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-pill bg-moss px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-moss-deep"
              >
                {c.viewAccount}
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      <SocialSection />
    </>
  );
}
