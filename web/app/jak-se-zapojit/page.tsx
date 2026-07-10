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
import { BANK } from "@/lib/site";

export const metadata: Metadata = {
  title: "Jak se zapojit",
  description:
    "Každá pomoc se počítá. Podpořte nás finančně, virtuální adopcí, nákupem v obchůdku nebo přes naše partnerské projekty.",
  alternates: { canonical: "/jak-se-zapojit" },
};

const financial = [
  {
    icon: Landmark,
    title: "Transparentní účet",
    text: "Příspěvek můžete zaslat přímo na náš transparentní účet u Fio banky. Děkujeme za jakoukoliv částku.",
    cta: { label: "Zobrazit pohyby", href: BANK.transparentUrl },
  },
  {
    icon: HeartHandshake,
    title: "Darujme.cz",
    text: "Bezpečný a rychlý způsob, jak přispět online platební kartou nebo bankovním převodem přes portál Darujme.cz.",
    cta: { label: "Darovat online", href: "https://www.darujme.cz/projekt/1208852" },
  },
  {
    icon: Bitcoin,
    title: "Kryptoměny",
    text: "Jdeme s dobou. Pokud dáváte přednost kryptoměnám, můžete podpořit náš spolek i touto formou.",
    cta: { label: "Darovat krypto", href: "/prispet-kryptem" },
  },
];

const longterm = [
  {
    icon: PawPrint,
    title: "Virtuální adopce",
    text: "Nemůžete si vzít zvířátko domů? Nevadí! Staňte se virtuálním rodičem jednoho z našich zvířecích obyvatel a přispívejte na jeho péči.",
    cta: { label: "Adoptovat na dálku", href: "/virtualni-adopce" },
  },
  {
    icon: ShoppingBag,
    title: "Luční obchůdek",
    text: "Udělejte radost sobě nebo svým blízkým nákupem v našem dobročinném obchůdku. Výtěžek putuje přímo na podporu zvířat.",
    cta: { label: "Navštívit obchůdek", href: "/obchod" },
  },
];

const partners = [
  {
    title: "Nakrm nás",
    logo: "/assets/nakrmnas.png",
    text: "Přes portál Nakrmnas.cz nám můžete koupit konkrétní krmivo, které naše zvířata potřebují. Balíček nám dorazí přímo do azylu.",
    cta: { label: "Koupit krmivo", href: "https://www.nakrmnas.cz/nech-me-rust/" },
  },
  {
    title: "Click and Feed",
    logo: "/assets/click-and-feed.png",
    text: "Pomoc, která nic nestojí! Stačí jeden klik na webu Click and Feed a partneři projektu naplní misku v útulcích a azylech.",
    cta: { label: "Kliknout pro pomoc", href: "https://www.clickandfeed.cz" },
  },
  {
    title: "Farma Jamboz",
    logo: "/assets/jamboz.png",
    text: "Rodinná farma Jamboz z Čáslavi nám pravidelně věnuje vyřazenou zeleninu a ovoce, která putuje přímo do tlapek, zobáčků a zubů našich zvířátek. Jedete nás navštívit? Stavte se cestou u Jamboz a přivezte nějakou dobrotu – zvířátka vás za to odmění nadšeným přivítáním! 🐾",
    cta: { label: "Navštívit Jamboz", href: "https://www.jamboz.cz" },
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

export default function JakSeZapojit() {
  return (
    <>
      <PageHero
        image="/assets/zapojit-hero.webp"
        imageAlt="Dobrovolníci při práci se dřevem na Louce"
        eyebrow="Pomozte s námi"
        title="Jak se zapojit"
        subtitle="Každá pomoc se počítá. Vyberte si způsob podpory, který je vám nejbližší, a staňte se součástí našeho příběhu."
      />

      {/* Finanční podpora */}
      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader eyebrow="Přispějte" title="Finanční podpora" />
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-3">
            {financial.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <article className="group flex h-full flex-col rounded-lg border border-border bg-surface p-7 shadow-soft transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lift">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-pill bg-moss/10 p-3 text-moss">
                    <c.icon size={24} aria-hidden />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-moss-deep">{c.title}</h3>
                  <p className="mb-5 mt-2 text-text-muted">{c.text}</p>
                  <Cta {...c.cta} />
                </article>
              </Reveal>
            ))}
          </div>

          {/* Bank details block */}
          <Reveal className="mx-auto mt-8 max-w-2xl rounded-lg border border-border bg-surface-alt p-7 shadow-soft">
            <h3 className="font-serif text-lg font-semibold text-moss-deep">Bankovní spojení</h3>
            <dl className="mt-4 space-y-2 text-sm text-text">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-text-muted">Číslo účtu</dt>
                <dd className="flex items-center gap-3 font-medium">{BANK.account} <CopyButton value="2002645872/2010" label="Kopírovat" /></dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-text-muted">IBAN</dt>
                <dd className="flex items-center gap-3 font-medium">{BANK.iban} <CopyButton value={BANK.iban.replace(/\s/g, "")} label="Kopírovat" /></dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-text-muted">SWIFT</dt>
                <dd className="font-medium">{BANK.swift}</dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-text-muted">Banka</dt>
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
            <SectionHeader eyebrow="Buďte u toho dlouhodobě" title="Dlouhodobá podpora a nákupy" />
          </Reveal>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {longterm.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <article className="group flex h-full flex-col rounded-lg border border-border bg-surface p-7 shadow-soft transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lift">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-pill bg-moss/10 p-3 text-moss">
                    <c.icon size={24} aria-hidden />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-moss-deep">{c.title}</h3>
                  <p className="mb-5 mt-2 text-text-muted">{c.text}</p>
                  <Cta {...c.cta} />
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Partnerské projekty */}
      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Spolupracujeme"
              title="Partnerské projekty"
              description="Podpořit nás můžete i nákupem krmiva nebo jednoduchým kliknutím u našich partnerů."
            />
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-3">
            {partners.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <article className="group flex h-full flex-col rounded-lg border border-border bg-surface p-7 shadow-soft transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lift">
                  <div className="flex h-16 items-center justify-start">
                    <Image src={c.logo} alt={`Logo ${c.title}`} width={140} height={64} className="max-h-14 w-auto object-contain" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-moss-deep">{c.title}</h3>
                  <p className="mb-5 mt-2 text-text-muted">{c.text}</p>
                  <Cta {...c.cta} />
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
