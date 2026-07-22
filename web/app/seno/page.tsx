import type { Metadata } from "next";
import { redirect } from "next/navigation";
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
import { getLocale } from "@/lib/i18n.server";
import { pick } from "@/lib/i18n";

/** Stránka je dočasně stažená z produkce — texty sbírky se budou překopávat.
 *  Až bude nová verze hotová, smaž `redirect("/")` v komponentě níže a vrať
 *  odkazy: CampaignBanner v app/layout.tsx, patička, karta na
 *  /jak-se-zapojit a /seno v app/sitemap.ts. */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, { cs: "Seno pro Louku", en: "Hay for the Meadow" }),
    description: pick(locale, {
      cs: "Seno je letos kvůli extrémnímu suchu vzácné a drahé. Pomozte nám vybrat 100 000 Kč na zimní zásobu pro zvířata z Louky — každých 800 Kč je jeden balík.",
      en: "This year’s extreme drought has made hay scarce and expensive. Help us raise 100,000 Kč for the winter supply for the Meadow’s animals — every 800 Kč is one bale.",
    }),
    alternates: { canonical: "/seno" },
    robots: { index: false, follow: false },
    openGraph: {
      images: ["/assets/karel.webp"],
    },
  };
}

export default async function Seno() {
  const locale = await getLocale();

  const tips: PaymentTip[] = [
    { amount: "400 Kč", covers: pick(locale, { cs: "půl balíku sena", en: "half a bale of hay" }) },
    { amount: "800 Kč", covers: pick(locale, { cs: "celý balík sena", en: "a whole bale of hay" }) },
    { amount: "1 600 Kč", covers: pick(locale, { cs: "dva balíky sena", en: "two bales of hay" }) },
  ];

  const otherWays: SupportWay[] = [
    {
      icon: HeartHandshake,
      title: "Darujme.cz",
      text: pick(locale, {
        cs: "Nechcete skenovat QR kód? Přispějte platební kartou nebo převodem přes ověřený portál Darujme.cz.",
        en: "Don’t want to scan a QR code? Donate by card or bank transfer through the trusted Darujme.cz portal.",
      }),
      cta: {
        label: pick(locale, { cs: "Darovat online", en: "Donate online" }),
        href: "https://www.darujme.cz/projekt/1208852",
      },
      reactKey: "darujme",
    },
    {
      icon: Landmark,
      title: pick(locale, { cs: "Transparentní účet", en: "Transparent account" }),
      text: pick(locale, {
        cs: "Každou korunu sbírky vidíte. Pohyby na našem účtu u Fio banky jsou veřejné — přesvědčte se sami.",
        en: "You can see every koruna of the fundraiser. The transactions on our Fio bank account are public — see for yourself.",
      }),
      cta: { label: pick(locale, { cs: "Zobrazit pohyby", en: "View transactions" }), href: BANK.transparentUrl },
      reactKey: "transparentni",
    },
    {
      icon: Gamepad2,
      title: pick(locale, { cs: "Zahrajte si Louka Run", en: "Play Louka Run" }),
      text: pick(locale, {
        cs: "Podpořit nás můžete i naší vlastní hrou se zvířaty z Louky — na Google Play nebo u nás na webu. A když do sbírky přispějete 200 Kč a víc, napište nám a přístup ke hře od nás dostanete jako poděkování.",
        en: "You can support us through our own game featuring the Meadow’s animals — on Google Play or here on the website. And if you donate 200 Kč or more, write to us and we’ll give you access to the game as a thank-you.",
      }),
      cta: { label: pick(locale, { cs: "Více o hře", en: "More about the game" }), href: "/loukarun" },
      reactKey: "hra",
    },
    {
      icon: Share2,
      title: pick(locale, { cs: "Sdílejte sbírku", en: "Share the fundraiser" }),
      text: pick(locale, {
        cs: "Nemůžete přispět? Pošlete odkaz nechmerust.org/seno dál — každé sdílení nám může přivézt další balík.",
        en: "Can’t donate? Pass the link nechmerust.org/seno along — every share could bring us another bale.",
      }),
      cta: null,
      share: true,
      reactKey: "share",
    },
  ];

  redirect("/");
  return (
    <SenoKarelProvider>
      <KarelSwap id="hero">
        <PageHero
          image="/assets/karel.webp"
          imageAlt={pick(locale, {
            cs: "Oslík Karel na vyschlé letní louce",
            en: "Karel the little donkey on a parched summer meadow",
          })}
          eyebrow={pick(locale, { cs: "Aktuální sbírka", en: "Current fundraiser" })}
          title={pick(locale, { cs: "Seno pro Louku", en: "Hay for the Meadow" })}
          subtitle={pick(locale, {
            cs: "Seno pro naše stádo každý rok kupujeme — a letos je kvůli suchu vzácné a drahé. Pomozte nám naskládat do stodoly zásobu, která naše zvířata v klidu převeze přes zimu.",
            en: "We buy hay for our herd every year — and this year the drought has made it scarce and expensive. Help us stack up a supply in the barn that will carry our animals calmly through the winter.",
          })}
        />
      </KarelSwap>

      {/* Příběh */}
      <section className="bg-surface py-20 sm:py-24">
        <Container className="max-w-3xl">
          <KarelSwap id="story-header">
            <Reveal>
              <SectionHeader
                eyebrow={pick(locale, { cs: "Jak to letos je", en: "How things stand this year" })}
                title={pick(locale, { cs: "Seno je letos vzácné", en: "Hay is scarce this year" })}
                align="left"
              />
            </Reveal>
          </KarelSwap>
          <KarelSwap id="story-text">
            <Reveal className="space-y-5 text-lg leading-relaxed text-text-muted">
              {locale === "en" ? (
                <>
                  <p>
                    This year brought the worst drought since records began. We
                    don’t make our own hay — every year we buy it for our herd.
                    But this year the meadows yielded almost nothing anywhere,
                    hay is in short supply and the whole region is after it.
                  </p>
                  <p>
                    Prices reflect that. The smaller bales we buy, so that one
                    person can still move them, cost us 500&nbsp;Kč last year.
                    This year their price is estimated at 800 to
                    1&nbsp;000&nbsp;Kč — and it may climb even higher. That’s why
                    we aren’t waiting and are sourcing our supply now, while hay
                    is still to be had.
                  </p>
                  <p>
                    And the herd has quite an appetite. Our two young cows Avala
                    and Květa each put away around 15&nbsp;kilos of hay a day,
                    and Karel the donkey another ten. On top of that, eight
                    sheep and two lambs born this year, Yakul the mouflon, the
                    pigs — and even the rabbits nibble a little. Through the
                    winter, when the pasture gives nothing, it all comes from the
                    barn.
                  </p>
                  <p>
                    Last year you helped us with the hay and we managed. This
                    year we’re preparing ahead of time and raising <strong className="text-text">100&nbsp;000&nbsp;Kč</strong> —
                    at this year’s prices that’s a winter supply of roughly 125
                    bales for the whole herd. Every koruna will go through the
                    transparent account straight to hay.
                  </p>
                </>
              ) : (
                <>
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
                </>
              )}
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
                eyebrow={pick(locale, { cs: "Cíl sbírky", en: "Fundraiser goal" })}
                title={pick(locale, {
                  cs: "Vybíráme na zimní zásobu sena",
                  en: "Raising funds for the winter hay supply",
                })}
                description={pick(locale, {
                  cs: "Ukazatel aktualizujeme ručně podle pohybů na transparentním účtu.",
                  en: "We update the meter manually according to the transactions on the transparent account.",
                })}
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
                eyebrow={pick(locale, { cs: "Jak pomoci", en: "How to help" })}
                title={pick(locale, { cs: "Přispějte na seno", en: "Contribute to the hay" })}
                description={pick(locale, {
                  cs: "Nejrychlejší je QR platba — namiřte na kód bankovní aplikaci a částku zvolte podle svých možností.",
                  en: "The quickest way is a QR payment — point your banking app at the code and choose an amount that suits you.",
                })}
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
