import { z } from "zod"

/**
 * Schéma karuselu pro Instagram (ČSOP Trosečníci).
 *
 * Tento JSON dodává Claude v chatu na zadané téma. Uživatel ho nahraje
 * do /studio, kde si upraví texty, design a branding a stáhne hotové obrázky
 * (případně rovnou publikuje na Instagram, je-li nakonfigurované).
 *
 * Schéma je záměrně tolerantní – chybějící pole se doplní výchozí hodnotou,
 * aby ruční úpravy JSON nerozbily nahrávání.
 */

export const SLIDE_W = 1080
export const SLIDE_H = 1350 // formát 4:5

export const themeSchema = z.enum(["forest", "meadow", "bark"])
export type Theme = z.infer<typeof themeSchema>

/**
 * Druh obsahu karuselu – řídí popisky kartičky „druh" (slide type `plant`),
 * aby seděly na rostliny, živočichy nebo libovolné jiné téma.
 * Výchozí „plants" kvůli zpětné kompatibilitě se staršími JSON soubory.
 */
export const kindSchema = z.enum(["plants", "animals", "other"])
export type Kind = z.infer<typeof kindSchema>

export const slideTypeSchema = z.enum(["cover", "plant", "fact", "tip", "outro", "photo"])
export type SlideType = z.infer<typeof slideTypeSchema>

export const slideSchema = z.object({
  type: slideTypeSchema.catch("fact").default("fact"),
  /** Malý nadpisek nahoře (cover/fact/tip) */
  eyebrow: z.string().catch("").default(""),
  title: z.string().catch("").default(""),
  subtitle: z.string().catch("").default(""),
  body: z.string().catch("").default(""),
  /** Pole pro typ „plant" (druh) */
  name: z.string().catch("").default(""),
  latin: z.string().catch("").default(""),
  status: z.string().catch("").default(""),
  fact: z.string().catch("").default(""),
  use: z.string().catch("").default(""),
  /** Bezpečnostní varování (např. fototoxický bolševník). null = bez varování */
  warning: z.string().nullable().catch(null).default(null),
  /** Výzva k akci (outro) */
  cta: z.string().catch("").default(""),
  /** Pole pro typ „photo": fotka jako base64 data URL + popisek pod ní */
  imageData: z.string().catch("").default(""),
  imageCaption: z.string().catch("").default(""),
  /** Zarovnání jen pro tento slajd (přebíjí globální) */
  align: z.enum(["left", "center"]).optional(),
})
export type Slide = z.infer<typeof slideSchema>

export const captionSchema = z.object({
  label: z.string().catch("Varianta").default("Varianta"),
  text: z.string().catch("").default(""),
  hashtags: z.array(z.string()).catch([]).default([]),
})
export type Caption = z.infer<typeof captionSchema>

export const brandingSchema = z.object({
  csopLogo: z.boolean().catch(true).default(true),
  publicita: z.boolean().catch(false).default(false),
})
export type Branding = z.infer<typeof brandingSchema>

export const carouselSchema = z.object({
  version: z.literal(1).catch(1).default(1),
  topic: z.string().catch("Nový karusel").default("Nový karusel"),
  /** Druh obsahu (rostliny / živočichové / jiné) – přizpůsobí popisky kartiček. */
  kind: kindSchema.catch("plants").default("plants"),
  format: z.literal("4:5").catch("4:5").default("4:5"),
  theme: themeSchema.catch("forest").default("forest"),
  /** Volitelný přebíjející akcent (hex), jinak akcent dle theme */
  accent: z.string().optional(),
  /** Násobič velikosti písma 0.7–1.4 */
  fontScale: z.number().min(0.7).max(1.4).catch(1).default(1),
  align: z.enum(["left", "center"]).catch("left").default("left"),
  branding: brandingSchema.catch({ csopLogo: true, publicita: false }).default({
    csopLogo: true,
    publicita: false,
  }),
  slides: z.array(slideSchema).catch([]).default([]),
  captions: z.array(captionSchema).catch([]).default([]),
})
export type Carousel = z.infer<typeof carouselSchema>

export type ParseResult =
  | { ok: true; data: Carousel }
  | { ok: false; error: string }

/** Bezpečně načte a doplní karusel z neznámého (nahraného) vstupu. */
export function parseCarousel(input: unknown): ParseResult {
  const result = carouselSchema.safeParse(input)
  if (result.success) return { ok: true, data: result.data }

  const issues = result.error.issues
    .slice(0, 5)
    .map((i) => `• ${i.path.join(".") || "(kořen)"}: ${i.message}`)
    .join("\n")
  return {
    ok: false,
    error: `Soubor neodpovídá očekávanému formátu karuselu:\n${issues}`,
  }
}

/* ----------------------------- popisky dle druhu obsahu ----------------------------- */

/** Lidský název druhu obsahu (do přepínače v panelu Design). */
export const KIND_LABELS: Record<Kind, string> = {
  plants: "Rostliny",
  animals: "Živočichové",
  other: "Jiná témata",
}

/** Popisky kartičky „druh" (slide type `plant`), přizpůsobené druhu obsahu. */
export type SpeciesLabels = {
  /** Název typu slajdu v editoru / náhledech */
  typeName: string
  /** Editor: štítek stavu */
  status: string
  /** Editor + náhledy: hlavní název */
  name: string
  /** Editor: druhotný (latinský) řádek */
  latin: string
  /** Editor: pole „zajímavost" */
  fact: string
  /** Editor: pole „use" */
  use: string
  /** Slajd: nadpis bloku se zajímavostí */
  cardFact: string
  /** Slajd: nadpis bloku „use" */
  cardUse: string
}

export const SPECIES_LABELS: Record<Kind, SpeciesLabels> = {
  plants: {
    typeName: "Druh / rostlina",
    status: "Štítek stavu (např. „Invazní druh“)",
    name: "Název druhu",
    latin: "Latinský název",
    fact: "Zajímavost",
    use: "K čemu je dobrá?",
    cardFact: "Zajímavost",
    cardUse: "K čemu je dobrá",
  },
  animals: {
    typeName: "Druh / živočich",
    status: "Štítek (např. „Kráva“, „Obyvatel od 2021“)",
    name: "Jméno / druh",
    latin: "Druh / plemeno",
    fact: "Zajímavost",
    use: "Povaha / jak mu pomáháme",
    cardFact: "Zajímavost",
    cardUse: "Povaha",
  },
  other: {
    typeName: "Kartička",
    status: "Štítek",
    name: "Název",
    latin: "Podtitulek",
    fact: "Zajímavost",
    use: "Detail",
    cardFact: "Zajímavost",
    cardUse: "Detail",
  },
}

/** Vrátí popisky kartičky pro daný druh obsahu (fallback rostliny). */
export function speciesLabels(kind: Kind): SpeciesLabels {
  return SPECIES_LABELS[kind] ?? SPECIES_LABELS.plants
}

/** Prázdný (výchozí) karusel pro start bez nahraného souboru. */
export function emptyCarousel(): Carousel {
  return carouselSchema.parse({
    topic: "Nový karusel",
    slides: [
      { type: "cover", eyebrow: "Víte, že…", title: "Nadpis karuselu", subtitle: "Krátký podtitulek" },
    ],
    captions: [
      { label: "Varianta A", text: "", hashtags: [] },
      { label: "Varianta B", text: "", hashtags: [] },
      { label: "Varianta C", text: "", hashtags: [] },
    ],
  })
}
