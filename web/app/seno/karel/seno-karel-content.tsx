import type { ReactNode } from "react";
import { Landmark, HeartHandshake, Share2, Gamepad2 } from "lucide-react";
import { BANK } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { PaymentPanel, type PaymentTip } from "../PaymentPanel";
import { SupportCard, type SupportWay } from "../SupportCard";
import {
  KAREL_HERO,
  KAREL_METER,
  KAREL_PAYMENT,
  KAREL_STORY,
  KAREL_TIP_TEXTS,
  KAREL_WAY_TEXTS,
  type SenoBlockId,
} from "./karel-texts";

export * from "./karel-texts";

/** JSX „Karlovy verze" bloků /seno — vykreslují se uvnitř KarelSwap, vnější
 *  <section>/<Container> zůstávají ze serverové stránky. Texty (a jejich
 *  fakta) žijí v karel-texts.ts. */

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

const KAREL_TIPS: PaymentTip[] = KAREL_TIP_TEXTS;

const KAREL_WAYS: SupportWay[] = KAREL_WAY_TEXTS.map((w) => ({
  icon: WAY_ICONS[w.key],
  title: w.title,
  text: w.text,
  cta: w.ctaLabel ? { label: w.ctaLabel, href: WAY_HREFS[w.key]! } : null,
  share: w.key === "share",
  reactKey: w.key,
}));

const tilt = ["-rotate-1", "rotate-1", "rotate-[0.5deg]", "-rotate-[0.5deg]"];

export const KAREL_BLOCKS: Record<SenoBlockId, () => ReactNode> = {
  hero: () => (
    <PageHero
      image="/assets/karel.webp"
      imageAlt="Oslík Karel na vyschlé letní louce"
      eyebrow={KAREL_HERO.eyebrow}
      title={KAREL_HERO.title}
      subtitle={KAREL_HERO.subtitle}
    />
  ),

  "story-header": () => (
    <SectionHeader eyebrow={KAREL_STORY.eyebrow} title={KAREL_STORY.title} align="left" />
  ),

  "story-text": () => (
    <div className="space-y-5 text-lg leading-relaxed text-text-muted">
      {KAREL_STORY.paragraphs.map((p, i) => (
        <p key={i} className={i % 2 ? "-rotate-[0.4deg]" : "rotate-[0.4deg]"}>
          {p.includes("100 000 Kč") ? (
            <>
              {p.split("100 000 Kč")[0]}
              <strong className="text-terracotta">100 000 Kč</strong>
              {p.split("100 000 Kč")[1]}
            </>
          ) : (
            p
          )}
        </p>
      ))}
    </div>
  ),

  "meter-header": () => (
    <SectionHeader
      eyebrow={KAREL_METER.eyebrow}
      title={KAREL_METER.title}
      description={KAREL_METER.description}
    />
  ),

  "payment-header": () => (
    <SectionHeader
      eyebrow={KAREL_PAYMENT.eyebrow}
      title={KAREL_PAYMENT.title}
      description={KAREL_PAYMENT.description}
    />
  ),

  "payment-card": () => <PaymentPanel tips={KAREL_TIPS} className="-rotate-[0.6deg]" />,

  ways: () => (
    <div className="flex flex-col gap-6">
      {KAREL_WAYS.map((way, i) => (
        <div key={way.title} className={`flex-1 ${tilt[i % tilt.length]}`}>
          <SupportCard way={way} />
        </div>
      ))}
    </div>
  ),
};
