/** Textová data Karlova převzetí /seno — čistý TS bez JSX, aby šla
 *  importovat do unit testů (kontrola faktů sbírky) i do obsahové mapy. */

import type { Locale } from "@/lib/i18n";

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

/** Úplně poslední zásah: škrt podpisu autora v patičce. */
export const KAREL_CREDIT = {
  commentary: "A podpis dole? Škrt. Web vytvořil Antonín, budiž — ale překopal ho Karel.",
  signature: "…přesto Karel",
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

// ---------------------------------------------------------------------------
// Bilingual accessor — the Czech consts above stay the single source for cs
// (and for the unit tests); English is provided in parallel. Consumers call
// getKarelTexts(locale) instead of importing the individual consts.

type WayKey = "darujme" | "transparentni" | "hra" | "share";

export type KarelTexts = {
  ask: { text: string; yes: string; no: string };
  peekAsk: string;
  decline: string;
  finale: string;
  return: string;
  restore: string;
  unrestore: string;
  commentary: Partial<Record<SenoBlockId, string>>;
  idle: string[];
  stickers: { hero: string; story: string; payment: string };
  credit: { commentary: string; signature: string };
  reactions: Record<string, string[]>;
  hero: { eyebrow: string; title: string; subtitle: string };
  story: { eyebrow: string; title: string; paragraphs: string[] };
  meter: { eyebrow: string; title: string; description: string };
  payment: { eyebrow: string; title: string; description: string };
  tips: { amount: string; covers: string }[];
  ways: { key: WayKey; title: string; text: string; ctaLabel: string | null; sticker: string }[];
};

const CS: KarelTexts = {
  ask: KAREL_ASK,
  peekAsk: KAREL_PEEK_ASK,
  decline: KAREL_DECLINE,
  finale: KAREL_FINALE,
  return: KAREL_RETURN,
  restore: KAREL_RESTORE,
  unrestore: KAREL_UNRESTORE,
  commentary: KAREL_COMMENTARY,
  idle: KAREL_IDLE,
  stickers: KAREL_STICKERS,
  credit: KAREL_CREDIT,
  reactions: KAREL_REACTIONS,
  hero: KAREL_HERO,
  story: KAREL_STORY,
  meter: KAREL_METER,
  payment: KAREL_PAYMENT,
  tips: [...KAREL_TIP_TEXTS],
  ways: KAREL_WAY_TEXTS.map((w) => ({ ...w })),
};

const EN: KarelTexts = {
  ask: {
    text: "Hee-haw. Who wrote this page? Serious, tidy, all facts… boring. This is about my hay — what if I redid it my way?",
    yes: "Yeah, go for it!",
    no: "Better not",
  },
  peekAsk: "Well? Changed your mind? The offer still stands.",
  decline: "Fine. Read it in boring mode then. I'll be over there. Offended.",
  finale:
    "There. Now it's got flavour and colour. The QR code is right there — 800 crowns, one bale, one happy donkey. Hee-haw!",
  return: "Welcome back. I left it my way. Don't thank me.",
  restore: "What?! Fine. But my version was better.",
  unrestore: "I knew you'd come back. You've got taste.",
  commentary: {
    hero: "First that headline. My name was missing. And a stamp — without a stamp it's not official.",
    "story-text": "This paragraph tasted like straw. Which… is actually a compliment.",
    "meter-header": "I'll leave the meter. I don't eat numbers. Yet.",
    "payment-card":
      "I'll leave the QR code. That one's important. But I tasted the corner of the card. Quality control.",
    ways: "And these little cards… crunch. Corners are the best. And I picked the colours myself.",
  },
  idle: [
    "You scroll nicely. Not enough for a carrot, though.",
    "I'll be here until the barn is full.",
    "800 crowns = one bale. Just saying. By the way.",
    "If you get lost: big Q, big R, point your phone. You've got this.",
    "Avala and Květa eat for two. I eat for one and a half. Modesty itself.",
    "This page is now 100% better. I measured it.",
    "Winter's coming. My stomach knows first.",
    "Sharing is free. Hay, sadly, is not.",
    "Those chewed corners? Quality control. Everything passed.",
    "That damp on the cards is protective varnish. Donkey varnish. Don't ask.",
    "I chose the colours by taste. Pink tastes best.",
  ],
  stickers: {
    hero: "Taken over · director of everything",
    story: "— Read. Approved. Karel, director of everything",
    payment: "Tasted the corner. Paper average, QR excellent.",
  },
  credit: {
    commentary:
      "And the signature at the bottom? Struck out. Website by Antonín, fine — but Karel redid it.",
    signature: "…still Karel",
  },
  reactions: {
    ucet: [
      "Copying my account number? Approved. Hee-haw!",
      "Exactly. Ctrl+V in your bank and done.",
      "I know this number by heart. Backwards too.",
    ],
    qr: [
      "Point your phone at it. The bank knows what to do.",
      "That square is the gate to my hay. Access granted.",
    ],
    tip: [
      "Good choice. Every choice that ends in hay is a good one.",
      "400, 800, 1,600… lovely numbers. They smell of hay.",
    ],
    share: [
      "Share it. I can't bray across the whole internet alone.",
      "Every share = maybe another bale. Donkey math.",
    ],
    darujme: [
      "Darujme.cz — for those who don't trust squares made of pixels. Also good.",
      "Card, transfer, whatever. Just make it rustle with hay.",
    ],
    transparentni: [
      "Just take a look. I watch every crown. Personally.",
      "Transparent as the fresh air on the Meadow.",
    ],
    hra: [
      "Yeah, the game about me. Finally the fame I deserve.",
      "In the game I run faster. Here I save energy for eating.",
    ],
  },
  hero: {
    eyebrow: "A fundraiser under my direction",
    title: "HAY. I need it. Lots of it.",
    subtitle:
      "I'm Karel, the donkey from the Meadow, and this is my fundraiser. The humans wrote it up quite nicely, so I took it into my own hooves. Goal: a full barn. Deadline: before winter. Reason: mostly me.",
  },
  story: {
    eyebrow: "The way I see it",
    title: "Situation: serious. Me: hungry.",
    paragraphs: [
      "This is the worst drought I can remember — and I remember a lot. The meadows yielded almost nothing and the whole region is after hay. And we (surprise!) don't harvest it, we buy it. Every year, for the whole herd.",
      "A bale that cost 500 Kč last year is 800 to 1,000 Kč this year — and rising. That's why we're buying right now, while there's any hay at all. Waiting is for rabbits. No offence, rabbits.",
      "And now my favourite paragraph — appetite. The cows Avala and Květa each put away about 15 kilos of hay a day. Me, a modest ten — and they call me greedy. Add eight sheep, two lambs, the mouflon Yakul, the piglets and the aforementioned rabbits. Through winter it all comes from the barn.",
      "The goal is 100,000 Kč — at this year's prices roughly 125 bales, the whole winter supply for the herd. Every crown goes through a transparent account straight to hay. I keep an eye on it. I've got the eye for it. A big one.",
    ],
  },
  meter: {
    eyebrow: "Trough status",
    title: "How much is in the trough",
    description:
      "A human updates the meter from the transparent account. I'd only help myself, so they wouldn't let me near it.",
  },
  payment: {
    eyebrow: "To the point",
    title: "Hand it over",
    description:
      "QR code, phone, bank, done. Pick the amount yourself — the donkey exchange rate is below the code.",
  },
  tips: [
    { amount: "400 Kč", covers: "half a bale — even a half smells good" },
    { amount: "800 Kč", covers: "a whole bale = my happy day" },
    { amount: "1 600 Kč", covers: "two bales — I'll bray for you personally" },
  ],
  ways: [
    {
      key: "darujme",
      title: "Darujme.cz",
      text: "Don't trust squares made of pixels? I get it. Darujme.cz is a verified portal — card or transfer, and my hay is a step closer.",
      ctaLabel: "Donate online",
      sticker: "Muzzle-approved. ✓",
    },
    {
      key: "transparentni",
      title: "Transparent account",
      text: "You can see every crown. The transactions at Fio bank are public and I watch them personally. Go and see for yourself.",
      ctaLabel: "View transactions",
      sticker: "I don't eat numbers. I just watch them.",
    },
    {
      key: "hra",
      title: "Play Louka Run",
      text: "A game about me. Finally. I run after carrots across our Meadow — and if you donate 200 Kč or more to the fundraiser, write to us and you'll get access to the game as a thank-you.",
      ctaLabel: "More about the game",
      sticker: "Starring: me!",
    },
    {
      key: "share",
      title: "Share the fundraiser",
      text: "Can't donate? Pass nechmerust.org/seno along. I can't bray across the whole internet by myself.",
      ctaLabel: null,
      sticker: "Sorry, bit of drool. — K.",
    },
  ],
};

export function getKarelTexts(locale: Locale): KarelTexts {
  return locale === "en" ? EN : CS;
}
