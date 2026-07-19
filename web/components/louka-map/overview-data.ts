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
    km: 1.6,
    // Od parkoviště sejdeme do údolíčka pod U Dvorku a podél něj obloukem
    // zpět nahoru k Louce — ne napřímo přes pole.
    points: [
      [693, 852],
      [672, 888],
      [636, 924],
      [592, 952],
      [545, 968],
      [498, 980],
      [452, 984],
      [416, 958],
      [402, 924],
      [400, 908],
    ],
  },
  {
    id: "vlkanec",
    from: "vlkanec",
    label: "Vlakem — Vlkaneč",
    km: 2.8,
    // Od stanice dolů vesnickou cestou, na křižovatce doprava polní cestou
    // na západ a pak dolů podél třešňové aleje až na Louku.
    points: [
      [540, 305],
      [512, 334],
      [482, 378],
      [462, 410],
      [408, 428],
      [350, 450],
      [302, 464],
      [298, 540],
      [300, 610],
      [308, 685],
      [325, 755],
      [358, 820],
      [385, 868],
      [400, 908],
    ],
  },
  {
    id: "novaves-silnice",
    from: "novaves",
    label: "Nová Ves — po silnici",
    km: 3.6,
    // Od nádraží obcí nahoru po silnici 130, pak horní polní cestou na
    // západ kolem švestkovo-jablečné aleje k parkovišti a údolíčkem dolů
    // k Louce.
    points: [
      [1008, 1010],
      [1045, 1008],
      [1055, 960],
      [1060, 908],
      [1055, 858],
      [1035, 818],
      [1002, 800],
      [946, 802],
      [880, 810],
      [812, 816],
      [748, 820],
      [702, 820],
      [693, 852],
      [664, 892],
      [612, 934],
      [556, 966],
      [498, 980],
      [452, 984],
      [416, 958],
      [400, 908],
    ],
  },
  {
    id: "novaves-luka",
    from: "novaves",
    label: "Nová Ves — luční cesta podél trati",
    km: 3.2,
    // Od nádraží těsně podél železniční trati až k parkovišti a pak
    // údolíčkem dolů k Louce.
    points: [
      [1008, 1010],
      [958, 988],
      [900, 962],
      [840, 948],
      [778, 930],
      [724, 900],
      [700, 858],
      [693, 852],
      [664, 892],
      [612, 934],
      [556, 966],
      [498, 980],
      [452, 984],
      [416, 958],
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
  /** Delší popis zobrazený v panelu pod mapou po rozkliknutí bodu. */
  description?: string;
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
    description: "Baráček hned u parkoviště, kde bydlí náš hodný soused Milan. Pokud cestou zabloudíte, rád vám ukáže, kudy dolů na Louku.",
  },
  {
    id: "alej-tresne",
    at: [300, 600],
    label: "Třešňová alej",
    kind: "alley",
    note: "Třešňová alej — podél cesty od Vlkanče.",
    description: "Třešňová alej lemuje polní cestu od vlakové stanice Vlkaneč. Na jaře krásně kvete a v létě se cestou dolů můžete občerstvit třešněmi.",
  },
  {
    id: "alej-svestka",
    at: [880, 852],
    label: "Švestkovo-jablečná alej",
    kind: "alley",
    note: "Švestkovo-jablečná alej — východně u trati.",
    description: "Švestkovo-jablečná alej roste východně podél trati směrem na Novou Ves. Na podzim tu dozrávají švestky i jablka — klidně ochutnejte.",
  },
];

/** Detailní mapa samotné Louky — až ji dodáš, doplň sem `src` (obrázek do
 *  public/assets) a modal se přepne z „připravujeme“ na hotovou mapu. */
export const loukaDetail: { src: string | null; alt: string } = {
  src: null,
  alt: "Detailní mapa Louky",
};
