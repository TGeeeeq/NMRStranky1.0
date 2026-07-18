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
    km: 1.3,
    // Od parkoviště dolů do údolíčka a zpět nahoru k Louce (ne šikmo).
    points: [
      [693, 852],
      [668, 876],
      [610, 928],
      [560, 972],
      [500, 952],
      [440, 920],
      [400, 908],
    ],
  },
  {
    id: "vlkanec",
    from: "vlkanec",
    label: "Vlakem — Vlkaneč",
    km: 2.8,
    // Od stanice krátce doleva na polní cestu, pak rovně dolů podél
    // třešňové aleje až na Louku.
    points: [
      [540, 305],
      [478, 320],
      [472, 362],
      [430, 420],
      [368, 470],
      [372, 538],
      [385, 590],
      [392, 690],
      [398, 800],
      [400, 908],
    ],
  },
  {
    id: "novaves-silnice",
    from: "novaves",
    label: "Nová Ves — po silnici",
    km: 3.4,
    // Od nádraží nahoru po silnici (130), horní cestou na západ kolem
    // švestkovo-jablečné aleje k parkovišti a dolů k Louce.
    points: [
      [1008, 1010],
      [1055, 965],
      [1052, 878],
      [972, 842],
      [879, 832],
      [779, 820],
      [722, 812],
      [700, 835],
      [693, 858],
      [650, 905],
      [588, 950],
      [548, 974],
      [482, 946],
      [430, 918],
      [400, 908],
    ],
  },
  {
    id: "novaves-luka",
    from: "novaves",
    label: "Nová Ves — luční cesta podél trati",
    km: 3.0,
    // Od nádraží těsně podél kolejí k parkovišti a dolů k Louce.
    points: [
      [1008, 1010],
      [905, 996],
      [812, 984],
      [738, 956],
      [705, 905],
      [693, 858],
      [650, 905],
      [588, 950],
      [548, 974],
      [482, 946],
      [430, 918],
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
