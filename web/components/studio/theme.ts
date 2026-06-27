import type { Theme } from "@/lib/carousel-schema"

/**
 * Vizuální identita: „herbářový list / botanická tabule".
 * Teplý kostěný text na ztlumeném přírodním podkladu, konzistentní okrová
 * akcentová barva (sušená bylina / med) napříč tématy = rozpoznatelný brand.
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
  forest: {
    bgFrom: "#15362a",
    bgTo: "#1d4a37",
    text: "#efe5d0",
    muted: "#a7c2b0",
    accent: "#d6a24c",
    onAccent: "#15362a",
    decor: "#3a6f55",
    line: "rgba(239,229,208,0.22)",
    dark: true,
  },
  meadow: {
    bgFrom: "#efe8d5",
    bgTo: "#e2dcc2",
    text: "#27372a",
    muted: "#62705a",
    accent: "#9c7424",
    onAccent: "#f6f1e2",
    decor: "#b9c79e",
    line: "rgba(39,55,42,0.18)",
    dark: false,
  },
  bark: {
    bgFrom: "#271d15",
    bgTo: "#3a2b1d",
    text: "#ece0cd",
    muted: "#c1ab8f",
    accent: "#cf9442",
    onAccent: "#271d15",
    decor: "#5f4a36",
    line: "rgba(236,224,205,0.2)",
    dark: true,
  },
}

export const THEME_LABELS: Record<Theme, string> = {
  forest: "Les (hluboká zeleň)",
  meadow: "Herbář (papír)",
  bark: "Kůra (zemitá)",
}

/** Vrátí paletu pro téma, případně s přebitým akcentem. */
export function resolvePalette(theme: Theme, accent?: string): Palette {
  const base = PALETTES[theme] ?? PALETTES.forest
  if (accent && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(accent)) {
    return { ...base, accent }
  }
  return base
}
