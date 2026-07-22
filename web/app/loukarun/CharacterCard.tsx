"use client";

import { useState } from "react";
import Image from "next/image";
import { RunnerSprite, type RunnerId } from "./RunnerSprite";
import { useLocale } from "@/components/LocaleProvider";
import { pick } from "@/lib/i18n";

export type Character = {
  id: RunnerId;
  name: string;
  image: string;
  tagline: string;
  perk: string;
};

/** Flip karta běžce: vpředu herní sprite (na hover/focus se rozběhne),
 *  po kliknutí se otočí na skutečnou fotku s perkem. */
export function CharacterCard({ character: c }: { character: Character }) {
  const { locale } = useLocale();
  const [flipped, setFlipped] = useState(false);
  const [running, setRunning] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={flipped}
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => setRunning(true)}
      onMouseLeave={() => setRunning(false)}
      onFocus={() => setRunning(true)}
      onBlur={() => setRunning(false)}
      className="lr-flip block h-full w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss"
      aria-label={`${c.name} — ${pick(locale, { cs: "otočit kartu", en: "flip the card" })}`}
    >
      <span className="lr-flip-inner block h-full">
        {/* přední strana — sprite */}
        <span className={`lr-flip-face lr-flip-front flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-shadow hover:shadow-lg ${running ? "is-running" : ""}`}>
          <span className="relative flex aspect-[4/3] items-end justify-center overflow-hidden bg-gradient-to-b from-[#bce4f9] via-[#dff2e4] to-[#9ec49a]">
            <svg aria-hidden className="absolute bottom-0 left-0 w-full" viewBox="0 0 400 60" preserveAspectRatio="none">
              <path d="M0 30 Q 100 12 200 26 T 400 22 V60 H0 Z" fill="#4a7c4e" opacity="0.7" />
              <path d="M0 44 Q 120 30 240 42 T 400 40 V60 H0 Z" fill="#2d5a3d" />
            </svg>
            <RunnerSprite id={c.id} className="relative z-10 mb-1 h-[72%] w-auto drop-shadow-sm" />
          </span>
          <span className="flex flex-1 flex-col p-5">
            <span className="font-serif text-xl font-semibold text-moss-deep">{c.name}</span>
            <span className="mt-2 text-sm text-text-muted">{c.tagline}</span>
            <span className="mt-auto pt-3 text-xs font-medium uppercase tracking-wide text-moss/70">
              {pick(locale, { cs: "Otočit — jak vypadá doopravdy →", en: "Flip — see the real thing →" })}
            </span>
          </span>
        </span>

        {/* zadní strana — skutečná fotka */}
        <span className="lr-flip-face lr-flip-back flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
          <span className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={c.image}
              alt={c.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </span>
          <span className="flex flex-1 flex-col p-5">
            <span className="font-serif text-xl font-semibold text-moss-deep">{c.name}</span>
            <span className="mt-2 text-sm text-text-muted">{c.perk}</span>
            <span className="mt-auto pt-3 text-xs font-medium uppercase tracking-wide text-moss/70">
              {pick(locale, { cs: "← Zpátky ke spritu", en: "← Back to the sprite" })}
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
