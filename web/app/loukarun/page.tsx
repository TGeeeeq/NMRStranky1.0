import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { SocialSection } from "@/components/SocialSection";
import { GooglePlayIcon } from "@/components/BrandIcons";
import { BANK, LOUKARUN } from "@/lib/site";
import { GAME_COOKIE, unsealGameAccess } from "@/lib/game-access";
import { GateForm } from "./GateForm";
import { HeroScene } from "./HeroScene";
import { KarelGuide } from "./KarelGuide";
import { CharacterCard, type Character } from "./CharacterCard";
import { WorldScenes } from "./WorldScene";
import { RunnerSprite } from "./RunnerSprite";
import { getLocale } from "@/lib/i18n.server";
import { pick, type Locale } from "@/lib/i18n";
import "./loukarun.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, {
      cs: "LoukaRun — hra ze skutečné Louky",
      en: "Louka Run — a game from the real Meadow",
    }),
    description: pick(locale, {
      cs: "Endless runner se zachráněnými zvířaty z azylu Nech mě růst. Běhej za Karla, Pogo, Avalu, Flíčka, Yakula nebo Květu. Přístup ke hře získáš darem pro útulek.",
      en: "An endless runner with rescued animals from the Nech mě růst sanctuary. Run as Karel, Pogo, Avala, Flíček, Yakul or Květa. Get access to the game with a donation to the shelter.",
    }),
    alternates: { canonical: "/loukarun" },
  };
}

export const dynamic = "force-dynamic";

const GOOGLE_PLAY_URL = LOUKARUN.googlePlay;

type LocalizedCharacter = {
  id: Character["id"];
  image: string;
  name: Record<Locale, string>;
  tagline: Record<Locale, string>;
  perk: Record<Locale, string>;
};

const characters: LocalizedCharacter[] = [
  {
    id: "karel",
    image: "/assets/karel.webp",
    name: { cs: "Osel Karel", en: "Karel the donkey" },
    tagline: {
      cs: "Hravý osel s velkým srdcem a lehce kousavou povahou.",
      en: "A playful donkey with a big heart and a slightly nippy streak.",
    },
    perk: {
      cs: "Vyvážený běžec a srdce azylu. S Karlem začíná každý běh — a jeho škola běhu tě všechno naučí.",
      en: "A well-balanced runner and the heart of the sanctuary. Every run starts with Karel — and his running school teaches you everything.",
    },
  },
  {
    id: "pogo",
    image: "/assets/pogo3.webp",
    name: { cs: "Ovečka Pogo", en: "Pogo the sheep" },
    tagline: {
      cs: "Energická ovčí kamarádka, která skáče jako na pružině.",
      en: "An energetic sheep friend who bounces like she's on springs.",
    },
    perk: {
      cs: "Vlněný polštář — náraz jí ubere jen půlku energie a skáče o kousek výš.",
      en: "Woolly cushion — a hit costs her only half the energy, and she jumps a little higher.",
    },
  },
  {
    id: "avala",
    image: "/assets/avala8.webp",
    name: { cs: "Kráva Avala", en: "Avala the cow" },
    tagline: {
      cs: "Mazlivá kravička, která nejvíc ze všeho miluje běhání po louce.",
      en: "A cuddly cow who loves nothing more than running across the meadow.",
    },
    perk: {
      cs: "Šťastná kopyta — sbírá o polovinu víc mincí a zlaté mrkve jí dají dvakrát tolik energie.",
      en: "Lucky hooves — she collects half again as many coins, and golden carrots give her twice the energy.",
    },
  },
  {
    id: "flicek",
    image: "/assets/flicek2.webp",
    name: { cs: "Prasátko Flíček", en: "Flíček the piglet" },
    tagline: {
      cs: "Prasátko, které si nejvíc užívá drbání na bříšku.",
      en: "A piglet who enjoys nothing more than a belly rub.",
    },
    perk: {
      cs: "Rypáček-magnet — přitahuje mrkve a mince z dálky.",
      en: "Magnet snout — pulls in carrots and coins from afar.",
    },
  },
  {
    id: "yakul",
    image: "/assets/yakul3.webp",
    name: { cs: "Muflon Yakul", en: "Yakul the mouflon" },
    tagline: {
      cs: "Rozverný mladík, který právě zjišťuje, k čemu má rohy.",
      en: "A frisky youngster just figuring out what his horns are for.",
    },
    perk: {
      cs: "Beranidlo — pětkrát za běh prorazí překážku bez ztráty energie.",
      en: "Battering ram — five times per run he smashes through an obstacle without losing energy.",
    },
  },
  {
    id: "kveta",
    image: "/assets/kveta8.webp",
    name: { cs: "Kráva Květa", en: "Květa the cow" },
    tagline: {
      cs: "Klidná a tichá duše, věrná parťačka Avaly.",
      en: "A calm, quiet soul and Avala's loyal companion.",
    },
    perk: {
      cs: "Klid v duši — energie jí ubývá o čtvrtinu pomaleji.",
      en: "Inner calm — her energy drains a quarter more slowly.",
    },
  },
];

export default async function LoukaRunPage({
  searchParams,
}: {
  searchParams: Promise<{ pristup?: string }>;
}) {
  const { pristup } = await searchParams;
  const locale = await getLocale();
  const seal = (await cookies()).get(GAME_COOKIE)?.value;
  const hasAccess = !!(seal && (await unsealGameAccess(seal)));

  return (
    <>
      <HeroScene hasAccess={hasAccess} />

      {/* oznámení — hra je venku na Google Play */}
      <section className="overflow-x-clip bg-moss-deep">
        <Container>
          <div className="flex flex-col items-center justify-center gap-4 py-5 text-center sm:flex-row sm:gap-6">
            <p className="text-base font-semibold text-cream sm:text-lg">
              {pick(locale, {
                cs: "🎉 Je to venku! Louka Run si teď stáhneš jako aplikaci pro Android.",
                en: "🎉 It's out! You can now download Louka Run as an Android app.",
              })}
            </p>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2.5 rounded-pill bg-cream px-6 py-2.5 text-sm font-semibold text-moss-deep shadow-md transition hover:-translate-y-0.5 hover:bg-white"
            >
              <GooglePlayIcon className="h-4 w-4" />
              {pick(locale, { cs: "Stáhnout na Google Play", en: "Download on Google Play" })}
            </a>
          </div>
        </Container>
      </section>

      {/* brána / spuštění */}
      <section id="hrat" className="scroll-mt-24 overflow-x-clip bg-surface-alt py-16 sm:py-20">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            {hasAccess ? (
              <>
                <h2 className="font-serif text-3xl font-semibold text-moss-deep">
                  {pick(locale, { cs: "Vítej zpátky na Louce!", en: "Welcome back to the Meadow!" })}
                </h2>
                <p className="mt-3 text-text-muted">
                  {pick(locale, {
                    cs: "Tvůj přístup platí. Ať běží mrkve samy do kapsy.",
                    en: "Your access is active. May the carrots leap right into your pocket.",
                  })}
                </p>
                <a
                  href="/loukarun/app/index.html"
                  className="mt-6 inline-block rounded-pill bg-moss px-10 py-4 text-lg font-semibold text-cream transition hover:bg-moss-deep"
                >
                  ▶ {pick(locale, { cs: "Spustit hru", en: "Launch the game" })}
                </a>
              </>
            ) : (
              <>
                <h2 className="font-serif text-3xl font-semibold text-moss-deep">
                  {pick(locale, { cs: "Hra za dar zvířatům", en: "A game for a donation to the animals" })}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-text-muted">
                  {pick(locale, {
                    cs: (
                      <>
                        Louka Run už je venku jako{" "}
                        <a
                          className="text-moss underline"
                          href={GOOGLE_PLAY_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          aplikace na Google Play
                        </a>
                        {" "}— u nás na webu ji ale získáš
                        na pozvání. Podpoř azyl <strong>darem od 200 Kč</strong> a my ti
                        pošleme pozvánkový kód. Hra pak běží v prohlížeči na všech tvých
                        zařízeních a každá koruna jde na krmení a péči o zvířata, která
                        ve hře potkáš.
                      </>
                    ),
                    en: (
                      <>
                        Louka Run is already out as an{" "}
                        <a
                          className="text-moss underline"
                          href={GOOGLE_PLAY_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          app on Google Play
                        </a>
                        {" "}— but here on our site you get it
                        by invitation. Support the sanctuary with a{" "}
                        <strong>donation from 200 Kč</strong> and we'll send you an
                        invite code. The game then runs in your browser on all your
                        devices, and every koruna goes toward feeding and caring for the
                        animals you meet in the game.
                      </>
                    ),
                  })}
                </p>

                {/* dřevěná cedule s návodem */}
                <div className="relative mx-auto mt-8 max-w-md">
                  <div className="rotate-[-0.6deg] rounded-lg bg-gradient-to-b from-[#8a6a4f] to-[#6f5540] p-2.5 shadow-md">
                    <span aria-hidden className="absolute left-4 top-4 h-2 w-2 rounded-full bg-[#3d2e1e] shadow-inner" />
                    <span aria-hidden className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[#3d2e1e] shadow-inner" />
                    <div className="rounded-md border border-[#5c4534] bg-cream p-5 text-left text-sm">
                      <p className="font-serif text-base font-semibold text-moss-deep">
                        {pick(locale, { cs: "Jak získat kód:", en: "How to get a code:" })}
                      </p>
                      <ol className="mt-2 list-decimal space-y-1 pl-5 text-text-muted">
                        {pick(locale, {
                          cs: (
                            <>
                              <li>Pošli dar aspoň 200 Kč na účet <strong className="whitespace-nowrap">{BANK.account}</strong>.</li>
                              <li>Napiš nám na <a className="text-moss underline" href="mailto:info@nechmerust.org?subject=Louka%20Run%20—%20kód">info@nechmerust.org</a>.</li>
                              <li>Obratem ti pošleme kód — platí napořád, na všech tvých zařízeních.</li>
                            </>
                          ),
                          en: (
                            <>
                              <li>Send a donation of at least 200 Kč to account <strong className="whitespace-nowrap">{BANK.account}</strong>.</li>
                              <li>Write to us at <a className="text-moss underline" href="mailto:info@nechmerust.org?subject=Louka%20Run%20—%20kód">info@nechmerust.org</a>.</li>
                              <li>We'll send you a code right back — it lasts forever, on all your devices.</li>
                            </>
                          ),
                        })}
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <GateForm highlight={pristup === "kod"} />
                </div>
              </>
            )}
          </Reveal>
          <KarelGuide section="gate" className="mx-auto mt-10 max-w-2xl" />
        </Container>
      </section>

      {/* postavy */}
      <section id="zvirata" className="scroll-mt-24 overflow-x-clip py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow={pick(locale, { cs: "Běžci z Louky", en: "Runners from the Meadow" })}
            title={pick(locale, { cs: "Všichni jsou skuteční", en: "They're all real" })}
            description={pick(locale, {
              cs: "Každá postava ve hře žije v našem azylu. Schopnosti mají podle své opravdové povahy. Otoč si kartu a porovnej sprite se skutečností.",
              en: "Every character in the game lives at our sanctuary. Their abilities reflect their real personalities. Flip a card and compare the sprite with reality.",
            })}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {characters.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.06} className="h-full">
                <CharacterCard
                  character={{
                    id: c.id,
                    image: c.image,
                    name: pick(locale, c.name),
                    tagline: pick(locale, c.tagline),
                    perk: pick(locale, c.perk),
                  }}
                />
              </Reveal>
            ))}
          </div>
          <KarelGuide section="characters" align="right" className="mt-10" />
          <Reveal className="mt-6 text-center">
            <Link href="/zvireci-obyvatele" className="text-sm font-medium text-moss underline-offset-4 hover:underline">
              {pick(locale, { cs: "Poznej jejich skutečné příběhy →", en: "Discover their real stories →" })}
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* svět hry */}
      <section className="overflow-x-clip bg-moss-deep py-16 text-cream sm:py-20">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-semibold text-cream">
              {pick(locale, { cs: "Šest světů, žádná prohra", en: "Six worlds, no losing" })}
            </h2>
            <p className="mt-4 text-cream/90">
              {pick(locale, {
                cs: "Poběžíš rozkvetlou loukou i hvězdnou nocí. A protože jsme azyl, nikdy neprohráváš — každý běh končí dobře, veselou historkou tvého běžce.",
                en: "You'll run through a meadow in bloom and a starry night. And because we're a sanctuary, you never lose — every run ends well, with a cheerful tale about your runner.",
              })}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <WorldScenes />
          </Reveal>
          <KarelGuide section="worlds" className="mt-10" />
        </Container>
      </section>

      {/* Google Play — hra je venku */}
      <section className="overflow-x-clip py-16 sm:py-20">
        <Container>
          <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-10 rounded-lg border border-border bg-gradient-to-b from-[#8ed4f7]/20 to-surface p-8 sm:flex-row sm:p-12">
            {/* mockup telefonu */}
            <div aria-hidden className="shrink-0">
              <div className="relative w-44 rounded-[2rem] border-[7px] border-[#2b2b2b] bg-[#2b2b2b] shadow-xl">
                <div className="absolute left-1/2 top-1.5 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-[#1a1a1a]" />
                <div className="relative overflow-hidden rounded-[1.55rem]">
                  <div className="relative flex aspect-[9/17] items-end justify-center overflow-hidden bg-gradient-to-b from-[#8ed4f7] via-[#a8e0f9] to-[#c8ecfb]">
                    <svg aria-hidden className="absolute bottom-0 left-0 w-full" viewBox="0 0 200 90" preserveAspectRatio="none">
                      <path d="M0 40 Q 50 22 100 34 T 200 30 V90 H0 Z" fill="#6b8e6e" opacity="0.6" />
                      <path d="M0 58 Q 60 42 120 54 T 200 52 V90 H0 Z" fill="#4a7c4e" />
                      <path d="M0 74 Q 80 62 160 72 T 200 70 V90 H0 Z" fill="#2d5a3d" />
                    </svg>
                    <div className="is-running relative z-10 mb-3">
                      <RunnerSprite id="karel" className="h-14 w-auto" />
                    </div>
                    <p className="absolute left-0 right-0 top-6 text-center font-serif text-lg font-bold text-moss-deep">
                      Louka Run
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <p className="inline-flex items-center gap-2 rounded-pill bg-moss/10 px-4 py-1.5 text-sm font-semibold text-moss-deep">
                {pick(locale, { cs: "🎉 Novinka", en: "🎉 New" })}
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold text-moss-deep sm:text-3xl">
                {pick(locale, { cs: "Už je venku na Google Play!", en: "Now out on Google Play!" })}
              </h2>
              <p className="mt-4 text-text-muted">
                {pick(locale, {
                  cs: "Plná verze pro Android je oficiálně v obchodě — bez reklam, bez sledování a bez nákupů ve hře. Celý výtěžek jde zvířatům. Verze pro iPhone (App Store) bude následovat, schvalování tam trvá déle.",
                  en: "The full Android version is officially in the store — no ads, no tracking and no in-game purchases. All proceeds go to the animals. An iPhone version (App Store) will follow; approval there takes longer.",
                })}
              </p>
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-3 rounded-lg bg-[#2b2b2b] px-6 py-3 text-cream shadow-md transition hover:-translate-y-0.5 hover:bg-black"
              >
                <GooglePlayIcon className="h-6 w-6" />
                <span className="text-left leading-tight">
                  <span className="block text-[0.65rem] uppercase tracking-wide opacity-80">{pick(locale, { cs: "Stáhnout na", en: "Download on" })}</span>
                  <span className="block text-lg font-semibold">Google Play</span>
                </span>
              </a>
              <KarelGuide section="play" className="mt-8" />
            </div>
          </Reveal>
        </Container>
      </section>

      <SocialSection />
    </>
  );
}
