/** Karlovy hlášky pro web — psané nově v duchu hry, žádná není zkopírovaná ze hry. */

export type KarelSection = "hero" | "gate" | "characters" | "worlds" | "play";

export const KAREL_QUOTES: Record<KarelSection, string[]> = {
  hero: [
    "Vítej na mojí louce. Teda… na jejím webu. Trávu si laskavě představ.",
    "Jo, to jsem já. Menší, pixelovatější, ale pořád šéf.",
    "Scrolluj dál. Já tu budu. Já jsem tu vždycky.",
  ],
  gate: [
    "Bez kódu dál nemůžeš. Já pravidla nevymyslel. Teda vymyslel, ale dobrý, ne?",
    "Cedule normálně okusuju, ale tahle je důležitá. Zatím.",
    "Dar pro zvířata, kód pro tebe. Férovější obchod jsem neviděl — a to jsem viděl trh s mrkvemi.",
  ],
  characters: [
    "Tohle jsou moji kamarádi. Vybírej pečlivě — stejně je ale nejlepší ten černej vlevo nahoře.",
    "Každý z nich něco umí. Já umím všechno, ale nechci machrovat.",
    "Otoč si kartu. Jo, jsou skuteční. I já. Hlavně já.",
  ],
  worlds: [
    "Šest světů a všechny moje. Jen ta hvězdná noc mě trochu děsí, ale to nikomu neříkej.",
    "V sadu jsem jednou snědl něco, co nebyla mrkev. Víc k tomu neřeknu.",
    "Prohrát tu nejde. Zařídil jsem to. Není zač.",
  ],
  play: [
    "Prý budu i v mobilu. Doufám, že tam budou dobíjet mrkve.",
    "150 korun, žádné reklamy. Reklamy bych stejně okousal.",
    "Až budu v mobilu, budu ti hýkat z kapsy. Těš se.",
  ],
};

export const KAREL_RANDOM: string[] = [
  "Hýkám, tedy jsem… počkat, to už jsem někde říkal?",
  "Tenhle web řídím já. Programátor si jen myslí, že ne.",
  "Scrolluješ hezky. Máš talent. Na mrkev to ale nestačí.",
  "Klikáš na mě. Chápu to, jsem fešák.",
  "Víš, co je lepší než jedna mrkev? Špatná otázka. Mrkev je vždycky správně.",
  "Uši mám velké, abych slyšel, když někdo otevírá pytel s krmením. Přes celý web.",
  "Nejdřív mě naklikáš, pak mě naběháš. Takhle to tu chodí.",
  "Tohle není moje finální podoba. Ve hře jsem ještě rychlejší.",
  "Kdyby ses ztratil, jsem ten černý s bílým čumákem. Nezaměnitelný.",
  "Ještě klik a začnu si účtovat mrkve.",
];
