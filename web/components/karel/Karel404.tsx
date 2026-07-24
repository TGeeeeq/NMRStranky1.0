"use client";

import { useRef, useState } from "react";
import { KarelActor } from "./KarelActor";
import { pickQuote } from "./karel-store";
import { useLocale } from "@/components/LocaleProvider";
import { pick, type Locale } from "@/lib/i18n";

/** Karlovy hlášky pro stránku 404 — sarkastický osel, kterému se ztratila stránka. */
const QUOTES_404: Record<Locale, string[]> = {
  cs: [
    "I-ááá! Tuhle stránku někdo snědl. Nedívej se tak na mě.",
    "Hledáš něco, co tu není? Vítej v klubu — já takhle celý den hledám seno.",
    "Tudy cesta nevede. Věř mi, očichal jsem to tu celé.",
    "Tahle stránka utekla z ohrady. Znám ten pocit. Nedoporučuju.",
    "Nic tu není. Jen já. Přiznej, že sis polepšil.",
    "Ztratil ses? Klidně tu chvíli postůj se mnou. Stojím tu celý den a stěžuju si jen občas.",
  ],
  en: [
    "Hee-haw! Someone ate this page. Don’t look at me like that.",
    "Looking for something that isn’t here? Welcome to the club — I look for hay all day.",
    "There’s no way through here. Trust me, I’ve sniffed the whole place.",
    "This page escaped the paddock. I know the feeling. Wouldn’t recommend it.",
    "Nothing here. Just me. Admit it, you’ve traded up.",
    "Lost? Feel free to stand here with me a while. I stand here all day and only complain now and then.",
  ],
};

/** Hýknutí při kliknutí — stejný zvuk jako Karel na /seno. */
const BRAY_SRC = "/assets/karel-hykani.mp3";

export function Karel404() {
  const { locale } = useLocale();
  const quotes = pick(locale, QUOTES_404);
  // První hláška je pevná, aby se server a klient shodly při hydrataci;
  // náhoda přichází až s klikáním.
  const [quote, setQuote] = useState(quotes[0]);
  const brayRef = useRef<HTMLAudioElement | null>(null);

  const nextQuote = () => {
    setQuote((last) => pickQuote(quotes, last));
    try {
      const audio = brayRef.current ?? new Audio(BRAY_SRC);
      brayRef.current = audio;
      audio.volume = 0.45;
      audio.currentTime = 0;
      void audio.play().catch(() => {});
    } catch {
      // Bez zvuku se Karel obejde.
    }
  };

  return (
    <div className="flex flex-col items-center">
      <KarelActor
        pose="idle"
        size="h-32 sm:h-40"
        bubble={quote}
        onKarelClick={nextQuote}
        karelLabel={pick(locale, {
          cs: "Osel Karel — klikni pro další hlášku",
          en: "Karel the donkey — click for another quip",
        })}
      />
      <p className="mt-2 text-xs text-text-muted">
        {pick(locale, { cs: "(klikni na Karla)", en: "(click Karel)" })}
      </p>
    </div>
  );
}
