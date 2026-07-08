import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { SocialSection } from "@/components/SocialSection";
import { BANK } from "@/lib/site";
import { GAME_COOKIE, unsealGameAccess } from "@/lib/game-access";
import { GateForm } from "./GateForm";

export const metadata: Metadata = {
  title: "Louka Run — hra ze skutečné louky",
  description:
    "Endless runner se zachráněnými zvířaty z azylu Nech mě růst. Běhej za Karla, Pogo, Avalu, Flíčka, Yakula nebo Květu. Přístup ke hře získáš darem pro útulek.",
  alternates: { canonical: "/loukarun" },
};

export const dynamic = "force-dynamic";

const characters = [
  { id: "karel", name: "Osel Karel", image: "/assets/karel.webp", perk: "Vyvážený běžec a srdce azylu. S Karlem začíná každý běh — a jeho škola běhu tě všechno naučí." },
  { id: "pogo", name: "Ovečka Pogo", image: "/assets/pogo.webp", perk: "Vlněný polštář — náraz jí ubere jen půlku energie a skáče o kousek výš." },
  { id: "avala", name: "Kráva Avala", image: "/assets/avala.webp", perk: "Šťastná kopyta — sbírá o polovinu víc mincí a zlaté mrkve jí dají dvakrát tolik energie." },
  { id: "flicek", name: "Prasátko Flíček", image: "/assets/flicek.webp", perk: "Rypáček-magnet — přitahuje mrkve a mince z dálky." },
  { id: "yakul", name: "Muflon Yakul", image: "/assets/yakul.webp", perk: "Beranidlo — pětkrát za běh prorazí překážku bez ztráty energie." },
  { id: "kveta", name: "Kráva Květa", image: "/assets/kveta.webp", perk: "Klid v duši — energie jí ubývá o čtvrtinu pomaleji." },
];

const worlds = ["Rozkvetlá louka", "Ovocný sad", "Pohádkový les", "Veselá vesnice", "Zlatá hodinka", "Hvězdná noc"];

/** Procedurální vektorová louka v duchu grafiky hry — žádné sprity, jen cesty. */
function MeadowHero({ hasAccess }: { hasAccess: boolean }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#8ed4f7] via-[#a8e0f9] to-[#c8ecfb]">
      {/* slunce + mraky */}
      <div aria-hidden className="absolute right-[12%] top-10 h-24 w-24 rounded-full bg-[#fff3b0] blur-[2px] sm:h-32 sm:w-32" />
      <svg aria-hidden className="absolute left-[6%] top-16 w-40 opacity-90" viewBox="0 0 160 48" fill="#ffffff">
        <ellipse cx="40" cy="30" rx="40" ry="16" /><ellipse cx="85" cy="22" rx="34" ry="14" /><ellipse cx="120" cy="32" rx="38" ry="14" />
      </svg>
      <svg aria-hidden className="absolute right-[28%] top-32 w-28 opacity-70" viewBox="0 0 160 48" fill="#ffffff">
        <ellipse cx="50" cy="28" rx="44" ry="15" /><ellipse cx="100" cy="24" rx="36" ry="13" />
      </svg>

      <Container className="relative z-10 flex flex-col items-center pb-56 pt-20 text-center sm:pb-64 sm:pt-24">
        <Reveal>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-moss-deep/70">
            Hra azylu Nech mě růst
          </p>
          <h1 className="font-serif text-6xl font-bold leading-none text-moss-deep drop-shadow-[0_4px_16px_rgba(255,255,255,0.5)] sm:text-7xl lg:text-8xl">
            Louka&nbsp;Run
            <svg aria-hidden viewBox="0 0 24 34" className="ml-2 inline-block h-[0.55em] w-auto -rotate-12 align-baseline">
              <path d="M4 8 L12 32 L20 8 Z" fill="#e8833a" />
              <path d="M7 6 Q9 -2 12 5 Q14 -3 17 6" stroke="#4a7c4e" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-balance text-lg font-medium text-moss-deep sm:text-xl">
            Endless runner ze skutečné louky. Běhej, skákej a sbírej mrkve za šest
            zachráněných zvířat z našeho azylu.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {hasAccess ? (
            <a
              href="/loukarun/app/index.html"
              className="rounded-pill bg-moss px-10 py-4 text-lg font-semibold text-cream shadow-lg transition hover:-translate-y-0.5 hover:bg-moss-deep"
            >
              ▶ Hrát
            </a>
          ) : (
            <a
              href="#hrat"
              className="rounded-pill bg-moss px-10 py-4 text-lg font-semibold text-cream shadow-lg transition hover:-translate-y-0.5 hover:bg-moss-deep"
            >
              ▶ Chci hrát
            </a>
          )}
          <a href="#zvirata" className="rounded-pill border-2 border-moss-deep/30 bg-white/50 px-8 py-4 text-lg font-semibold text-moss-deep backdrop-blur transition hover:bg-white/80">
            Poznej běžce
          </a>
        </Reveal>
      </Container>

      {/* vrstvené kopce jako ve hře */}
      <svg aria-hidden className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 220" preserveAspectRatio="none">
        <path d="M0 120 Q 240 60 480 110 T 960 100 T 1440 90 V220 H0 Z" fill="#6b8e6e" opacity="0.55" />
        <path d="M0 150 Q 300 90 620 140 T 1440 130 V220 H0 Z" fill="#4a7c4e" opacity="0.75" />
        <path d="M0 180 Q 360 130 760 175 T 1440 165 V220 H0 Z" fill="#2d5a3d" />
        {/* mrkvičky na louce */}
        <g transform="translate(200 186) rotate(8)"><path d="M0 0 L5 16 L10 0 Z" fill="#e8833a" /><path d="M2 -2 Q5 -8 8 -2" stroke="#4a7c4e" strokeWidth="2.4" fill="none" /></g>
        <g transform="translate(1150 190) rotate(-6)"><path d="M0 0 L5 16 L10 0 Z" fill="#e8833a" /><path d="M2 -2 Q5 -8 8 -2" stroke="#4a7c4e" strokeWidth="2.4" fill="none" /></g>
        <g transform="translate(690 195) rotate(3)"><path d="M0 0 L4 13 L8 0 Z" fill="#e8833a" /><path d="M1.5 -2 Q4 -7 6.5 -2" stroke="#4a7c4e" strokeWidth="2" fill="none" /></g>
      </svg>
    </section>
  );
}

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
      <MeadowHero hasAccess={hasAccess} />

      {/* brána / spuštění */}
      <section id="hrat" className="scroll-mt-24 bg-surface-alt py-16 sm:py-20">
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
                <div className="mx-auto mt-6 max-w-md rounded-lg border border-border bg-surface p-5 text-left text-sm">
                  <p className="font-medium text-moss-deep">Jak získat kód:</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-text-muted">
                    <li>Pošli dar na účet <strong className="whitespace-nowrap">{BANK.account}</strong>.</li>
                    <li>Napiš nám na <a className="text-moss underline" href="mailto:info@nechmerust.org?subject=Louka%20Run%20—%20kód">info@nechmerust.org</a>.</li>
                    <li>Obratem ti pošleme kód — platí napořád, na všech tvých zařízeních.</li>
                  </ol>
                </div>
                <div className="mt-8">
                  <GateForm highlight={pristup === "kod"} />
                </div>
              </>
            )}
          </Reveal>
        </Container>
      </section>

      {/* postavy */}
      <section id="zvirata" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Běžci z Louky"
            title="Všichni jsou skuteční"
            description="Každá postava ve hře žije v našem azylu. Schopnosti mají podle své opravdové povahy."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {characters.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.06}>
                <article className="group h-full overflow-hidden rounded-lg border border-border bg-surface transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl font-semibold text-moss-deep">{c.name}</h3>
                    <p className="mt-2 text-sm text-text-muted">{c.perk}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <Link href="/zvireci-obyvatele" className="text-sm font-medium text-moss underline-offset-4 hover:underline">
              Poznej jejich skutečné příběhy →
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* svět hry */}
      <section className="bg-moss-deep py-16 text-cream sm:py-20">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-semibold">Šest světů, žádná prohra</h2>
            <p className="mt-4 text-cream/80">
              Poběžíš rozkvetlou loukou i hvězdnou nocí. A protože jsme azyl, nikdy
              neprohráváš — každý běh končí dobře, veselou historkou tvého běžce.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 flex flex-wrap justify-center gap-2">
            {worlds.map((w) => (
              <span key={w} className="rounded-pill border border-cream/25 bg-cream/10 px-4 py-1.5 text-sm">
                {w}
              </span>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Google Play teaser */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-lg border border-border bg-gradient-to-b from-[#8ed4f7]/20 to-surface p-8 text-center sm:p-10">
            <h2 className="font-serif text-2xl font-semibold text-moss-deep sm:text-3xl">Brzy i jako aplikace na Google Play</h2>
            <p className="max-w-xl text-text-muted">
              Připravujeme plnou verzi pro Android — jednorázově za 150 Kč, bez reklam,
              bez sledování a bez nákupů ve hře. Celý výtěžek jde zvířatům.
            </p>
            <p className="text-sm text-text-muted">
              Chceš pomoct s testováním? Napiš nám na{" "}
              <a className="text-moss underline" href="mailto:info@nechmerust.org?subject=Louka%20Run%20—%20testování">info@nechmerust.org</a>.
            </p>
          </Reveal>
        </Container>
      </section>

      <SocialSection />
    </>
  );
}
