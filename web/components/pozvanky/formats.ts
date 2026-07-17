/** Exportní formáty pozvánek pro Instagram. */
export const FORMATS = {
  post: { width: 1080, height: 1350, label: "Post 4:5 (1080×1350)" },
  story: { width: 1080, height: 1920, label: "Story / Reels 9:16 (1080×1920)" },
} as const

export type InviteFormat = keyof typeof FORMATS

/** Texty vykreslované přes AI pozadí. Prázdné pole = prvek se nevykreslí. */
export type InviteTexts = {
  title: string
  tagline: string
  dateText: string
  placeText: string
  /** Ikonky s popisky oddělené čárkou, např. „🔥 oheň, 🌱 zahrada". */
  icons: string
  footer: string
}

export const DEFAULT_TEXTS: InviteTexts = {
  title: "LOUKÁDA",
  tagline: "Přijeď makat, Louka ti poděkuje ♥",
  dateText: "21.–23. 8. 2026",
  placeText: "NA LOUCE",
  icons: "🛖 stavba domečku, 🐾 zvířata, 🔥 oheň, 🌱 zahrada, 🤲 hlína, ☕ společný čas",
  footer: "nechmerust.org",
}
