"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { pick } from "@/lib/i18n";

/** Proužek na všech stránkách upozorňující na běžící sbírku na Darujme.cz.
 *  Zavření platí po dobu návštěvy (layout přežívá klientské navigace),
 *  resetuje se hard reloadem. */
export function CampaignBanner() {
  const { locale } = useLocale();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="relative bg-terracotta px-12 py-2 text-center text-sm font-medium text-cream">
      <a
        href="https://www.darujme.cz/vyzva/1205543"
        target="_blank"
        rel="noopener"
        className="underline-offset-4 hover:underline"
      >
        {locale === "en" ? (
          <>🌾 Hay &amp; straw winter fundraiser — donate via Darujme.cz&nbsp;→</>
        ) : (
          <>🌾 Sbírka na seno a slámu na zimu — přispějte přes Darujme.cz&nbsp;→</>
        )}
      </a>
      <button
        type="button"
        aria-label={pick(locale, {
          cs: "Skrýt oznámení o sbírce",
          en: "Dismiss fundraiser notice",
        })}
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-pill p-1 text-cream/80 transition-colors hover:bg-cream/15 hover:text-cream"
      >
        <X size={16} aria-hidden />
      </button>
    </div>
  );
}
