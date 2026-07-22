/** Karlovy hlášky pro web — psané nově v duchu hry, žádná není zkopírovaná ze hry. */

import type { Locale } from "@/lib/i18n";

export type KarelSection = "hero" | "gate" | "characters" | "worlds" | "play";

export const KAREL_QUOTES: Record<Locale, Record<KarelSection, string[]>> = {
  cs: {
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
      "Tak jsem oficiálně v mobilu. Google mě schválil. Rozumný chlapík.",
      "Žádné reklamy ve hře. Reklamy bych stejně okousal.",
      "Stáhni si mě. Budu ti hýkat z kapsy. Není zač.",
    ],
  },
  en: {
    hero: [
      "Welcome to my meadow. Well… to its website. Kindly imagine the grass.",
      "Yep, that's me. Smaller, more pixelated, but still the boss.",
      "Scroll on. I'll be here. I'm always here.",
    ],
    gate: [
      "No code, no entry. I didn't make the rules. Okay, I did — but they're good, right?",
      "I usually chew signs to bits, but this one matters. For now.",
      "A gift for the animals, a code for you. Fairest deal I've seen — and I've seen the carrot market.",
    ],
    characters: [
      "These are my friends. Choose carefully — though the black one, top left, is still the best.",
      "Each of them can do something. I can do everything, but I don't like to show off.",
      "Flip a card. Yes, they're real. So am I. Especially me.",
    ],
    worlds: [
      "Six worlds and all of them mine. Only that starry night spooks me a little — but don't tell anyone.",
      "In the orchard I once ate something that wasn't a carrot. I'll say no more.",
      "You can't lose here. I arranged it. You're welcome.",
    ],
    play: [
      "So I'm officially on your phone now. Google approved me. Sensible fellow.",
      "No ads in the game. I'd have chewed the ads up anyway.",
      "Download me. I'll bray from your pocket. You're welcome.",
    ],
  },
};

export const KAREL_RANDOM: Record<Locale, string[]> = {
  cs: [
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
  ],
  en: [
    "I bray, therefore I am… wait, did I say that already?",
    "I run this website. The programmer just thinks he does.",
    "You scroll nicely. You've got talent. Not enough for a carrot, though.",
    "You're clicking on me. I get it, I'm a looker.",
    "Know what's better than one carrot? Wrong question. A carrot is always the answer.",
    "My ears are big so I can hear someone opening a feed bag. Across the whole website.",
    "First you click me, then you run me. That's how it works around here.",
    "This isn't my final form. In the game I'm even faster.",
    "If you get lost, I'm the black one with the white muzzle. Unmistakable.",
    "One more click and I start charging carrots.",
  ],
};
