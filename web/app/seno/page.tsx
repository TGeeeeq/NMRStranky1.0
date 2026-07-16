import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Landmark, HeartHandshake, Share2, Gamepad2 } from "lucide-react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { SocialSection } from "@/components/SocialSection";
import { CopyButton } from "@/components/CopyButton";
import { HayMeter } from "@/components/HayMeter";
import { BANK, SITE } from "@/lib/site";
import { SENO_CAMPAIGN } from "@/lib/campaign";

export const metadata: Metadata = {
  title: "Seno pro Louku",
  description:
    "Seno je letos kvůli extrémnímu suchu vzácné a drahé. Pomozte nám vybrat 100 000 Kč na zimní zásobu pro zvířata z Louky — každých 800 Kč je jeden balík.",
  alternates: { canonical: "/seno" },
  openGraph: {
    images: ["/assets/karel.webp"],
  },
};

const tips = [
  { amount: "400 Kč", covers: "půl balíku sena" },
  { amount: "800 Kč", covers: "celý balík sena" },
  { amount: "1 600 Kč", covers: "dva balíky sena" },
];

const otherWays = [
  {
    icon: HeartHandshake,
    title: "Darujme.cz",
    text: "Nechcete skenovat QR kód? Přispějte platební kartou nebo převodem přes ověřený portál Darujme.cz.",
    cta: { label: "Darovat online", href: "https://www.darujme.cz/projekt/1208852" },
  },
  {
    icon: Landmark,
    title: "Transparentní účet",
    text: "Každou korunu sbírky vidíte. Pohyby na našem účtu u Fio banky jsou veřejné — přesvědčte se sami.",
    cta: { label: "Zobrazit pohyby", href: BANK.transparentUrl },
  },
  {
    icon: Gamepad2,
    title: "Zahrajte si Louka Run",
    text: "Podpořit nás můžete i naší vlastní hrou se zvířaty z Louky — na Google Play nebo u nás na webu. A když do sbírky přispějete 200 Kč a víc, napište nám a přístup ke hře od nás dostanete jako poděkování.",
    cta: { label: "Více o hře", href: "/loukarun" },
  },
  {
    icon: Share2,
    title: "Sdílejte sbírku",
    text: "Nemůžete přispět? Pošlete odkaz nechmerust.org/seno dál — každé sdílení nám může přivézt další balík.",
    cta: null,
  },
];

function isExternal(href: string) {
  return href.startsWith("http");
}

export default function Seno() {
  return (
    <>
      <PageHero
        image="/assets/karel.webp"
        imageAlt="Oslík Karel na vyschlé letní louce"
        eyebrow="Aktuální sbírka"
        title="Seno pro Louku"
        subtitle="Seno pro naše stádo každý rok kupujeme — a letos je kvůli suchu vzácné a drahé. Pomozte nám naskládat do stodoly zásobu, která naše zvířata v klidu převeze přes zimu."
      />

      {/* Příběh */}
      <section className="bg-surface py-20 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeader
              eyebrow="Jak to letos je"
              title="Seno je letos vzácné"
              align="left"
            />
          </Reveal>
          <Reveal className="space-y-5 text-lg leading-relaxed text-text-muted">
            <p>
              Letošní rok přinesl nejhorší sucho v historii měření. Seno si
              sami nepřipravujeme — každý rok ho pro naše stádo kupujeme.
              Jenže letos louky nevydaly skoro nikde, sena je málo a shání
              ho celý kraj.
            </p>
            <p>
              Ceny tomu odpovídají. Menší balíky, které kupujeme, aby se
              s nimi dalo hýbat i v jednom člověku, jsme loni brali za
              500&nbsp;Kč. Letos se jejich cena odhaduje na 800 až
              1&nbsp;000&nbsp;Kč — a možná vyšplhá ještě výš. Proto
              nečekáme a zásobu sháníme už teď, dokud seno k mání je.
            </p>
            <p>
              A stádo má pořádný apetit. Naše dvě mladé krávy Avala a Květa
              spořádají každá kolem 15&nbsp;kilo sena denně, oslík Karel
              dalších deset. K tomu osm ovcí a dvě letošní jehňátka, muflon
              Yakul, prasátka — a něco málo si uzobnou i králíci. Přes zimu,
              kdy pastva nedá nic, jede všechno ze stodoly.
            </p>
            <p>
              Loni jste nám se senem pomohli a zvládli jsme to. Letos se
              připravujeme s předstihem a vybíráme <strong className="text-text">100&nbsp;000&nbsp;Kč</strong> —
              to je při letošních cenách zimní zásoba zhruba 125 balíků pro
              celé stádo. Každá koruna půjde přes transparentní účet přímo
              na seno.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Cíl sbírky */}
      <section className="bg-surface-alt py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Cíl sbírky"
              title="Vybíráme na zimní zásobu sena"
              description="Ukazatel aktualizujeme ručně podle pohybů na transparentním účtu."
            />
          </Reveal>
          <Reveal className="mx-auto max-w-2xl rounded-lg border border-border bg-surface p-8 shadow-soft">
            <HayMeter
              goal={SENO_CAMPAIGN.goal}
              raised={SENO_CAMPAIGN.raised}
              updatedAt={SENO_CAMPAIGN.updatedAt}
            />
          </Reveal>
        </Container>
      </section>

      {/* Jak pomoci */}
      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Jak pomoci"
              title="Přispějte na seno"
              description="Nejrychlejší je QR platba — namiřte na kód bankovní aplikaci a částku zvolte podle svých možností."
            />
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal className="flex flex-col items-center rounded-lg border border-border bg-surface-alt p-8 shadow-soft">
              <Image
                src="/assets/seno-qr.png"
                alt={`QR platba na transparentní účet ${SITE.name}, variabilní symbol ${SENO_CAMPAIGN.variableSymbol}`}
                width={240}
                height={240}
                className="h-56 w-56 rounded-md bg-white object-contain p-3 shadow-soft"
              />
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {tips.map((t) => (
                  <span
                    key={t.amount}
                    className="rounded-pill border border-border bg-surface px-4 py-1.5 text-sm text-text"
                  >
                    <strong className="font-semibold text-moss-deep">{t.amount}</strong> = {t.covers}
                  </span>
                ))}
              </div>
              <dl className="mt-6 w-full max-w-md space-y-2 text-sm text-text">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <dt className="text-text-muted">Číslo účtu</dt>
                  <dd className="flex items-center gap-3 font-medium">
                    {BANK.account} <CopyButton value="2002645872/2010" />
                  </dd>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <dt className="text-text-muted">IBAN</dt>
                  <dd className="flex items-center gap-3 font-medium">
                    {BANK.iban} <CopyButton value={BANK.iban.replace(/\s/g, "")} />
                  </dd>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <dt className="text-text-muted">Variabilní symbol</dt>
                  <dd className="flex items-center gap-3 font-medium">
                    {SENO_CAMPAIGN.variableSymbol}{" "}
                    <CopyButton value={SENO_CAMPAIGN.variableSymbol} />
                  </dd>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <dt className="text-text-muted">Zpráva pro příjemce</dt>
                  <dd className="font-medium">{SENO_CAMPAIGN.message}</dd>
                </div>
              </dl>
            </Reveal>
            <div className="flex flex-col gap-6">
              {otherWays.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.06} className="flex-1">
                  <article className="flex h-full flex-col rounded-lg border border-border bg-surface p-7 shadow-soft transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lift">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-pill bg-moss/10 p-3 text-moss">
                      <c.icon size={24} aria-hidden />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-moss-deep">{c.title}</h3>
                    <p className="mb-5 mt-2 text-text-muted">{c.text}</p>
                    {c.cta ? (
                      isExternal(c.cta.href) ? (
                        <a
                          href={c.cta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto inline-flex w-fit items-center rounded-pill bg-moss px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-moss-deep"
                        >
                          {c.cta.label}
                        </a>
                      ) : (
                        <Link
                          href={c.cta.href}
                          className="mt-auto inline-flex w-fit items-center rounded-pill bg-moss px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-moss-deep"
                        >
                          {c.cta.label}
                        </Link>
                      )
                    ) : null}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <SocialSection tone="alt" />
    </>
  );
}
