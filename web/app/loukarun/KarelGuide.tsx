"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { KarelSvg } from "@/components/karel/KarelSvg";
import { KAREL_QUOTES, KAREL_RANDOM, type KarelSection } from "./karel";
import { useLocale } from "@/components/LocaleProvider";
import { pick } from "@/lib/i18n";

/** Karel-průvodce: vjede do sekce s trefnou hláškou, kliknutím vyhodí
 *  náhodnou hlášku z poolu a poskočí. Index 0 je i SSR výchozí stav,
 *  žádný náhodný výběr při renderu — hydratace zůstává konzistentní. */
export function KarelGuide({
  section,
  align = "left",
  className = "",
}: {
  section: KarelSection;
  align?: "left" | "right";
  className?: string;
}) {
  const { locale } = useLocale();
  const [quote, setQuote] = useState(() => KAREL_QUOTES[locale][section][0]);
  const [hopping, setHopping] = useState(false);
  const lastRef = useRef<string | null>(null);

  // Reset to the section's default line when the visitor switches language.
  useEffect(() => {
    setQuote(KAREL_QUOTES[locale][section][0]);
  }, [locale, section]);

  function nextQuote() {
    const pool = KAREL_RANDOM[locale];
    let next = quote;
    while (next === quote || next === lastRef.current) {
      next = pool[Math.floor(Math.random() * pool.length)];
    }
    lastRef.current = quote;
    setQuote(next);
    setHopping(true);
  }

  const flipped = align === "right";

  return (
    <motion.div
      initial={{ opacity: 0, x: flipped ? 32 : -32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-end gap-3 sm:gap-4 ${flipped ? "flex-row-reverse" : ""} ${className}`}
    >
      <button
        type="button"
        onClick={nextQuote}
        aria-label={pick(locale, { cs: "Karel — klikni pro další hlášku", en: "Karel — click for another line" })}
        title={pick(locale, { cs: "Klikni na Karla", en: "Click Karel" })}
        className="group relative min-h-11 min-w-11 shrink-0 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss"
      >
        <span
          className={`block ${hopping ? "karel-hop" : ""}`}
          onAnimationEnd={() => setHopping(false)}
        >
          <KarelSvg
            className={`h-24 w-auto drop-shadow-sm transition-transform duration-300 group-hover:-rotate-2 sm:h-28 ${flipped ? "" : "-scale-x-100"}`}
          />
        </span>
      </button>
      <div
        className={`relative mb-6 max-w-xs rounded-lg border border-border bg-cream px-4 py-3 shadow-sm sm:max-w-sm ${flipped ? "text-right" : ""}`}
      >
        <span
          aria-hidden
          className={`absolute bottom-4 h-3.5 w-3.5 rotate-45 border-border bg-cream ${
            flipped ? "-right-[7px] border-r border-t" : "-left-[7px] border-b border-l"
          }`}
        />
        <p aria-live="polite" className="text-sm font-medium leading-snug text-moss-deep">
          {quote}
        </p>
      </div>
    </motion.div>
  );
}
