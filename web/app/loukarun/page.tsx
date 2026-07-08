import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { SocialSection } from "@/components/SocialSection";
import { BANK } from "@/lib/site";
import { GAME_COOKIE, unsealGameAccess } from "@/lib/game-access";
import { GateForm } from "./GateForm";
import { HeroScene } from "./HeroScene";
import { KarelGuide } from "./KarelGuide";
import { CharacterCard, type Character } from "./CharacterCard";
import { WorldScenes } from "./WorldScene";
import { RunnerSprite } from "./RunnerSprite";
import "./loukarun.css";

export const metadata: Metadata = {
  title: "Louka Run — hra ze skutečné louky",
  description:
    "Endless runner se zachráněnými zvířaty z azylu Nech mě růst. Běhej za Karla, Pogo, Avalu, Flíčka, Yakula nebo Květu. Přístup ke hře získáš darem pro útulek.",
  alternates: { canonical: "/loukarun" },
};

export const dynamic = "force-dynamic";

const characters: Character[] = [
  {
    id: "karel",
    name: "Osel Karel",
    image: "/assets/karel.webp",
    tagline: "Hravý osel s velkým srdcem a lehce kousavou povahou.",
    perk: "Vyvážený běžec a srdce azylu. S Karlem začíná každý běh — a jeho škola běhu tě všechno naučí.",
  },
  {
    id: "pogo",
    name: "Ovečka Pogo",
    image: "/assets/pogo.webp",
    tagline: "Energická ovčí kamarádka, která skáče jako na pružině.",
    perk: "Vlněný polštář — náraz jí ubere jen půlku energie a skáče o kousek výš.",
  },
  {
    id: "avala",
    name: "Kráva Avala",
    image: "/assets/avala.webp",
    tagline: "Mazlivá kravička, která nejvíc ze všeho miluje běhání po louce.",
    perk: "Šťastná kopyta — sbírá o polovinu víc mincí a zlaté mrkve jí dají dvakrát tolik energie.",
  },
  {
    id: "flicek",
    name: "Prasátko Flíček",
    image: "/assets/flicek.webp",
    tagline: "Prasátko, které si nejvíc užívá drbání na bříšku.",
    perk: "Rypáček-magnet — přitahuje mrkve a mince z dálky.",
  },
  {
    id: "yakul",
    name: "Muflon Yakul",
    image: "/assets/yakul.webp",
    tagline: "Rozverný mladík, který právě zjišťuje, k čemu má rohy.",
    perk: "Beranidlo — pětkrát za běh prorazí překážku bez ztráty energie.",
  },
  {
    id: "kveta",
    name: "Kráva Květa",
    image: "/assets/kveta.webp",
    tagline: "Klidná a tichá duše, věrná parťačka Avaly.",
    perk: "Klid v duši — energie jí ubývá o čtvrtinu pomaleji.",
  },
];

export default async function LoukaRunPage({
  searchParams,
}: {
  searchParams: Promise<{ pristup?: string }>;
}) {
  const { pristup } = await searchParams;
  const seal = (await cookies()).get(GAME_COOKIE)?.value;
  const hasAccess = !!(seal && (await unsealGameAccess(seal)));

  return (
    <>
      <HeroScene hasAccess={hasAccess} />

      {/* brána / spuštění */}
      <section id="hrat" className="scroll-mt-24 overflow-x-clip bg-surface-alt py-16 sm:py-20">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            {hasAccess ? (
              <>
                <h2 className="font-serif text-3xl font-semibold text-moss-deep">Vítej zpátky na Louce!</h2>
                <p className="mt-3 text-text-muted">Tvůj přístup platí. Ať běží mrkve samy do kapsy.</p>
                <a
                  href="/loukarun/app/index.html"
                  className="mt-6 inline-block rounded-pill bg-moss px-10 py-4 text-lg font-semibold text-cream transition hover:bg-moss-deep"
                >
                  ▶ Spustit hru
                </a>
              </>
            ) : (
              <>
                <h2 className="font-serif text-3xl font-semibold text-moss-deep">Hra za dar zvířatům</h2>
                <p className="mx-auto mt-4 max-w-xl text-text-muted">
                  Louka Run není na prodej — je na pozvání. Podpoř azyl{" "}
                  <strong>libovolným darem</strong> a my ti pošleme pozvánkový kód.
                  Každá koruna jde na krmení a péči o zvířata, která ve hře potkáš.
                </p>

                {/* dřevěná cedule s návodem */}
                <div className="relative mx-auto mt-8 max-w-md">
                  <div className="rotate-[-0.6deg] rounded-lg bg-gradient-to-b from-[#8a6a4f] to-[#6f5540] p-2.5 shadow-md">
                    <span aria-hidden className="absolute left-4 top-4 h-2 w-2 rounded-full bg-[#3d2e1e] shadow-inner" />
                    <span aria-hidden className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[#3d2e1e] shadow-inner" />
                    <div className="rounded-md border border-[#5c4534] bg-cream p-5 text-left text-sm">
                      <p className="font-serif text-base font-semibold text-moss-deep">Jak získat kód:</p>
                      <ol className="mt-2 list-decimal space-y-1 pl-5 text-text-muted">
                        <li>Pošli dar na účet <strong className="whitespace-nowrap">{BANK.account}</strong>.</li>
                        <li>Napiš nám na <a className="text-moss underline" href="mailto:info@nechmerust.org?subject=Louka%20Run%20—%20kód">info@nechmerust.org</a>.</li>
                        <li>Obratem ti pošleme kód — platí napořád, na všech tvých zařízeních.</li>
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
            eyebrow="Běžci z Louky"
            title="Všichni jsou skuteční"
            description="Každá postava ve hře žije v našem azylu. Schopnosti mají podle své opravdové povahy. Otoč si kartu a porovnej sprite se skutečností."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {characters.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.06} className="h-full">
                <CharacterCard character={c} />
              </Reveal>
            ))}
          </div>
          <KarelGuide section="characters" align="right" className="mt-10" />
          <Reveal className="mt-6 text-center">
            <Link href="/zvireci-obyvatele" className="text-sm font-medium text-moss underline-offset-4 hover:underline">
              Poznej jejich skutečné příběhy →
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* svět hry */}
      <section className="overflow-x-clip bg-moss-deep py-16 text-cream sm:py-20">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-semibold">Šest světů, žádná prohra</h2>
            <p className="mt-4 text-cream/80">
              Poběžíš rozkvetlou loukou i hvězdnou nocí. A protože jsme azyl, nikdy
              neprohráváš — každý běh končí dobře, veselou historkou tvého běžce.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <WorldScenes />
          </Reveal>
          <KarelGuide section="worlds" className="mt-10" />
        </Container>
      </section>

      {/* Google Play teaser */}
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
              <h2 className="font-serif text-2xl font-semibold text-moss-deep sm:text-3xl">
                Brzy i jako aplikace na Google Play
              </h2>
              <p className="mt-4 text-text-muted">
                Připravujeme plnou verzi pro Android — jednorázově za 150 Kč, bez reklam,
                bez sledování a bez nákupů ve hře. Celý výtěžek jde zvířatům.
              </p>
              <p className="mt-3 text-sm text-text-muted">
                Chceš pomoct s testováním? Napiš nám na{" "}
                <a className="text-moss underline" href="mailto:info@nechmerust.org?subject=Louka%20Run%20—%20testování">info@nechmerust.org</a>.
              </p>
              <KarelGuide section="play" className="mt-8" />
            </div>
          </Reveal>
        </Container>
      </section>

      <SocialSection />
    </>
  );
}
