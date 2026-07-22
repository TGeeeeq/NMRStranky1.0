import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Landmark, HeartHandshake, Bitcoin, PawPrint, ShoppingBag } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { CopyButton } from "@/components/CopyButton";
import { GooglePlayIcon } from "@/components/BrandIcons";
import { BANK, LOUKARUN } from "@/lib/site";
import { getLocale } from "@/lib/i18n.server";
import { pick, type Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, { cs: "Jak se zapojit", en: "Get involved" }),
    description: pick(locale, {
      cs: "Každá pomoc se počítá. Podpořte nás finančně, virtuální adopcí, nákupem v obchůdku nebo přes naše partnerské projekty.",
      en: "Every bit of help counts. Support us with a donation, a virtual adoption, a purchase in our little shop or through our partner projects.",
    }),
    alternates: { canonical: "/jak-se-zapojit" },
  };
}

const financial = [
  {
    icon: Landmark,
    title: { cs: "Transparentní účet", en: "Transparent account" },
    text: {
      cs: "Příspěvek můžete zaslat přímo na náš transparentní účet u Fio banky. Děkujeme za jakoukoliv částku.",
      en: "You can send a contribution directly to our transparent account at Fio banka. Thank you for any amount.",
    },
    cta: { label: { cs: "Zobrazit pohyby", en: "View transactions" }, href: BANK.transparentUrl },
  },
  {
    icon: HeartHandshake,
    title: { cs: "Darujme.cz", en: "Darujme.cz" },
    text: {
      cs: "Bezpečný a rychlý způsob, jak přispět online platební kartou nebo bankovním převodem přes portál Darujme.cz.",
      en: "A safe and fast way to donate online by card or bank transfer through the Darujme.cz portal.",
    },
    cta: { label: { cs: "Darovat online", en: "Donate online" }, href: "https://www.darujme.cz/projekt/1208852" },
  },
  {
    icon: Bitcoin,
    title: { cs: "Kryptoměny", en: "Cryptocurrencies" },
    text: {
      cs: "Jdeme s dobou. Pokud dáváte přednost kryptoměnám, můžete podpořit náš spolek i touto formou.",
      en: "We move with the times. If you prefer cryptocurrencies, you can support our association this way too.",
    },
    cta: { label: { cs: "Darovat krypto", en: "Donate crypto" }, href: "/prispet-kryptem" },
  },
];

const longterm = [
  {
    icon: PawPrint,
    title: { cs: "Virtuální adopce", en: "Virtual adoption" },
    text: {
      cs: "Nemůžete si vzít zvířátko domů? Nevadí! Staňte se virtuálním rodičem jednoho z našich zvířecích obyvatel a přispívejte na jeho péči.",
      en: "Can't take an animal home? No problem! Become the virtual parent of one of our animals and help cover the cost of its care.",
    },
    cta: { label: { cs: "Adoptovat na dálku", en: "Adopt from afar" }, href: "/virtualni-adopce" },
  },
  {
    icon: ShoppingBag,
    title: { cs: "Luční obchůdek", en: "The Meadow shop" },
    text: {
      cs: "Udělejte radost sobě nebo svým blízkým nákupem v našem dobročinném obchůdku. Výtěžek putuje přímo na podporu zvířat.",
      en: "Treat yourself or your loved ones with a purchase from our charity shop. The proceeds go straight to supporting the animals.",
    },
    cta: { label: { cs: "Navštívit obchůdek", en: "Visit the shop" }, href: "/obchod" },
  },
];

const partners = [
  {
    title: "Nakrm nás",
    logo: "/assets/nakrmnas.png",
    text: {
      cs: "Přes portál Nakrmnas.cz nám můžete koupit konkrétní krmivo, které naše zvířata potřebují. Balíček nám dorazí přímo do azylu.",
      en: "Through the Nakrmnas.cz portal you can buy us the specific feed our animals need. The package is delivered straight to the sanctuary.",
    },
    cta: { label: { cs: "Koupit krmivo", en: "Buy feed" }, href: "https://www.nakrmnas.cz/nech-me-rust/" },
  },
  {
    title: "Click and Feed",
    logo: "/assets/click-and-feed.png",
    text: {
      cs: "Pomoc, která nic nestojí! Stačí jeden klik na webu Click and Feed a partneři projektu naplní misku v útulcích a azylech.",
      en: "Help that costs nothing! Just one click on the Click and Feed website and the project's partners fill a bowl in shelters and sanctuaries.",
    },
    cta: { label: { cs: "Kliknout pro pomoc", en: "Click to help" }, href: "https://www.clickandfeed.cz" },
  },
  {
    title: "Farma Jamboz",
    logo: "/assets/jamboz.png",
    text: {
      cs: "Rodinná farma Jamboz z Čáslavi nám pravidelně věnuje vyřazenou zeleninu a ovoce, která putuje přímo do tlapek, zobáčků a zubů našich zvířátek. Jedete nás navštívit? Stavte se cestou u Jamboz a přivezte nějakou dobrotu – zvířátka vás za to odmění nadšeným přivítáním! 🐾",
      en: "The family-run Jamboz farm from Čáslav regularly donates surplus vegetables and fruit that go straight to the paws, beaks and teeth of our animals. Coming to visit us? Stop by Jamboz on the way and bring a treat — the animals will reward you with an enthusiastic welcome! 🐾",
    },
    cta: { label: { cs: "Navštívit Jamboz", en: "Visit Jamboz" }, href: "https://www.jamboz.cz" },
  },
];

function isExternal(href: string) {
  return href.startsWith("http");
}

function Cta({ href, label }: { href: string; label: string }) {
  const cls =
    "mt-auto inline-flex w-fit items-center rounded-pill bg-moss px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-moss-deep";
  return isExternal(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {label}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}

const t = {
  cs: {
    heroImageAlt: "Dobrovolníci při práci se dřevem na Louce",
    heroEyebrow: "Pomozte s námi",
    heroTitle: "Jak se zapojit",
    heroSubtitle:
      "Každá pomoc se počítá. Vyberte si způsob podpory, který je vám nejbližší, a staňte se součástí našeho příběhu.",
    financialEyebrow: "Přispějte",
    financialTitle: "Finanční podpora",
    bankTitle: "Bankovní spojení",
    bankAccount: "Číslo účtu",
    bankBank: "Banka",
    copy: "Kopírovat",
    longtermEyebrow: "Buďte u toho dlouhodobě",
    longtermTitle: "Dlouhodobá podpora a nákupy",
    gameBadge: "🎮 Podpořte nás hrou",
    gameText:
      "Naše vlastní hra, ve které běháte za skutečná zvířata z azylu. Je venku na Google Play pro Android — bez reklam, bez sledování a bez nákupů ve hře. Celý výtěžek jde na krmení a péči o zvířata, která ve hře potkáte. Další milý způsob, jak nás můžete podpořit a přitom se pobavit.",
    gameMore: "Více o hře",
    gameDownloadOn: "Stáhnout na",
    partnersEyebrow: "Spolupracujeme",
    partnersTitle: "Partnerské projekty",
    partnersDescription:
      "Podpořit nás můžete i nákupem krmiva nebo jednoduchým kliknutím u našich partnerů.",
  },
  en: {
    heroImageAlt: "Volunteers working with wood at the Meadow",
    heroEyebrow: "Help us out",
    heroTitle: "Get involved",
    heroSubtitle:
      "Every bit of help counts. Choose the way of supporting us that feels closest to you and become part of our story.",
    financialEyebrow: "Donate",
    financialTitle: "Financial support",
    bankTitle: "Bank details",
    bankAccount: "Account number",
    bankBank: "Bank",
    copy: "Copy",
    longtermEyebrow: "Be with us for the long run",
    longtermTitle: "Long-term support and shopping",
    gameBadge: "🎮 Support us by playing",
    gameText:
      "Our very own game in which you run as real animals from the sanctuary. It's out now on Google Play for Android — no ads, no tracking and no in-game purchases. All the proceeds go to feeding and caring for the animals you meet in the game. Another lovely way to support us while having fun.",
    gameMore: "More about the game",
    gameDownloadOn: "Download on",
    partnersEyebrow: "We collaborate",
    partnersTitle: "Partner projects",
    partnersDescription:
      "You can also support us by buying feed or with a simple click at our partners.",
  },
} satisfies Record<Locale, Record<string, string>>;

export default async function JakSeZapojit() {
  const locale = await getLocale();
  const c = t[locale];
  return (
    <>
      <PageHero
        image="/assets/zapojit-hero.webp"
        imageAlt={c.heroImageAlt}
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
      />

      {/* Finanční podpora */}
      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader eyebrow={c.financialEyebrow} title={c.financialTitle} />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {financial.map((card, i) => (
              <Reveal key={card.title.cs} delay={i * 0.06}>
                <article className="group flex h-full flex-col rounded-lg border border-border bg-surface p-7 shadow-soft transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lift">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-pill bg-moss/10 p-3 text-moss">
                    <card.icon size={24} aria-hidden />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-moss-deep">{pick(locale, card.title)}</h3>
                  <p className="mb-5 mt-2 text-text-muted">{pick(locale, card.text)}</p>
                  <Cta href={card.cta.href} label={pick(locale, card.cta.label)} />
                </article>
              </Reveal>
            ))}
          </div>

          {/* Bank details block */}
          <Reveal className="mx-auto mt-8 max-w-2xl rounded-lg border border-border bg-surface-alt p-7 shadow-soft">
            <h3 className="font-serif text-lg font-semibold text-moss-deep">{c.bankTitle}</h3>
            <dl className="mt-4 space-y-2 text-sm text-text">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-text-muted">{c.bankAccount}</dt>
                <dd className="flex items-center gap-3 font-medium">{BANK.account} <CopyButton value="2002645872/2010" label={c.copy} /></dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-text-muted">IBAN</dt>
                <dd className="flex items-center gap-3 font-medium">{BANK.iban} <CopyButton value={BANK.iban.replace(/\s/g, "")} label={c.copy} /></dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-text-muted">SWIFT</dt>
                <dd className="font-medium">{BANK.swift}</dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-text-muted">{c.bankBank}</dt>
                <dd className="font-medium">{BANK.bank}</dd>
              </div>
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* Dlouhodobá podpora a nákupy */}
      <section className="bg-surface-alt py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader eyebrow={c.longtermEyebrow} title={c.longtermTitle} />
          </Reveal>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {longterm.map((card, i) => (
              <Reveal key={card.title.cs} delay={i * 0.06}>
                <article className="group flex h-full flex-col rounded-lg border border-border bg-surface p-7 shadow-soft transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lift">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-pill bg-moss/10 p-3 text-moss">
                    <card.icon size={24} aria-hidden />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-moss-deep">{pick(locale, card.title)}</h3>
                  <p className="mb-5 mt-2 text-text-muted">{pick(locale, card.text)}</p>
                  <Cta href={card.cta.href} label={pick(locale, card.cta.label)} />
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Louka Run — hra, která pomáhá */}
      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-10 overflow-hidden rounded-lg border border-border bg-gradient-to-b from-[#8ed4f7]/20 to-surface-alt p-8 shadow-soft sm:flex-row sm:p-12">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-pill bg-moss/10 text-moss">
              <GooglePlayIcon size={44} />
            </div>
            <div className="text-center sm:text-left">
              <p className="inline-flex items-center gap-2 rounded-pill bg-moss/10 px-4 py-1.5 text-sm font-semibold text-moss-deep">
                {c.gameBadge}
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold text-moss-deep sm:text-3xl">
                {pick(locale, { cs: <>Zahrajte si Louka&nbsp;Run</>, en: <>Play Louka&nbsp;Run</> })}
              </h2>
              <p className="mt-4 text-text-muted">
                {c.gameText}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
                <Link
                  href={LOUKARUN.page}
                  className="inline-flex items-center rounded-pill bg-moss px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-moss-deep"
                >
                  {c.gameMore}
                </Link>
                <a
                  href={LOUKARUN.googlePlay}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-pill bg-[#2b2b2b] px-5 py-2.5 text-cream shadow-md transition hover:-translate-y-0.5 hover:bg-black"
                >
                  <GooglePlayIcon size={22} />
                  <span className="text-left leading-tight">
                    <span className="block text-[0.65rem] uppercase tracking-wide opacity-80">
                      {c.gameDownloadOn}
                    </span>
                    <span className="block text-sm font-semibold">Google Play</span>
                  </span>
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Partnerské projekty */}
      <section className="bg-surface-alt py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow={c.partnersEyebrow}
              title={c.partnersTitle}
              description={c.partnersDescription}
            />
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-3">
            {partners.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.06}>
                <article className="group flex h-full flex-col rounded-lg border border-border bg-surface p-7 shadow-soft transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lift">
                  <div className="flex h-16 items-center justify-start">
                    <Image src={card.logo} alt={`Logo ${card.title}`} width={140} height={64} className="max-h-14 w-auto object-contain" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-moss-deep">{card.title}</h3>
                  <p className="mb-5 mt-2 text-text-muted">{pick(locale, card.text)}</p>
                  <Cta href={card.cta.href} label={pick(locale, card.cta.label)} />
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <SocialSection />
    </>
  );
}
