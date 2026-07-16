import type { Metadata } from "next";
import { Landmark, HeartHandshake, Share2, Gamepad2 } from "lucide-react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { SocialSection } from "@/components/SocialSection";
import { HayMeter } from "@/components/HayMeter";
import { BANK } from "@/lib/site";
import { SENO_CAMPAIGN } from "@/lib/campaign";
import { PaymentPanel, type PaymentTip } from "./PaymentPanel";
import { SupportCard, type SupportWay } from "./SupportCard";
import { SenoKarelProvider } from "./karel/SenoKarelProvider";
import { KarelSwap } from "./karel/KarelSwap";

export const metadata: Metadata = {
  title: "Seno pro Louku",
  description:
    "Seno je letos kvůli extrémnímu suchu vzácné a drahé. Pomozte nám vybrat 100 000 Kč na zimní zásobu pro zvířata z Louky — každých 800 Kč je jeden balík.",
  alternates: { canonical: "/seno" },
  openGraph: {
    images: ["/assets/karel.webp"],
  },
};

const tips: PaymentTip[] = [
  { amount: "400 Kč", covers: "půl balíku sena" },
  { amount: "800 Kč", covers: "celý balík sena" },
  { amount: "1 600 Kč", covers: "dva balíky sena" },
];

const otherWays: SupportWay[] = [
  {
    icon: HeartHandshake,
    title: "Darujme.cz",
    text: "Nechcete skenovat QR kód? Přispějte platební kartou nebo převodem přes ověřený portál Darujme.cz.",
    cta: { label: "Darovat online", href: "https://www.darujme.cz/projekt/1208852" },
    reactKey: "darujme",
  },
  {
    icon: Landmark,
    title: "Transparentní účet",
    text: "Každou korunu sbírky vidíte. Pohyby na našem účtu u Fio banky jsou veřejné — přesvědčte se sami.",
    cta: { label: "Zobrazit pohyby", href: BANK.transparentUrl },
    reactKey: "transparentni",
  },
  {
    icon: Gamepad2,
    title: "Zahrajte si Louka Run",
    text: "Podpořit nás můžete i naší vlastní hrou se zvířaty z Louky — na Google Play nebo u nás na webu. A když do sbírky přispějete 200 Kč a víc, napište nám a přístup ke hře od nás dostanete jako poděkování.",
    cta: { label: "Více o hře", href: "/loukarun" },
    reactKey: "hra",
  },
  {
    icon: Share2,
    title: "Sdílejte sbírku",
    text: "Nemůžete přispět? Pošlete odkaz nechmerust.org/seno dál — každé sdílení nám může přivézt další balík.",
    cta: null,
    share: true,
    reactKey: "share",
  },
];

export default function Seno() {
  return (
    <SenoKarelProvider>
      <KarelSwap id="hero">
        <PageHero
          image="/assets/karel.webp"
          imageAlt="Oslík Karel na vyschlé letní louce"
          eyebrow="Aktuální sbírka"
          title="Seno pro Louku"
          subtitle="Seno pro naše stádo každý rok kupujeme — a letos je kvůli suchu vzácné a drahé. Pomozte nám naskládat do stodoly zásobu, která naše zvířata v klidu převeze přes zimu."
        />
      </KarelSwap>

      {/* Příběh */}
      <section className="bg-surface py-20 sm:py-24">
        <Container className="max-w-3xl">
          <KarelSwap id="story-header">
            <Reveal>
              <SectionHeader
                eyebrow="Jak to letos je"
                title="Seno je letos vzácné"
                align="left"
              />
            </Reveal>
          </KarelSwap>
          <KarelSwap id="story-text">
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
          </KarelSwap>
        </Container>
      </section>

      {/* Cíl sbírky */}
      <section className="bg-surface-alt py-20 sm:py-24">
        <Container>
          <KarelSwap id="meter-header">
            <Reveal>
              <SectionHeader
                eyebrow="Cíl sbírky"
                title="Vybíráme na zimní zásobu sena"
                description="Ukazatel aktualizujeme ručně podle pohybů na transparentním účtu."
              />
            </Reveal>
          </KarelSwap>
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
          <KarelSwap id="payment-header">
            <Reveal>
              <SectionHeader
                eyebrow="Jak pomoci"
                title="Přispějte na seno"
                description="Nejrychlejší je QR platba — namiřte na kód bankovní aplikaci a částku zvolte podle svých možností."
              />
            </Reveal>
          </KarelSwap>
          <div className="grid gap-6 lg:grid-cols-2">
            <KarelSwap id="payment-card">
              <Reveal>
                <PaymentPanel tips={tips} />
              </Reveal>
            </KarelSwap>
            <KarelSwap id="ways">
              <div className="flex flex-col gap-6">
                {otherWays.map((way, i) => (
                  <Reveal key={way.title} delay={i * 0.06} className="flex-1">
                    <SupportCard way={way} />
                  </Reveal>
                ))}
              </div>
            </KarelSwap>
          </div>
        </Container>
      </section>

      <SocialSection tone="alt" />
    </SenoKarelProvider>
  );
}
