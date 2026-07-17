"use client";

import { useRef, useState } from "react";
import { KarelActor } from "./KarelActor";
import { pickQuote } from "@/app/seno/karel/karel-store";

/** Karlovy hlášky pro stránku 404 — sarkastický osel, kterému se ztratila stránka. */
const QUOTES_404 = [
  "I-ááá! Tuhle stránku někdo snědl. Nedívej se tak na mě.",
  "Hledáš něco, co tu není? Vítej v klubu — já takhle celý den hledám seno.",
  "Tudy cesta nevede. Věř mi, očichal jsem to tu celé.",
  "Tahle stránka utekla z ohrady. Znám ten pocit. Nedoporučuju.",
  "Nic tu není. Jen já. Přiznej, že sis polepšil.",
  "Ztratil ses? Klidně tu chvíli postůj se mnou. Stojím tu celý den a stěžuju si jen občas.",
];

/** Hýknutí při kliknutí — stejný zvuk jako Karel na /seno. */
const BRAY_SRC = "/assets/karel-hykani.mp3";

export function Karel404() {
  // První hláška je pevná, aby se server a klient shodly při hydrataci;
  // náhoda přichází až s klikáním.
  const [quote, setQuote] = useState(QUOTES_404[0]);
  const brayRef = useRef<HTMLAudioElement | null>(null);

  const nextQuote = () => {
    setQuote((last) => pickQuote(QUOTES_404, last));
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
        karelLabel="Osel Karel — klikni pro další hlášku"
      />
      <p className="mt-2 text-xs text-text-muted">(klikni na Karla)</p>
    </div>
  );
}
