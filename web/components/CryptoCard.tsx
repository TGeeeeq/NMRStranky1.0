"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/LocaleProvider";
import { pick, type Locale } from "@/lib/i18n";

export type Crypto = {
  name: string;
  logo: string;
  qr: string;
  address: string;
  description: Record<Locale, string>;
  mineUrl?: string;
};

export function CryptoCard({ crypto }: { crypto: Crypto }) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <article className="flex flex-col rounded-lg border border-border bg-surface p-6 text-center shadow-soft">
      <Image
        src={crypto.logo}
        alt={`${crypto.name} logo`}
        width={56}
        height={56}
        className="mx-auto h-14 w-14 object-contain"
      />
      <h3 className="mt-4 font-serif text-xl font-semibold text-moss-deep">{crypto.name}</h3>
      <p className="mt-2 text-sm text-text-muted">{pick(locale, crypto.description)}</p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-pill bg-moss px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-moss-deep"
      >
        {open ? pick(locale, { cs: "Skrýt", en: "Hide" }) : pick(locale, { cs: "Více", en: "More" })}
        <ChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="mt-5 border-t border-border pt-5">
          <Image
            src={crypto.qr}
            alt={`${pick(locale, { cs: "QR kód", en: "QR code" })} – ${crypto.name}`}
            width={180}
            height={180}
            className="mx-auto h-44 w-44 rounded-md bg-white object-contain p-2"
          />
          <p className="mt-4 break-all rounded-md bg-surface-alt px-3 py-2 text-xs text-text">
            {crypto.address}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <CopyButton
              value={crypto.address}
              label={pick(locale, { cs: "Kopírovat adresu", en: "Copy address" })}
            />
            {crypto.mineUrl ? (
              <a
                href={crypto.mineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-pill bg-accent px-4 py-2 text-sm font-medium text-moss-deep"
              >
                {pick(locale, { cs: "Těžit Pi", en: "Mine Pi" })}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}
