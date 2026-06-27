import type { Theme } from "@/lib/carousel-schema"

/**
 * Vizuální identita = brand webu nechmerust.org.
 * Postaveno na firemních tokenech (viz app/globals.css / www/styles.css):
 *   mech    #1f3d2a / #2d5a3d / #6b8e6e
 *   krém    #f7f2e7   písek #e8dfc8
 *   akcenty terakota #b85c3c · jantar #c89858 · světlý #f0e892
 *   text    #2a3530   ink #1a1f1c   tlumený #5a6660
 * Fonty Fraunces + Plus Jakarta Sans jsou společné se studiem (slide-canvas).
 *
 * Barvy jsou záměrně konkrétní hex (ne CSS proměnné) – aby je html-to-image
 * při exportu zachytil věrně bez závislosti na :root.
 */
export type Palette = {
  /** Pozadí – jemný gradient (od → do), drží se jedné barevné rodiny */
  bgFrom: string
  bgTo: string
  /** Hlavní text (teplá kost / inkoust) */
  text: string
  /** Tlumený text (latina, popisky, hairline) */
  muted: string
  /** Akcent (štítky, linky, čísla) – okrová rodina napříč tématy */
  accent: string
  /** Text na akcentní ploše */
  onAccent: string
  /** Jemná dekorativní barva (perokresba, vignette) */
  decor: string
  /** Tlumená čára / hairline (rgba) */
  line: string
  /** Je téma tmavé? (řídí podklad pod loga a vignette) */
  dark: boolean
}

export const PALETTES: Record<Theme, Palette> = {
  // Signaturní brand: hluboká mechová zeleň + krémový text, jantarový akcent.
  forest: {
    bgFrom: "#1f3d2a", // --color-moss-deep
    bgTo: "#2d5a3d", // --color-moss
    text: "#f7f2e7", // --color-cream
    muted: "#a8c4aa", // zesvětlený moss-soft pro čitelnost na tmavé
    accent: "#e0b15c", // jantar (brand amber, prosvětlený pro kontrast)
    onAccent: "#1f3d2a",
    decor: "#3c6b4d",
    line: "rgba(247,242,231,0.20)",
    dark: true,
  },
  // Světlá varianta jako krémové sekce webu: krém→písek, terakotový akcent.
  meadow: {
    bgFrom: "#f7f2e7", // --color-cream
    bgTo: "#e8dfc8", // --color-sand
    text: "#2a3530", // --color-text
    muted: "#5a6660", // --color-text-muted
    accent: "#b85c3c", // --color-terracotta
    onAccent: "#f7f2e7",
    decor: "#a8b58c", // tlumená šalvěj
    line: "rgba(42,53,48,0.16)",
    dark: false,
  },
  // Zemitá teplá varianta odvozená z terakoty/jantaru pro „horká" témata.
  bark: {
    bgFrom: "#33231a",
    bgTo: "#4a3326",
    text: "#f3e7d5",
    muted: "#cbb097",
    accent: "#e0a958", // --color-amber (prosvětlený)
    onAccent: "#33231a",
    decor: "#6e4d38",
    line: "rgba(243,231,213,0.20)",
    dark: true,
  },
}

export const THEME_LABELS: Record<Theme, string> = {
  forest: "Mechová zelená (brand)",
  meadow: "Krémová (papír)",
  bark: "Zemitá (kůra)",
}

/** Vrátí paletu pro téma, případně s přebitým akcentem. */
export function resolvePalette(theme: Theme, accent?: string): Palette {
  const base = PALETTES[theme] ?? PALETTES.forest
  if (accent && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(accent)) {
    return { ...base, accent }
  }
  return base
}
