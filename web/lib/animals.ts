/** Animal residents + photo-gallery data, ported from the legacy site. */

export type Resident = {
  name: string;
  image: string;
  description: string;
  /** Optional status badge, e.g. a lost animal. */
  status?: string;
};

export const residents: Resident[] = [
  { name: "Karel", image: "/assets/karel.webp", description: "Hravý osel s velkým srdcem a lehce kousavou povahou." },
  { name: "Yakul", image: "/assets/yakul.webp", description: "Rozverný mladý muflon, který objevuje, k čemu slouží rohy." },
  { name: "Avala", image: "/assets/avala.webp", description: "Mazlivá kráva, která miluje běhání po louce." },
  {
    name: "Princezna",
    image: "/assets/princezna.webp",
    description:
      "Princezna je ušlechtilá černá kříženka divočáka, jejíž veškerá královská noblesa se při prvním zakručení v břiše okamžitě promění v nezastavitelnou slintavou potopu.",
  },
  { name: "Květa", image: "/assets/kveta.webp", description: "Klidná kravka, co má ráda svůj klid a je věrnou společnicí Avalky." },
  { name: "Riky", image: "/assets/riky.webp", description: "Hravý pes, který hlídá celou Louku." },
  { name: "Flíček", image: "/assets/flicek.webp", description: "Prasík, co má rád drbání na bříšku." },
  { name: "List", image: "/assets/list.webp", description: "Rozverné štěně, které moc rádo zkoumá a ochutnává.", status: "Stále se pohřešuje" },
  { name: "Atila", image: "/assets/atila.webp", description: "Věrná kamarádka a velká milovnice jídla." },
  {
    name: "Kesy",
    image: "/assets/kesy.webp",
    description:
      "Vypadá jako obří chlupatý medvěd a má rozvážnost zenového mistra. Dává jasně najevo, že povely jsou pouze doporučení, kterými se bude řídit, až bude mít čas a náladu.",
  },
  { name: "Pogo", image: "/assets/pogo2.webp", description: "Energická ovčí kamarádka." },
  { name: "Kulich", image: "/assets/kulich.webp", description: "Milý a přátelský obyvatel naší Louky." },
  { name: "Eduard", image: "/assets/eda.webp", description: "Důstojný a vymazlený člen naší zvířecí rodiny." },
  { name: "Emil", image: "/assets/emil.webp", description: "Bezrohý (už) obyvatel Louky. Nehne se od Amálky." },
  { name: "Amálka", image: "/assets/amalka.webp", description: "Jemná a láskyplná obyvatelka naší Louky. Nehne se od Emila." },
  { name: "Končí", image: "/assets/konci.webp", description: "Zvědavý a aktivní člen naší komunity." },
  { name: "Lucinka", image: "/assets/lucinka2.webp", description: "Veselá a přátelská ovčí babička." },
  { name: "Anaya", image: "/assets/anaya.webp", description: "Veselá a přátelská ovčí obyvatelka." },
  { name: "Malvína a Rozárka", image: "/assets/malvina-rozarka.webp", description: "Roztomilé malé ovečky." },
  { name: "Roman", image: "/assets/roman.webp", description: "Nejsvalnatější kocour na celém světě." },
  { name: "Denis", image: "/assets/denis.webp", description: "Velký průzkumník a velký mazel." },
  { name: "Hanička", image: "/assets/hanicka.webp", description: "Třínohá kočka samotářka." },
  { name: "Lotka", image: "/assets/lotka.webp", description: "Kočka samotářka." },
  { name: "Máša", image: "/assets/masa.webp", description: "Luční modrooká blondýna." },
  { name: "Patricie", image: "/assets/patricie.webp", description: "Nejumňoukanější kočka na celém světě." },
  { name: "Safír", image: "/assets/safir.webp", description: "Nejchundelatější kocour na celém světě." },
  { name: "Holoubci", image: "/assets/holoubci.webp", description: "Krásní ptáci, kteří přinášejí klid a harmonii." },
  { name: "Králíci", image: "/assets/kralici.webp", description: "Králíčci, co si užívají svobody." },
  { name: "Pipinky", image: "/assets/pipinky.webp", description: "Malí a roztomilí obyvatelé naší Louky." },
];

export type GalleryAnimal = {
  name: string;
  base: string;
  count: number;
};

/**
 * Gallery groups. `count` is the number of existing `${base}{1..count}.webp`
 * files in /public/assets (measured against the real asset folder, so the
 * grid never points at a missing image).
 */
export const galleryAnimals: GalleryAnimal[] = [
  { name: "Život na Louce", base: "louka", count: 15 },
  { name: "Procházky", base: "walk", count: 3 },
  { name: "Karel", base: "karel", count: 3 },
  { name: "Yakul", base: "yakul", count: 4 },
  { name: "Avala", base: "avala", count: 5 },
  { name: "Princezna", base: "princezna", count: 4 },
  { name: "Květa", base: "kveta", count: 3 },
  { name: "Riky", base: "riky", count: 1 },
  { name: "Flíček", base: "flicek", count: 3 },
  { name: "Atila", base: "atila", count: 3 },
  { name: "Kesy", base: "kesy", count: 3 },
  { name: "Pogo", base: "pogo", count: 4 },
  { name: "Kulich", base: "kulich", count: 3 },
  { name: "Eduard", base: "eduard", count: 1 },
  { name: "Emil", base: "emil", count: 1 },
  { name: "Amálka", base: "amalka", count: 2 },
  { name: "Končí", base: "konci", count: 3 },
  { name: "Lucinka", base: "lucinka", count: 4 },
  { name: "Anaya", base: "anaya", count: 2 },
  { name: "Roman", base: "roman", count: 5 },
  { name: "Máša", base: "masa", count: 3 },
  { name: "Lotka", base: "lotka", count: 3 },
  { name: "Denis", base: "denis", count: 5 },
  { name: "Hanička", base: "hanicka", count: 1 },
  { name: "Patricie", base: "patricie", count: 3 },
  { name: "Safír", base: "safir", count: 4 },
  { name: "Holoubci", base: "holoubci", count: 4 },
  { name: "Králíci", base: "kralici", count: 1 },
  { name: "Kachny", base: "kachny", count: 5 },
  { name: "Husy", base: "husy", count: 5 },
  { name: "Pipinky", base: "pipinky", count: 5 },
];

export type GalleryImage = { src: string; animal: string };

export const galleryImages: GalleryImage[] = galleryAnimals.flatMap((a) =>
  Array.from({ length: a.count }, (_, i) => ({
    src: `/assets/${a.base}${i + 1}.webp`,
    animal: a.name,
  })),
);
