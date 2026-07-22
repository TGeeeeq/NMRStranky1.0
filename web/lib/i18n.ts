/**
 * Lightweight bilingual (Czech-first) i18n for the whole site.
 *
 * The site stays Czech by default; visitors can switch to English with the
 * toggle in the navbar. The chosen locale is stored in a cookie
 * (`LOCALE_COOKIE`) and read server-side (`lib/i18n.server.ts#getLocale`) so
 * Server Components render in the right language, while the client
 * `LocaleProvider` mirrors it for interactive components.
 *
 * This module is intentionally free of any server-only imports so it can be
 * used from both Server and Client Components. Server cookie access lives in
 * `lib/i18n.server.ts`.
 */

export type Locale = "cs" | "en";

export const LOCALES: readonly Locale[] = ["cs", "en"];
export const DEFAULT_LOCALE: Locale = "cs";
export const LOCALE_COOKIE = "nmr_lang";
/** One year, in seconds. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return value === "cs" || value === "en";
}

/** Pick the value for the current locale from a `{ cs, en }` pair. */
export function pick<T>(locale: Locale, values: Record<Locale, T>): T {
  return values[locale] ?? values[DEFAULT_LOCALE];
}

/** Shared chrome strings (navigation, footer, buttons) used across the site. */
export const dict = {
  skipToContent: { cs: "Přeskočit na obsah", en: "Skip to content" },
  mainNav: { cs: "Hlavní navigace", en: "Main navigation" },
  home: { cs: "Nech mě růst – domů", en: "Nech mě růst – home" },
  openMenu: { cs: "Otevřít menu", en: "Open menu" },
  closeMenu: { cs: "Zavřít menu", en: "Close menu" },
  donate: { cs: "Přispět", en: "Donate" },
  switchLanguage: { cs: "Přepnout jazyk", en: "Switch language" },
  czech: { cs: "Čeština", en: "Czech" },
  english: { cs: "Angličtina", en: "English" },

  // Footer
  rightsReserved: {
    cs: "© 2026 Nech mě růst z.s. Všechna práva vyhrazena. • Napsáno s láskou k přírodě a zvířatům.",
    en: "© 2026 Nech mě růst z.s. All rights reserved. • Made with love for nature and animals.",
  },
  privacyPolicy: {
    cs: "Zásady ochrany osobních údajů",
    en: "Privacy policy",
  },
  terms: { cs: "Obchodní podmínky", en: "Terms & conditions" },
  cookieSettings: { cs: "Nastavení cookies", en: "Cookie settings" },
  // Footer "Play Louka Run on Google Play" — the game name is styled separately.
  playPrefix: { cs: "Zahraj si", en: "Play" },
  playSuffix: { cs: "na Google Play", en: "on Google Play" },
  madeBy: { cs: "web vytvořil", en: "website by" },

  // SocialSection
  stayInTouch: { cs: "Buďte v kontaktu", en: "Stay in touch" },
  followUs: { cs: "Sledujte nás", en: "Follow us" },

  // Cookie consent
  cookieRegion: {
    cs: "Souhlas s používáním cookies",
    en: "Cookie consent",
  },
  cookieBodyPre: {
    cs: "Používáme nezbytné cookies pro chod webu. S vaším souhlasem také analytické cookies, díky kterým web zlepšujeme. Více v ",
    en: "We use necessary cookies to run the site. With your consent we also use analytics cookies that help us improve it. More in the ",
  },
  cookieBodyLink: {
    cs: "zásadách ochrany osobních údajů",
    en: "privacy policy",
  },
  cookieNecessaryOnly: { cs: "Jen nezbytné", en: "Necessary only" },
  cookieAcceptAll: { cs: "Přijmout vše", en: "Accept all" },
} as const;

/** Navigation labels, keyed by href, in both locales. */
export const navLabels: Record<string, Record<Locale, string>> = {
  "/": { cs: "Domů", en: "Home" },
  "/o-nas": { cs: "O nás", en: "About us" },
  "/jak-se-zapojit": { cs: "Jak se zapojit", en: "Get involved" },
  "/novinky": { cs: "Novinky", en: "News" },
  "/zvireci-obyvatele": { cs: "Zvířecí obyvatelé", en: "Our animals" },
  "/udalosti": { cs: "Události", en: "Events" },
  "/kontakt": { cs: "Kontakt", en: "Contact" },
  "/galerie": { cs: "Galerie", en: "Gallery" },
  "/loukarun": { cs: "Hra", en: "Game" },
  "/obchod": { cs: "Obchod", en: "Shop" },
};
