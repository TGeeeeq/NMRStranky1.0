"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { SENO_CAMPAIGN, campaignProgress } from "@/lib/campaign";

/** Proužek na všech stránkách upozorňující na běžící sbírku. Zavření platí po dobu
 *  návštěvy (layout přežívá klientské navigace), resetuje se hard reloadem. */
export function CampaignBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const pct = campaignProgress(SENO_CAMPAIGN.raised, SENO_CAMPAIGN.goal);

  return (
    <div className="relative bg-terracotta px-12 py-2 text-center text-sm font-medium text-cream">
      <Link href="/seno" className="underline-offset-4 hover:underline">
        🌾 Sbírka „Seno pro Louku“ — vybráno {pct}&nbsp;% ze 100&nbsp;000&nbsp;Kč.
        Pomozte nám sehnat zásobu na zimu&nbsp;→
      </Link>
      <button
        type="button"
        aria-label="Skrýt oznámení o sbírce"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-pill p-1 text-cream/80 transition-colors hover:bg-cream/15 hover:text-cream"
      >
        <X size={16} aria-hidden />
      </button>
    </div>
  );
}
