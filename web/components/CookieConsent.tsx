"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";
import { Cookie } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { dict, pick } from "@/lib/i18n";

/**
 * Nenápadná cookie lišta. Web sám o sobě potřebuje jen nezbytné cookies
 * (jazyk, samotný souhlas, košík). Analytické cookies (Google Analytics)
 * se spouští VÝHRADNĚ po udělení souhlasu — což odpovídá textu v /gdpr.
 *
 * Rozhodnutí se ukládá do cookie `cookieConsent` ("accepted" / "rejected")
 * s platností 1 rok (viz tabulka cookies na stránce Ochrana osobních údajů).
 *
 * Souhlas lze kdykoli změnit — lišta se znovu otevře vyvoláním události
 * `window` `nmr:open-cookie-settings` (viz CookieSettingsButton ve footeru).
 */

const COOKIE_NAME = "cookieConsent";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const CHANGED_EVENT = "nmr:consent-changed";
const OPEN_EVENT = "nmr:open-cookie-settings";

// Volitelné: měřicí ID Google Analytics. Bez něj se analytika nenačítá
// (souhlas se i tak uloží, takže po doplnění ID začne fungovat okamžitě).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type Consent = "accepted" | "rejected" | null;

function readConsent(): Consent {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  const value = match?.split("=")[1];
  return value === "accepted" || value === "rejected" ? value : null;
}

function writeConsent(value: Exclude<Consent, null>) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${value}; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new Event(CHANGED_EVENT));
}

// --- Čtení souhlasu jako externího úložiště (document.cookie) ---------------
function subscribeConsent(callback: () => void) {
  window.addEventListener(CHANGED_EVENT, callback);
  return () => window.removeEventListener(CHANGED_EVENT, callback);
}
// Server i hydratace vidí null; klient hned přečte reálnou cookie. Tím
// useSyncExternalStore zaručí žádný mismatch a žádný flash pro vracející se.
const consentServerSnapshot = (): Consent => null;

export function CookieConsent() {
  const { locale } = useLocale();
  const consent = useSyncExternalStore(
    subscribeConsent,
    readConsent,
    consentServerSnapshot,
  );

  // Znovuotevření lišty z footeru ("Souhlas lze kdykoli změnit").
  const [forceOpen, setForceOpen] = useState(false);
  useEffect(() => {
    const reopen = () => setForceOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const decide = useCallback((value: Exclude<Consent, null>) => {
    writeConsent(value);
    setForceOpen(false);
  }, []);

  const open = consent === null || forceOpen;

  return (
    <>
      {/* Analytika se aktivuje jen se souhlasem a jen když je nastaveno GA_ID. */}
      {consent === "accepted" && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {open && (
        <div
          role="region"
          aria-label={pick(locale, dict.cookieRegion)}
          className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4 motion-safe:animate-[cookie-rise_0.5s_var(--ease-out)_both]"
        >
          <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 rounded-lg border border-border bg-surface/95 p-5 shadow-lift backdrop-blur-md sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <div className="flex items-start gap-3 sm:items-center">
              <span
                aria-hidden
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-accent/40 text-moss-deep"
              >
                <Cookie size={20} />
              </span>
              <p className="text-sm leading-relaxed text-text-muted">
                {pick(locale, dict.cookieBodyPre)}
                <Link
                  href="/gdpr"
                  className="font-medium text-moss underline underline-offset-4 hover:text-moss-deep"
                >
                  {pick(locale, dict.cookieBodyLink)}
                </Link>
                .
              </p>
            </div>

            <div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => decide("rejected")}
                className="inline-flex items-center justify-center rounded-pill border border-border px-5 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface-alt"
              >
                {pick(locale, dict.cookieNecessaryOnly)}
              </button>
              <button
                type="button"
                onClick={() => decide("accepted")}
                className="inline-flex items-center justify-center rounded-pill bg-moss px-6 py-2.5 text-sm font-medium text-cream shadow-soft transition-transform hover:-translate-y-0.5"
              >
                {pick(locale, dict.cookieAcceptAll)}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
