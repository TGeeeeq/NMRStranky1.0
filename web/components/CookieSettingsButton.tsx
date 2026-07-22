"use client";

import { useLocale } from "@/components/LocaleProvider";
import { dict, pick } from "@/lib/i18n";

/**
 * Odkaz ve footeru, kterým návštěvník znovu otevře cookie lištu a může
 * změnit svůj souhlas (viz "Souhlas lze kdykoli změnit" na stránce /gdpr).
 * Vyvolá událost, kterou poslouchá komponenta CookieConsent.
 */
export function CookieSettingsButton() {
  const { locale } = useLocale();
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new Event("nmr:open-cookie-settings"))
      }
      className="text-cream/90 underline-offset-4 hover:underline"
    >
      {pick(locale, dict.cookieSettings)}
    </button>
  );
}
