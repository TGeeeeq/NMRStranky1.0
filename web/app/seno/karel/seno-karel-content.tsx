import type { ReactNode } from "react";
import { Landmark, HeartHandshake, Share2, Gamepad2 } from "lucide-react";
import { BANK } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { PaymentPanel, type PaymentTip } from "../PaymentPanel";
import { SupportCard, type SupportWay } from "../SupportCard";
import { getKarelTexts, type SenoBlockId } from "./karel-texts";
import "./karel-chaos.css";

export * from "./karel-texts";

/** JSX „Karlovy verze" bloků /seno — vykreslují se uvnitř KarelSwap, vnější
 *  <section>/<Container> zůstávají ze serverové stránky. Texty (a jejich
 *  fakta) žijí v karel-texts.ts, okousání/slintance/barvy v karel-chaos.css. */

type WayKey = "darujme" | "transparentni" | "hra" | "share";

const WAY_ICONS = {
  darujme: HeartHandshake,
  transparentni: Landmark,
  hra: Gamepad2,
  share: Share2,
} as const;

const WAY_HREFS: Record<string, string | null> = {
  darujme: "https://www.darujme.cz/projekt/1208852",
  transparentni: BANK.transparentUrl,
  hra: "/loukarun",
  share: null,
};

/** Okousání, barva a umístění nálepky pro každou kartu podpory. */
const WAY_CHAOS: Record<
  WayKey,
  { card: string; sticker: string; drool?: string; crumbs?: string }
> = {
  darujme: {
    card: "karel-c-pink karel-card karel-bite-tr",
    sticker: "-top-3 right-8 rotate-3",
    crumbs: "-right-1 top-10",
  },
  transparentni: {
    card: "karel-c-sky karel-card karel-bite-r",
    sticker: "karel-sticker-pink -top-2 left-4 -rotate-2",
  },
  hra: {
    card: "karel-c-purple karel-card karel-bite-bl",
    sticker: "-bottom-3 left-24 -rotate-2",
    crumbs: "bottom-6 left-6",
  },
  share: {
    card: "karel-c-lime karel-card karel-bite-tl",
    sticker: "karel-sticker-sky -top-3 right-6 rotate-6",
    drool: "left-12 top-1 rotate-2",
  },
};

const tilt = ["-rotate-1", "rotate-1", "rotate-[0.5deg]", "-rotate-[0.5deg]"];

/** Zvýrazňovačové tahy v příběhu — fráze musí existovat v odstavci
 *  (kontroluje test), jinak se odstavec vykreslí beze změny. */
const STORY_MARKS: Record<Locale, Array<{ phrase: string; cls: string } | null>> = {
  cs: [
    { phrase: "kupujeme", cls: "karel-mark karel-mark-sky" },
    { phrase: "800 až 1 000 Kč", cls: "karel-mark karel-mark-pink" },
    { phrase: "skromných deset", cls: "karel-mark" },
    { phrase: "100 000 Kč", cls: "karel-mark karel-mark-pink" },
  ],
  en: [
    { phrase: "we buy it", cls: "karel-mark karel-mark-sky" },
    { phrase: "800 to 1,000 Kč", cls: "karel-mark karel-mark-pink" },
    { phrase: "a modest ten", cls: "karel-mark" },
    { phrase: "100,000 Kč", cls: "karel-mark karel-mark-pink" },
  ],
};

function markify(text: string, mark: { phrase: string; cls: string } | null): ReactNode {
  if (!mark || !text.includes(mark.phrase)) return text;
  const [before, ...rest] = text.split(mark.phrase);
  return (
    <>
      {before}
      <mark className={mark.cls}>{mark.phrase}</mark>
      {rest.join(mark.phrase)}
    </>
  );
}

/** Sestaví Karlovy varianty bloků /seno pro daný jazyk. */
export function buildKarelBlocks(
  locale: Locale,
): Record<SenoBlockId, () => ReactNode> {
  const kt = getKarelTexts(locale);
  const marks = STORY_MARKS[locale];

  const tips: PaymentTip[] = kt.tips;
  const ways: SupportWay[] = kt.ways.map((w) => ({
    icon: WAY_ICONS[w.key],
    title: w.title,
    text: w.text,
    cta: w.ctaLabel ? { label: w.ctaLabel, href: WAY_HREFS[w.key]! } : null,
    share: w.key === "share",
    reactKey: w.key,
  }));

  return {
    hero: () => (
      <div className="relative">
        <PageHero
          image="/assets/karel.webp"
          imageAlt={
            locale === "en"
              ? "The donkey Karel on a parched summer meadow"
              : "Oslík Karel na vyschlé letní louce"
          }
          eyebrow={kt.hero.eyebrow}
          title={kt.hero.title}
          subtitle={kt.hero.subtitle}
        />
        <span className="karel-stamp bottom-5 right-4 -rotate-6 sm:bottom-9 sm:right-10">
          {kt.stickers.hero}
        </span>
      </div>
    ),

    "story-header": () => (
      <SectionHeader
        eyebrow={kt.story.eyebrow}
        title={kt.story.title}
        align="left"
        className="karel-h karel-c-pink -rotate-1"
      />
    ),

    "story-text": () => (
      <div className="space-y-5 text-lg leading-relaxed text-text-muted">
        {kt.story.paragraphs.map((p, i) => (
          <p key={i} className={i % 2 ? "-rotate-[0.4deg]" : "rotate-[0.4deg]"}>
            {markify(p, marks[i] ?? null)}
          </p>
        ))}
        <p className="-rotate-1 text-right font-serif text-base italic text-(--karel-pink)">
          {kt.stickers.story}
        </p>
      </div>
    ),

    "meter-header": () => (
      <SectionHeader
        eyebrow={kt.meter.eyebrow}
        title={kt.meter.title}
        description={kt.meter.description}
        className="karel-h karel-c-sky rotate-[0.5deg]"
      />
    ),

    "payment-header": () => (
      <SectionHeader
        eyebrow={kt.payment.eyebrow}
        title={kt.payment.title}
        description={kt.payment.description}
        className="karel-h karel-c-purple rotate-[0.6deg]"
      />
    ),

    "payment-card": () => (
      <div className="relative -rotate-[0.6deg]">
        <PaymentPanel tips={tips} className="karel-bite-tr" />
        <span aria-hidden className="karel-drool -top-1 right-10 rotate-3" />
        <span aria-hidden className="karel-crumbs right-2 top-14" />
        <span className="karel-sticker karel-sticker-pink -bottom-3 left-4 -rotate-2">
          {kt.stickers.payment}
        </span>
      </div>
    ),

    ways: () => (
      <div className="flex flex-col gap-6">
        {ways.map((way, i) => {
          const source = kt.ways[i];
          const chaos = WAY_CHAOS[source.key];
          return (
            <div key={source.key} className={`relative flex-1 ${tilt[i % tilt.length]}`}>
              <SupportCard way={way} className={chaos.card} />
              {chaos.drool ? <span aria-hidden className={`karel-drool ${chaos.drool}`} /> : null}
              {chaos.crumbs ? <span aria-hidden className={`karel-crumbs ${chaos.crumbs}`} /> : null}
              <span className={`karel-sticker ${chaos.sticker}`}>{source.sticker}</span>
            </div>
          );
        })}
      </div>
    ),
  };
}
