// Data pro interaktivní kreslenou mapu okolí Louky.
//
// Podklad je kreslený obrázek (public/assets/mapa-okoli-louky.jpg). Až bude
// hotová novější verze, stačí vyměnit tenhle jeden soubor (stejný název a
// rozměry 1254×1254) a nic dalšího se nemusí měnit.
//
// Všechny souřadnice [x, y] jsou v PIXELECH podkladového obrázku
// (0,0 = levý horní roh, IMG.w × IMG.h). Body i trasy se dají volně
// posouvat tady, bez zásahu do komponenty.

export type XY = [number, number];

/** Podkladový obrázek — jediné místo, kde se mění zdroj a rozměry. */
export const IMG = {
  src: "/assets/mapa-okoli-louky.jpg",
  w: 1254,
  h: 1254,
} as const;

/** Startovní body příjezdu. */
export type StartId = "parking" | "vlkanec" | "novaves";

/** Konkrétní trasa (Nová Ves má dvě varianty). */
export type RouteId = "parking" | "vlkanec" | "novaves-silnice" | "novaves-luka";

/** Zajímavé body, na které se dá kliknout (mimo startů). */
export type PoiId = "louka" | "soused" | "alej-tresne" | "alej-svestka";

export const starts: {
  id: StartId;
  kind: "parking" | "train";
  at: XY;
  label: string;
  tooltip: string;
}[] = [
  {
    id: "parking",
    kind: "parking",
    at: [693, 852],
    label: "Parkoviště",
    tooltip: "Přijedu autem — parkoviště",
  },
  {
    id: "vlkanec",
    kind: "train",
    at: [540, 300],
    label: "Vlkaneč — vlak",
    tooltip: "Vlakem — stanice Vlkaneč",
  },
  {
    id: "novaves",
    kind: "train",
    at: [1008, 1010],
    label: "Nová Ves u Leštiny — vlak",
    tooltip: "Vlakem — stanice Nová Ves u Leštiny",
  },
];

export const routes: {
  id: RouteId;
  from: StartId;
  label: string;
  km: number;
  points: XY[];
}[] = [
  {
    id: "parking",
    from: "parking",
    label: "Autem — od parkoviště dolů",
    km: 1.0,
    points: [
      [693, 852],
      [610, 878],
      [510, 895],
      [430, 904],
      [400, 908],
    ],
  },
  {
    id: "vlkanec",
    from: "vlkanec",
    label: "Vlakem — Vlkaneč",
    km: 2.6,
    points: [
      [540, 300],
      [505, 345],
      [465, 405],
      [420, 470],
      [390, 545],
      [383, 625],
      [388, 700],
      [396, 775],
      [400, 845],
      [400, 908],
    ],
  },
  {
    id: "novaves-silnice",
    from: "novaves",
    label: "Nová Ves — po silnici",
    km: 2.6,
    points: [
      [1008, 1010],
      [930, 982],
      [845, 955],
      [760, 922],
      [712, 888],
      [693, 852],
      [600, 880],
      [500, 898],
      [430, 905],
      [400, 908],
    ],
  },
  {
    id: "novaves-luka",
    from: "novaves",
    label: "Nová Ves — luční cesta podél trati",
    km: 2.3,
    points: [
      [1008, 1010],
      [918, 928],
      [825, 852],
      [748, 822],
      [705, 828],
      [693, 852],
      [600, 880],
      [500, 898],
      [430, 905],
      [400, 908],
    ],
  },
];

export const pois: {
  id: PoiId;
  at: XY;
  label: string;
  kind: "louka" | "house" | "alley";
  /** Popisek, který se ukáže po kliknutí (mimo Louky, ta otevírá detail). */
  note?: string;
}[] = [
  {
    id: "louka",
    at: [400, 908],
    label: "Louka",
    kind: "louka",
    note: "To je Louka — naše útočiště. Klikni pro detailní mapu.",
  },
  {
    id: "soused",
    at: [688, 804],
    label: "Náš hodný soused",
    kind: "house",
    note: "Baráček u parkoviště — bydlí tu náš hodný soused Milan.",
  },
  {
    id: "alej-tresne",
    at: [385, 590],
    label: "Třešňová alej",
    kind: "alley",
    note: "Třešňová alej — podél cesty od Vlkanče.",
  },
  {
    id: "alej-svestka",
    at: [880, 852],
    label: "Švestkovo-jablečná alej",
    kind: "alley",
    note: "Švestkovo-jablečná alej — východně u trati.",
  },
];

/** Detailní mapa samotné Louky — až ji dodáš, doplň sem `src` (obrázek do
 *  public/assets) a modal se přepne z „připravujeme“ na hotovou mapu. */
export const loukaDetail: { src: string | null; alt: string } = {
  src: null,
  alt: "Detailní mapa Louky",
};
