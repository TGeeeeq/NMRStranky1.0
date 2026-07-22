"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { useLocale } from "@/components/LocaleProvider";
import { LOCALES, dict, pick, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const SHORT: Record<Locale, string> = { cs: "CS", en: "EN" };
const FULL: Record<Locale, keyof typeof dict> = { cs: "czech", en: "english" };

/**
 * Segmented CS / EN language switch with a sliding moss pill highlight.
 * The active segment's background glides between options via a shared
 * `layoutId`, giving a smooth spring transition. Used in the navbar.
 */
export function LanguageToggle({
  size = "sm",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const { locale, setLocale } = useLocale();
  // Unique per instance so the desktop and mobile toggles don't share a
  // layout-animation id (both can be mounted at once).
  const pillId = useId();

  return (
    <div
      role="group"
      aria-label={pick(locale, dict.switchLanguage)}
      className={cn(
        "relative inline-flex items-center rounded-pill border border-border/70 bg-surface/70 p-0.5 shadow-soft backdrop-blur",
        className,
      )}
    >
      {LOCALES.map((loc) => {
        const active = locale === loc;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => setLocale(loc)}
            aria-pressed={active}
            aria-label={pick(locale, dict[FULL[loc]])}
            className={cn(
              "relative z-10 inline-flex items-center justify-center rounded-pill font-semibold transition-colors duration-200",
              size === "sm"
                ? "h-7 min-w-[2rem] px-2.5 text-xs"
                : "h-9 min-w-[2.5rem] px-3.5 text-sm",
              active ? "text-cream" : "text-text-muted hover:text-moss-deep",
            )}
          >
            {active ? (
              <motion.span
                layoutId={`lang-toggle-pill-${pillId}`}
                className="absolute inset-0 -z-10 rounded-pill bg-moss shadow-soft"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            ) : null}
            {SHORT[loc]}
          </button>
        );
      })}
    </div>
  );
}
