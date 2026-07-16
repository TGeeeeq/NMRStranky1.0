/** Textová data Karlova převzetí /seno — čistý TS bez JSX, aby šla
 *  importovat do unit testů (kontrola faktů sbírky) i do obsahové mapy. */

export const BLOCK_ORDER = [
  "hero",
  "story-header",
  "story-text",
  "meter-header",
  "payment-header",
  "payment-card",
  "ways",
] as const;

export type SenoBlockId = (typeof BLOCK_ORDER)[number];

// ---------------------------------------------------------------------------
// Hlášky

export const KAREL_ASK = {
  text: "I-ááá. Kdo tuhle stránku psal? Seriózní, přehledná, samá fakta… nuda. Jde o moje seno — co kdybych to tu překopal po svém?",
  yes: "Jo, do toho!",
  no: "Radši ne",
};

export const KAREL_PEEK_ASK = "No? Rozmyslel sis to? Nabídka pořád platí.";

export const KAREL_DECLINE =
  "Fajn. Tak si to čti v nudném. Já budu tamhle za rohem. Uraženej.";

export const KAREL_FINALE =
  "Tak. Teď to má šťávu i barvy. QR kód je tamhle — 800 korun, jeden balík, jeden spokojenej osel. I-ááá!";

export const KAREL_RETURN = "Vítej zpátky. Nechal jsem to tu po svém. Neděkuj.";

export const KAREL_RESTORE = "Cože?! No dobře. Ale ta moje verze byla lepší.";

export const KAREL_UNRESTORE = "Věděl jsem, že se vrátíš. Vkus máš.";

/** Komentáře během proměny — po „ukousnutí" daného bloku. */
export const KAREL_COMMENTARY: Partial<Record<SenoBlockId, string>> = {
  hero: "Tak nejdřív ten nadpis. Moje jméno tam chybělo. A razítko — bez razítka to není úřední.",
  "story-text": "Tenhle odstavec chutnal jak sláma. Teda… to je vlastně kompliment.",
  "meter-header": "Ukazatel nechávám. Čísla nežeru. Zatím.",
  "payment-card": "QR kód nechávám. Ten je důležitej. Roh karty jsem ale ochutnal. Kontrola kvality.",
  ways: "A tyhle kartičky… křup. Rohy jsou nejlepší. A barvy jsem vybral osobně.",
};

export const KAREL_IDLE: string[] = [
  "Scrolluješ hezky. Na mrkev to ale nestačí.",
  "Já tu budu, dokud nebude stodola plná.",
  "800 korun = balík. Říkám to jen tak. Mimochodem.",
  "Kdyby ses ztratil: velké Q, velké R, namířit mobil. Zvládneš to.",
  "Avala s Květou žerou za dva. Já za jednoho a půl. Skromnost sama.",
  "Tahle stránka je teď o 100 % lepší. Měřil jsem to.",
  "Zima se blíží. Můj žaludek to ví první.",
  "Sdílení je zadarmo. Seno bohužel ne.",
  "Ty okousané rohy? Kontrola kvality. Všechno prošlo.",
  "To mokré na kartách je ochranný lak. Oslí lak. Neptej se.",
  "Barvy jsem vybíral podle chuti. Růžová chutná nejlíp.",
];

/** Nálepky, podpisy a razítka, které Karel nalepí na svou verzi stránky. */
export const KAREL_STICKERS = {
  hero: "Převzato · ředitel všeho",
  story: "— Přečteno. Schváleno. Karel, ředitel všeho",
  payment: "Roh jsem ochutnal. Papír průměrný, QR výborný.",
} as const;

/** Reakce na kliknutí — klíče odpovídají data-karel-react atributům. */
export const KAREL_REACTIONS: Record<string, string[]> = {
  ucet: [
    "Kopíruješ můj účet? Schvaluju. I-ááá!",
    "Přesně tak. Ctrl+V v bance a je to.",
    "Tohle číslo znám nazpaměť. Pozpátku taky.",
  ],
  qr: [
    "Namiř na to mobilem. Banka už ví, co dělat.",
    "Ten čtverec je brána k mému senu. Vstup povolen.",
  ],
  tip: [
    "Dobrá volba. Všechny volby, na jejichž konci je seno, jsou dobré.",
    "400, 800, 1 600… krásná čísla. Voní senem.",
  ],
  share: [
    "Sdílej to. Hýkat na celý internet sám nestíhám.",
    "Každé sdílení = možná další balík. Matematika osla.",
  ],
  darujme: [
    "Darujme.cz — pro ty, co nevěří čtvercům z pixelů. Taky dobrý.",
    "Karta, převod, cokoli. Hlavně ať to šustí senem.",
  ],
  transparentni: [
    "Jen se koukni. Každou korunu hlídám. Osobně.",
    "Transparentní jak čerstvý vzduch na Louce.",
  ],
  hra: [
    "Jo, ta hra o mně. Konečně sláva, kterou si zasloužím.",
    "Ve hře běhám rychleji. Tady šetřím energii na žraní.",
  ],
};

// ---------------------------------------------------------------------------
// Karlova verze obsahu — texty (fakta hlídá tests/unit/karel-seno.test.ts)

export const KAREL_HERO = {
  eyebrow: "Sbírka pod mým vedením",
  title: "SENO. Potřebuju ho. Hodně.",
  subtitle:
    "Jsem Karel, osel z Louky, a tohle je moje sbírka. Lidi ji napsali moc slušně, tak jsem to vzal do kopyt. Cíl: plná stodola. Termín: než přijde zima. Důvod: hlavně já.",
};

export const KAREL_STORY = {
  eyebrow: "Jak to vidím já",
  title: "Situace: vážná. Já: hladový.",
  paragraphs: [
    "Letos je největší sucho, co pamatuju — a já toho pamatuju hodně. Louky nevydaly skoro nic, seno shání celý kraj. A my ho (světe, div se) nesklízíme, ale kupujeme. Každý rok, pro celé stádo.",
    "Balík, který loni stál 500 Kč, je letos za 800 až 1 000 Kč — a poroste. Proto nakupujeme hned teď, dokud vůbec nějaké seno je. Čekání je pro králíky. Bez urážky, králíci.",
    "A teď můj oblíbený odstavec — apetit. Krávy Avala a Květa spořádají každá kolem 15 kilo sena denně. Já skromných deset — a pak že jsem nenažraný. K tomu osm ovcí, dvě jehňata, muflon Yakul, prasátka a zmínění králíci. Přes zimu jede všechno ze stodoly.",
    "Cíl je 100 000 Kč — při letošních cenách zhruba 125 balíků, celá zimní zásoba pro stádo. Každá koruna jde přes transparentní účet přímo na seno. Hlídám to. Mám na to oko. Velké.",
  ],
};

export const KAREL_METER = {
  eyebrow: "Stav žlabu",
  title: "Kolik už je v žlabu",
  description:
    "Ukazatel přepisuje člověk podle transparentního účtu. Já bych si přidával, tak mě k tomu nepustili.",
};

export const KAREL_PAYMENT = {
  eyebrow: "K věci",
  title: "Sem s tím",
  description:
    "QR kód, mobil, banka, hotovo. Částku si zvol podle sebe — orientační kurz osla je pod kódem.",
};

export const KAREL_TIP_TEXTS = [
  { amount: "400 Kč", covers: "půl balíku — i půlka voní" },
  { amount: "800 Kč", covers: "celý balík = můj spokojený den" },
  { amount: "1 600 Kč", covers: "dva balíky — osobně ti zahýkám" },
];

export const KAREL_WAY_TEXTS = [
  {
    key: "darujme",
    title: "Darujme.cz",
    text: "Nevěříš čtvercům z pixelů? Chápu. Darujme.cz je ověřený portál — karta nebo převod, a moje seno je zase o kus blíž.",
    ctaLabel: "Darovat online",
    sticker: "Prověřeno čumákem. ✓",
  },
  {
    key: "transparentni",
    title: "Transparentní účet",
    text: "Každou korunu vidíš. Pohyby na účtu u Fio banky jsou veřejné a já je hlídám osobně. Běž se přesvědčit.",
    ctaLabel: "Zobrazit pohyby",
    sticker: "Čísla nežeru. Jen hlídám.",
  },
  {
    key: "hra",
    title: "Zahraj si Louka Run",
    text: "Hra o mně. Konečně. Běhám v ní za mrkvemi po naší Louce — a když do sbírky přispěješ 200 Kč a víc, napiš nám a přístup ke hře dostaneš jako poděkování.",
    ctaLabel: "Více o hře",
    sticker: "V hlavní roli: já!",
  },
  {
    key: "share",
    title: "Sdílej sbírku",
    text: "Nemůžeš přispět? Pošli nechmerust.org/seno dál. Hýkat na celý internet sám nestíhám.",
    ctaLabel: null,
    sticker: "Pardon, slintanec. — K.",
  },
] as const;
