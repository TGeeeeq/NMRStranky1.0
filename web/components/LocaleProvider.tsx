"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  /** True while the server re-renders after a language switch. */
  pending: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Mirrors the server-resolved locale on the client and lets interactive
 * components switch language. Switching writes the cookie and calls
 * `router.refresh()` so Server Components re-render in the new language.
 */
export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [pending, startTransition] = useTransition();

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};samesite=lax`;
      document.documentElement.lang = next;
      setLocaleState(next);
      startTransition(() => {
        router.refresh();
      });
    },
    [locale, router],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, pending }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Safe fallback so components never crash outside a provider.
    return { locale: DEFAULT_LOCALE, setLocale: () => {}, pending: false };
  }
  return ctx;
}
