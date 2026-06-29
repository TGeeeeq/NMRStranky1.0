import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";

export const metadata: Metadata = {
  title: "Výroční zpráva 2025",
  description:
    "Rok 2025 na Louce měsíc po měsíci — příchody i odchody, brigády, sbírky a naděje. Výroční zpráva spolku Nech mě růst z.s.",
  alternates: { canonical: "/vyrocni-zprava-2025" },
};

type MonthLink = { label: string; href: string };

type Block =
  | { type: "p"; text: string }
  | { type: "note"; title?: string; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; intro?: string; items: string[] };

type ReportImage = { src: string; alt: string; w: number; h: number };

type Month = {
  name: string;
  emoji: string;
  images?: ReportImage[];
  blocks: Block[];
  links?: MonthLink[];
};

const months: Month[] = [
  {
    name: "Leden",
    emoji: "🐾",
    images: [
      { src: "/assets/eda.webp", alt: "Beran Eda, nový obyvatel Louky", w: 1200, h: 1168 },
    ],
    blocks: [
      {
        type: "p",
        text: "Silvestr a Nový rok Tomáš odstartoval na veterině s Rikym, u kterého se objevily močové kameny. Musel podstoupit náročnou operaci a následně dlouhou rekonvalescenci. Bylo to náročné, ale zvládl to, borec náš malej.",
      },
      {
        type: "p",
        text: "Zároveň k nám přišel nový obyvatel a největší mazel — beran Eda. Taky jsme vyrazili na první společné toulky.",
      },
    ],
  },
  {
    name: "Únor",
    emoji: "🥣",
    blocks: [
      {
        type: "p",
        text: "Znovu jsme započali spolupráci s iniciativami Nakrm nás a ClickAndFeed.cz. Děkujeme za plná bříška!",
      },
      {
        type: "p",
        text: "Je to skvělá podpora pro naše pejsky a kočičky a jsme za ni moc vděční.",
      },
    ],
    links: [
      { label: "Nakrm nás", href: "https://www.nakrmnas.cz/nech-me-rust/" },
      { label: "ClickAndFeed.cz", href: "https://clickandfeed.cz/" },
    ],
  },
  {
    name: "Březen",
    emoji: "🌱",
    blocks: [
      {
        type: "p",
        text: "Začátkem března proběhla jedna soukromá a týden na to veřejná procházka se zvířaty a uspořádali jsme spontánní brigádu. Děkujeme za účast a vaši podporu.",
      },
      {
        type: "p",
        text: "Tomáš začal stavět foliovník z bývalé ptačí voliéry.",
      },
      {
        type: "p",
        text: "Naše kobylka Zorinka onemocněla… No, už má svůj věk, holka naše. Připravujeme jí speciální stravu, protože nemůže pořádně kousat.",
      },
    ],
  },
  {
    name: "Duben",
    emoji: "🌾",
    blocks: [
      { type: "p", text: "V dubnu jsme opět naváželi seno." },
      {
        type: "p",
        text: "Pořídili jsme rohože na zpevnění povrchu u velkých zvířátek. Nainstalovat je byla sice fuška, ale naše velká zvířátka si to už zasloužila.",
      },
    ],
  },
  {
    name: "Květen",
    emoji: "🍄",
    blocks: [
      {
        type: "p",
        text: "V květnu se naráz odstěhovaly obě dvě Kateřinky a začíná tak nová etapa… Tomáš zůstává na louce sám. Obě ale budou občas jezdit na výpomoc, stejně jako Tony.",
      },
      {
        type: "p",
        text: "Dodělaváme ohradu u maringotky, rozšiřujeme dvůr a tím získáváme novou pastvu pro kravičky, Karla a Zorinku.",
      },
      {
        type: "p",
        text: "Začaly nám krásně růst dřevokazné houby darované od mushroomplanet.eu.",
      },
    ],
    links: [
      { label: "mushroomplanet.eu", href: "https://www.instagram.com/mushroomplanet.eu" },
    ],
  },
  {
    name: "Červen",
    emoji: "✂️",
    blocks: [
      {
        type: "p",
        text: "V červnu jsme společně s pomocí Natalie a Jardy, kteří k nám přijeli na Zažít Louku, ostříhali ovečky. Taková pomoc se nám fakt hodila a pro ně to byl opravdový zážitek.",
      },
      {
        type: "p",
        text: "Byla spuštěna sbírka na seno na Donio. V červnu jsme se také domluvili s obcí na vzájemné výpomoci — posekali jsme okolní příkopy a výměnou měli trochu sena navíc pro naše zvířátka. Nakonec nám posečení příkopů dalo na 3 balíky sena.",
      },
      {
        type: "p",
        text: "A koncem června jsme dovezli další várku sena — děkujeme všem, kteří přispěli na Donio!",
      },
    ],
  },
  {
    name: "Červenec",
    emoji: "🌙",
    images: [
      { src: "/assets/lucinka.webp", alt: "Ovečka Lucinka, nová průzkumnice Louky", w: 800, h: 934 },
    ],
    blocks: [
      {
        type: "p",
        text: "11.–13. července proběhla první letní brigáda, které se nakonec zúčastnila spousta úžasných lidí a udělala se spousta práce. Zúčastnila se jí i Maria — která nás objevila přes rozhovor pro Hovory ze Země a louka ji zavolala. Nakonec se rozhodla, že se k nám na podzim přestěhuje spolu s pejskem Kesu a bude s námi spolutvořit.",
      },
      {
        type: "p",
        text: "Koncem července se Tomáš účastnil jako vedoucí tábora na Farmě naděje — jednu noc spolu s děckami vyrazili i k nám na louku a přespali pod hvězdami. Děti byly samozřejmě naprosto nadšené. Je pro nás radost sdílet náš život s mladou generací a inspirovat ji k soucitnému životu v harmonii s přírodou a zvířaty.",
      },
      {
        type: "note",
        title: "Rozloučení se Zorinkou",
        text: "Koncem července nás opustila Zorinka. Najednou ji přepadly bolesti (pravděpodobně kolika), ale mohlo jít celkově o selhání trávicího traktu. Přeci jen už to byla bábinka — 26 let. Přesto bojovala ze všech sil a my s ní. Udělali jsme opravdu vše, co bylo v našich silách. Po dlouhé noci nám nakonec ráno odešla v náručí. Byl to pro nás opravdu silný zážitek — který nám ale pomohl znovu si uvědomit, proč těmto bytostem chceme a stojí za to pomáhat: dát jim láskyplný prostor a zajistit jim co nejvíce svobody. Je to naše poslání — budovat soucitný prostor, kde má každý své místo.",
      },
      {
        type: "quote",
        text: "Růst a nechat růst — udělat, co je v našich silách pro záchranu, ale když přijde čas, nechat odejít.",
      },
      {
        type: "p",
        text: "Zároveň jsme ale přijali další úžasnou bytost do naší ovčí party — bábinku Lucinku, která žila osamělý život a nikdy nespatřila svůj druh. Velmi rychle se ale zařadila do našeho stáda a teď je z ní hlavní veselá a zvědavá průzkumnice celé louky.",
      },
    ],
  },
  {
    name: "Srpen",
    emoji: "🎃",
    images: [
      { src: "/assets/anaya.webp", alt: "Ovečka Anaya, nová parťačka Louky", w: 1771, h: 1000 },
      { src: "/assets/yakul.webp", alt: "Malý muflonek Yakkul", w: 3468, h: 4624 },
    ],
    blocks: [
      { type: "p", text: "Druhá loukáda ve znamení tvoření zásob dřeva." },
      {
        type: "p",
        text: "Začátkem srpna jsme přijali další parťáky — krásnou ovečku Anayu a 3měsíční miminko, muflonka Yakkula, kterého k nám dovezly holky ze záchranné stanice v Praze. Byl předčasně narozený a neměl moc naděje, že by ho stádo přijalo, a tak přišel k nám. A tady se stal velkým parťákem, zatím spíše psí a lidské smečky, ale je to úžasně mazaný průzkumník a malý šéfík.",
      },
      {
        type: "p",
        text: "Dýňová sezóna. Jako každý rok jsme se účastnili Dýňového světa ve statku u Pipků — naše každoročně nabité období, kdy brigádničíme, prodáváme se stánkem a současně udržujeme chod louky. Byla to fuška, ale společně jsme to dali. Přidala se k nám Maria i obě Kateřinky. Na závěr jsme naplnili sklad dýněmi pro zvířátka.",
      },
    ],
    links: [
      { label: "Statek u Pipků – Dýňový svět", href: "https://www.dynovysvet.cz/" },
    ],
  },
  {
    name: "Září",
    emoji: "🍂",
    blocks: [
      {
        type: "p",
        text: "V září se nám zaběhl Listík. Pročesávali jsme okolí, vyvěsili letáky po okolních vesnicích a všude na internetu. Bohužel se ale doposud neobjevil. Moc nám chybí, protože to byl úžasně veselý a divoký parťák, přinesl sem krásnou energii a byl Tomášovi velkou podporou v nelehkých časech. Věříme ale, že je mu krásně, ať je kdekoliv, a dál šíří svou úžasnou energii.",
      },
    ],
  },
  {
    name: "Říjen",
    emoji: "🐷",
    images: [
      { src: "/assets/princezna.webp", alt: "Prasinka Princezna", w: 6048, h: 4024 },
    ],
    blocks: [
      {
        type: "p",
        text: "Opět jsme se zapojili do celorepublikové sbírky DEN ZVÍŘAT 2025 pořádané organizací Běhejme a pomáhejme útulkům. Účastní se jí 160 útulků a sbírka končí v lednu. Už teď vybraná částka značně přesahuje tu z minulého roku. Je úžasné vidět, jaká solidarita u nás v republice roste.",
      },
      {
        type: "p",
        text: "Koncem října jsme jeli na operaci do Prahy s Princeznou (naší prasinkou). Již nějakou dobu se zhoršoval její stav a měla bolesti. Nakonec jí vyoperovali obrovský nádor z dělohy. Vše ale skvěle zvládla a brzy se začala zocelovat — teď je opět ve svém živlu. Pravděpodobně ji ale bude čekat další operace. Už ta první byla náročná, proto jsme nesmírně vděční za podporu všech dobrých lidí.",
      },
    ],
    links: [
      { label: "Běh pro útulky", href: "https://www.behproutulky.cz/" },
      { label: "Instagram Běh pro útulky", href: "https://www.instagram.com/behproutulky/" },
    ],
  },
  {
    name: "Listopad",
    emoji: "🏡",
    blocks: [
      {
        type: "p",
        text: "V listopadu jsme pak kvůli zdravotnímu stavu některých zvířátek i lidských členů byli nuceni zrušit plánovanou brigádu i procházku.",
      },
      {
        type: "p",
        text: "Naše naděje, že se nám Listík vrátí, začala opadat jako barevné listí. Byl nám (a hlavně Tomášovi) zářivým a nezbedným plamínkem v časech, kdy světla bylo méně. Jsme ti za všechno vděční a snad se opět spatříme.",
      },
      {
        type: "p",
        text: "Rozšířili a vylepšili jsme domečky pro zvířátka, opravili kuchyň a zakryli její terasu. Nadále spolupracujeme s organizací Nakrm nás, díky které nám přicházejí dary pro zvířátka od našich podporovatelů, a koncem roku se znovu zapojujeme do iniciativy Click and Feed.",
      },
    ],
    links: [
      { label: "Click and Feed", href: "https://clickandfeed.cz/" },
    ],
  },
  {
    name: "Prosinec",
    emoji: "✨",
    images: [
      { src: "/assets/prochazka.webp", alt: "Závěrečná procházka se zvířaty", w: 1080, h: 1920 },
    ],
    blocks: [
      {
        type: "p",
        text: "V prosinci proběhla procházka se zvířaty, která tak trochu uzavírá náš rok.",
      },
      {
        type: "p",
        text: "Celý tento rok pro nás byl hluboce transformační, plný změn, odchodů a příchodů, pádů a nových nadějí. Tomáš byl na louce dlouho sám a udržovat azyl v chodu v jednom člověku s cca 100 zvířaty opravdu není jednoduché. Nevzdal to, vydržel s nadějí a odevzdáním se procesu… a tak mohli přijít noví lidé s novou energií a společnou vizí.",
      },
      {
        type: "note",
        title: "Velká radost na závěr",
        text: "Příští rok nás čeká opravdu mnoho nového a krásného, tím jsme si jisti. Tomáš s Mariou totiž čekají miminko. A to se stává jejich velkým hnacím motorem a prioritou. Chceme žít pro naši rodinu a dál budovat tento rodový statek s úctou ke všemu živému.",
      },
      {
        type: "list",
        intro: "Co plánujeme do dalšího roku:",
        items: [
          "Dál se učit o bylinkách a jejich využívání.",
          "Pozorovat přírodu, následovat její cykly, být v úctě a dávat zpět.",
          "Pěstovat vlastní zeleninu a být více a více soběstační.",
          "Dostavět domeček nám i zvířátkům a dobudovat zázemí pro celou naši rodinu — i tu zvířecí.",
          "Pořídit více solárních panelů a dokopat studnu.",
          "Více otevírat azyl lidem, kteří chtějí zpomalit a napojit se na přírodu a zvířata.",
          "Více zapracovat na naší virtuální identitě.",
        ],
      },
    ],
  },
];

function MonthBlock({ block }: { block: Block }) {
  if (block.type === "note") {
    return (
      <div className="rounded-md border-l-4 border-terracotta bg-surface-alt p-4">
        {block.title ? (
          <p className="font-semibold text-moss-deep">{block.title}</p>
        ) : null}
        <p className="mt-1 text-sm leading-relaxed text-text-muted">{block.text}</p>
      </div>
    );
  }
  if (block.type === "quote") {
    return (
      <blockquote className="border-l-4 border-moss bg-moss/5 py-2 pl-5 font-serif text-lg italic leading-relaxed text-moss-deep">
        {block.text}
      </blockquote>
    );
  }
  if (block.type === "list") {
    return (
      <div>
        {block.intro ? (
          <p className="font-medium text-moss-deep">{block.intro}</p>
        ) : null}
        <ul className="mt-3 space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-text">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-pill bg-moss" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return <p className="leading-relaxed">{block.text}</p>;
}

/** Photos for a month. A single landscape photo fills a 16/9 frame; portrait
 *  (or near-square) photos are shown whole on a soft backdrop so nothing gets
 *  cropped. Multiple photos render as an even gallery, each kept whole. */
function MonthMedia({ images }: { images: ReportImage[] }) {
  if (images.length === 1) {
    const img = images[0];
    const landscape = img.w / img.h >= 1.2;
    return landscape ? (
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="(min-width: 768px) 680px, 100vw"
          className="object-cover"
        />
      </div>
    ) : (
      <div className="relative h-[24rem] bg-surface-alt sm:h-[28rem]">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="(min-width: 768px) 680px, 100vw"
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-3 bg-surface-alt p-3 sm:grid-cols-2">
      {images.map((img) => (
        <div key={img.src} className="relative h-60 sm:h-64">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 768px) 340px, 100vw"
            className="rounded-md object-contain"
          />
        </div>
      ))}
    </div>
  );
}

function MonthCard({ month }: { month: Month }) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-surface shadow-soft">
      {month.images?.length ? <MonthMedia images={month.images} /> : null}
      <div className="p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-semibold text-moss-deep">
          <span className="mr-2" aria-hidden>
            {month.emoji}
          </span>
          {month.name}
        </h2>
        <div className="mt-4 space-y-4 text-text">
          {month.blocks.map((b, i) => (
            <MonthBlock key={i} block={b} />
          ))}
        </div>
        {month.links?.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {month.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-pill border border-border px-4 py-2 text-sm font-medium text-moss-deep transition-colors hover:bg-surface-alt"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function VyrocniZprava2025() {
  return (
    <>
      <PageHero
        image="/assets/about-hero.webp"
        imageAlt="Rok na Louce"
        eyebrow="Výroční zpráva 2025"
        title="Rok 2025 na Louce"
        subtitle="Měsíc po měsíci — příchody i odchody, brigády, sbírky a naděje. Tohle je náš společný rok."
      />

      {/* Úvod */}
      <section className="bg-surface py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal className="space-y-5 text-lg leading-relaxed text-text">
            <p>
              Rok 2025 byl pro nás hluboce transformační — plný změn, odchodů
              i příchodů, pádů i nových nadějí. Provedeme vás jím tak, jak jsme ho
              prožívali: měsíc po měsíci, se vším, co k životu na azylu patří.
            </p>
            <p className="text-base text-text-muted">
              Starší výroční zprávy i stanovy spolku najdete ve sbírce listin na
              portálu Justice.cz.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Časová osa měsíců */}
      <section className="bg-surface-alt py-16 sm:py-20">
        <Container className="max-w-3xl">
          <ol className="relative space-y-10 sm:space-y-12 sm:before:absolute sm:before:bottom-4 sm:before:left-[19px] sm:before:top-4 sm:before:w-px sm:before:bg-border">
            {months.map((m, i) => (
              <li key={m.name} className="relative sm:pl-16">
                <span
                  aria-hidden
                  className="absolute left-0 top-1 hidden h-10 w-10 items-center justify-center rounded-pill border border-border bg-surface text-lg shadow-soft sm:flex"
                >
                  {m.emoji}
                </span>
                <Reveal delay={(i % 2) * 0.05}>
                  <MonthCard month={m} />
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Závěrečné poděkování */}
      <section className="grain-overlay relative isolate overflow-hidden bg-moss-deep py-20 sm:py-24">
        <div aria-hidden className="bg-aurora absolute inset-0 -z-10 opacity-25" />
        <Container className="max-w-2xl text-center">
          <Reveal>
            <p className="font-serif text-2xl font-medium leading-relaxed text-cream sm:text-3xl">
              Jsme neskonale vděční všem, kteří s námi kráčejí na této cestě, jsou
              nám podporou a velkou pomocí. Bez nich by to opravdu nešlo.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/jak-se-zapojit"
                className="rounded-pill bg-accent px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                Zapojte se
              </Link>
              <Link
                href="/o-nas"
                className="rounded-pill border border-cream/30 px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-cream/10"
              >
                Zpět na O nás
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <SocialSection />
    </>
  );
}
