import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { getLocale } from "@/lib/i18n.server";
import { pick, type Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, { cs: "Výroční zpráva 2025", en: "Annual report 2025" }),
    description: pick(locale, {
      cs: "Rok 2025 na Louce měsíc po měsíci — příchody i odchody, brigády, sbírky a naděje. Výroční zpráva spolku Nech mě růst z.s.",
      en: "The year 2025 at the Meadow month by month — arrivals and farewells, work days, fundraisers and hope. The annual report of Nech mě růst z.s.",
    }),
    alternates: { canonical: "/vyrocni-zprava-2025" },
  };
}

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

function buildMonths(locale: Locale): Month[] {
  const t = (cs: string, en: string) => (locale === "en" ? en : cs);
  return [
  {
    name: t("Leden", "January"),
    emoji: "🐾",
    images: [
      { src: "/assets/eda.webp", alt: t("Beran Eda, nový obyvatel Louky", "The ram Eda, a new resident of the Meadow"), w: 1200, h: 1168 },
    ],
    blocks: [
      {
        type: "p",
        text: t(
          "Silvestr a Nový rok Tomáš odstartoval na veterině s Rikym, u kterého se objevily močové kameny. Musel podstoupit náročnou operaci a následně dlouhou rekonvalescenci. Bylo to náročné, ale zvládl to, borec náš malej.",
          "Tomáš saw in New Year's Eve and New Year's Day at the vet with Riky, who had developed urinary stones. He had to undergo a demanding operation and then a long recovery. It was tough, but he pulled through — our little champ.",
        ),
      },
      {
        type: "p",
        text: t(
          "Zároveň k nám přišel nový obyvatel a největší mazel — beran Eda. Taky jsme vyrazili na první společné toulky.",
          "At the same time a new resident and the biggest sweetheart arrived — the ram Eda. We also set out on our first walks together.",
        ),
      },
    ],
  },
  {
    name: t("Únor", "February"),
    emoji: "🥣",
    blocks: [
      {
        type: "p",
        text: t(
          "Znovu jsme započali spolupráci s iniciativami Nakrm nás a ClickAndFeed.cz. Děkujeme za plná bříška!",
          "We renewed our cooperation with the Nakrm nás and ClickAndFeed.cz initiatives. Thank you for the full tummies!",
        ),
      },
      {
        type: "p",
        text: t(
          "Je to skvělá podpora pro naše pejsky a kočičky a jsme za ni moc vděční.",
          "It's wonderful support for our dogs and cats, and we're very grateful for it.",
        ),
      },
    ],
    links: [
      { label: "Nakrm nás", href: "https://www.nakrmnas.cz/nech-me-rust/" },
      { label: "ClickAndFeed.cz", href: "https://clickandfeed.cz/" },
    ],
  },
  {
    name: t("Březen", "March"),
    emoji: "🌱",
    blocks: [
      {
        type: "p",
        text: t(
          "Začátkem března proběhla jedna soukromá a týden na to veřejná procházka se zvířaty a uspořádali jsme spontánní brigádu. Děkujeme za účast a vaši podporu.",
          "In early March we held one private and, a week later, a public walk with the animals, and we organised a spontaneous work day. Thank you for coming and for your support.",
        ),
      },
      {
        type: "p",
        text: t(
          "Tomáš začal stavět foliovník z bývalé ptačí voliéry.",
          "Tomáš started building a polytunnel out of a former bird aviary.",
        ),
      },
      {
        type: "p",
        text: t(
          "Naše kobylka Zorinka onemocněla… No, už má svůj věk, holka naše. Připravujeme jí speciální stravu, protože nemůže pořádně kousat.",
          "Our mare Zorinka fell ill… well, she's getting on in years, our girl. We're preparing her a special diet, because she can no longer chew properly.",
        ),
      },
    ],
  },
  {
    name: t("Duben", "April"),
    emoji: "🌾",
    blocks: [
      { type: "p", text: t("V dubnu jsme opět naváželi seno.", "In April we brought in hay again.") },
      {
        type: "p",
        text: t(
          "Pořídili jsme rohože na zpevnění povrchu u velkých zvířátek. Nainstalovat je byla sice fuška, ale naše velká zvířátka si to už zasloužila.",
          "We got mats to firm up the ground where the big animals are. Installing them was hard work, but our big animals had earned it.",
        ),
      },
    ],
  },
  {
    name: t("Květen", "May"),
    emoji: "🍄",
    blocks: [
      {
        type: "p",
        text: t(
          "V květnu se naráz odstěhovaly obě dvě Kateřinky a začíná tak nová etapa… Tomáš zůstává na louce sám. Obě ale budou občas jezdit na výpomoc, stejně jako Tony.",
          "In May both Kateřinas moved away at once, and so a new chapter begins… Tomáš is left at the Meadow on his own. But both will drop by to help out now and then, as will Tony.",
        ),
      },
      {
        type: "p",
        text: t(
          "Dodělaváme ohradu u maringotky, rozšiřujeme dvůr a tím získáváme novou pastvu pro kravičky, Karla a Zorinku.",
          "We're finishing the enclosure by the caravan and expanding the yard, which gives us new pasture for the cows, Karel and Zorinka.",
        ),
      },
      {
        type: "p",
        text: t(
          "Začaly nám krásně růst dřevokazné houby darované od mushroomplanet.eu.",
          "The wood-decay mushrooms donated by mushroomplanet.eu started growing beautifully.",
        ),
      },
    ],
    links: [
      { label: "mushroomplanet.eu", href: "https://www.instagram.com/mushroomplanet.eu" },
    ],
  },
  {
    name: t("Červen", "June"),
    emoji: "✂️",
    blocks: [
      {
        type: "p",
        text: t(
          "V červnu jsme společně s pomocí Natalie a Jardy, kteří k nám přijeli na Zažít Louku, ostříhali ovečky. Taková pomoc se nám fakt hodila a pro ně to byl opravdový zážitek.",
          "In June, with the help of Natalie and Jarda — who came to us for a „Live the Meadow“ stay — we sheared the sheep. That help really came in handy, and for them it was a real experience.",
        ),
      },
      {
        type: "p",
        text: t(
          "Byla spuštěna sbírka na seno na Donio. V červnu jsme se také domluvili s obcí na vzájemné výpomoci — posekali jsme okolní příkopy a výměnou měli trochu sena navíc pro naše zvířátka. Nakonec nám posečení příkopů dalo na 3 balíky sena.",
          "We launched a hay fundraiser on Donio. In June we also arranged a mutual help agreement with the municipality — we mowed the surrounding ditches and in exchange got a little extra hay for our animals. Mowing the ditches ultimately gave us about 3 bales of hay.",
        ),
      },
      {
        type: "p",
        text: t(
          "A koncem června jsme dovezli další várku sena — děkujeme všem, kteří přispěli na Donio!",
          "And at the end of June we brought in another batch of hay — thank you to everyone who donated on Donio!",
        ),
      },
    ],
  },
  {
    name: t("Červenec", "July"),
    emoji: "🌙",
    images: [
      { src: "/assets/lucinka.webp", alt: t("Ovečka Lucinka, nová průzkumnice Louky", "The sheep Lucinka, the Meadow's new explorer"), w: 800, h: 934 },
    ],
    blocks: [
      {
        type: "p",
        text: t(
          "11.–13. července proběhla první letní brigáda, které se nakonec zúčastnila spousta úžasných lidí a udělala se spousta práce. Zúčastnila se jí i Maria — která nás objevila přes rozhovor pro Hovory ze Země a louka ji zavolala. Nakonec se rozhodla, že se k nám na podzim přestěhuje spolu s pejskem Kesu a bude s námi spolutvořit.",
          "On 11–13 July we held our first summer work camp, which in the end drew a lot of wonderful people and got a lot of work done. Maria took part too — she found us through an interview for the show Hovory ze Země, and the Meadow called to her. In the end she decided to move in with us in the autumn together with her dog Kesu and to co-create this place with us.",
        ),
      },
      {
        type: "p",
        text: t(
          "Koncem července se Tomáš účastnil jako vedoucí tábora na Farmě naděje — jednu noc spolu s děckami vyrazili i k nám na louku a přespali pod hvězdami. Děti byly samozřejmě naprosto nadšené. Je pro nás radost sdílet náš život s mladou generací a inspirovat ji k soucitnému životu v harmonii s přírodou a zvířaty.",
          "At the end of July Tomáš helped lead a camp at Farma naděje (Farm of Hope) — one night he and the kids came over to our meadow and slept under the stars. The children were, of course, absolutely thrilled. It's a joy for us to share our life with the younger generation and inspire them toward a compassionate life in harmony with nature and animals.",
        ),
      },
      {
        type: "note",
        title: t("Rozloučení se Zorinkou", "Saying goodbye to Zorinka"),
        text: t(
          "Koncem července nás opustila Zorinka. Najednou ji přepadly bolesti (pravděpodobně kolika), ale mohlo jít celkově o selhání trávicího traktu. Přeci jen už to byla bábinka — 26 let. Přesto bojovala ze všech sil a my s ní. Udělali jsme opravdu vše, co bylo v našich silách. Po dlouhé noci nám nakonec ráno odešla v náručí. Byl to pro nás opravdu silný zážitek — který nám ale pomohl znovu si uvědomit, proč těmto bytostem chceme a stojí za to pomáhat: dát jim láskyplný prostor a zajistit jim co nejvíce svobody. Je to naše poslání — budovat soucitný prostor, kde má každý své místo.",
          "At the end of July Zorinka left us. She was suddenly overcome by pain (probably colic), though it may have been an overall failure of her digestive tract. After all, she was an old lady — 26 years. Even so she fought with all her strength, and we fought with her. We truly did everything in our power. After a long night, she finally passed away in our arms in the morning. It was a truly powerful experience for us — but one that helped us realise again why we want to, and why it is worth it, to help these beings: to give them a loving space and as much freedom as possible. That is our mission — to build a compassionate space where everyone has their place.",
        ),
      },
      {
        type: "quote",
        text: t(
          "Růst a nechat růst — udělat, co je v našich silách pro záchranu, ale když přijde čas, nechat odejít.",
          "To grow and let grow — to do all we can to save them, but when the time comes, to let them go.",
        ),
      },
      {
        type: "p",
        text: t(
          "Zároveň jsme ale přijali další úžasnou bytost do naší ovčí party — bábinku Lucinku, která žila osamělý život a nikdy nespatřila svůj druh. Velmi rychle se ale zařadila do našeho stáda a teď je z ní hlavní veselá a zvědavá průzkumnice celé louky.",
          "At the same time we welcomed another wonderful being into our sheep gang — old Lucinka, who had lived a lonely life and had never seen another of her kind. She quickly joined our flock, though, and now she's the cheerful, curious chief explorer of the whole meadow.",
        ),
      },
    ],
  },
  {
    name: t("Srpen", "August"),
    emoji: "🎃",
    images: [
      { src: "/assets/anaya.webp", alt: t("Ovečka Anaya, nová parťačka Louky", "The sheep Anaya, a new companion at the Meadow"), w: 1771, h: 1000 },
      { src: "/assets/yakul.webp", alt: t("Malý muflonek Yakkul", "Little mouflon Yakkul"), w: 3468, h: 4624 },
    ],
    blocks: [
      { type: "p", text: t("Druhá loukáda ve znamení tvoření zásob dřeva.", "The second Loukáda, this time all about stocking up on firewood.") },
      {
        type: "p",
        text: t(
          "Začátkem srpna jsme přijali další parťáky — krásnou ovečku Anayu a 3měsíční miminko, muflonka Yakkula, kterého k nám dovezly holky ze záchranné stanice v Praze. Byl předčasně narozený a neměl moc naděje, že by ho stádo přijalo, a tak přišel k nám. A tady se stal velkým parťákem, zatím spíše psí a lidské smečky, ale je to úžasně mazaný průzkumník a malý šéfík.",
          "In early August we took in more companions — the beautiful sheep Anaya and a 3-month-old baby, the mouflon Yakkul, brought to us by the women from a rescue station in Prague. He was born prematurely and had little hope of being accepted by a herd, so he came to us. And here he became a great companion — so far mostly of the dog and human pack — but he's a wonderfully clever explorer and a little boss.",
        ),
      },
      {
        type: "p",
        text: t(
          "Dýňová sezóna. Jako každý rok jsme se účastnili Dýňového světa ve statku u Pipků — naše každoročně nabité období, kdy brigádničíme, prodáváme se stánkem a současně udržujeme chod louky. Byla to fuška, ale společně jsme to dali. Přidala se k nám Maria i obě Kateřinky. Na závěr jsme naplnili sklad dýněmi pro zvířátka.",
          "Pumpkin season. As every year, we took part in Dýňový svět (Pumpkin World) at the Pipek family farm — our annual hectic stretch when we work, run a stall and keep the meadow going all at once. It was hard work, but together we managed it. Maria and both Kateřinas joined us. At the end we filled the store with pumpkins for the animals.",
        ),
      },
    ],
    links: [
      { label: "Statek u Pipků – Dýňový svět", href: "https://www.dynovysvet.cz/" },
    ],
  },
  {
    name: t("Září", "September"),
    emoji: "🍂",
    blocks: [
      {
        type: "p",
        text: t(
          "V září se nám zaběhl Listík. Pročesávali jsme okolí, vyvěsili letáky po okolních vesnicích a všude na internetu. Bohužel se ale doposud neobjevil. Moc nám chybí, protože to byl úžasně veselý a divoký parťák, přinesl sem krásnou energii a byl Tomášovi velkou podporou v nelehkých časech. Věříme ale, že je mu krásně, ať je kdekoliv, a dál šíří svou úžasnou energii.",
          "In September Listík went missing. We combed the area, put up flyers in the nearby villages and posted everywhere online. Sadly, he hasn't turned up so far. We miss him dearly, because he was a wonderfully cheerful and wild companion; he brought lovely energy here and was a great support to Tomáš in hard times. But we believe he's happy wherever he is, still spreading his amazing energy.",
        ),
      },
    ],
  },
  {
    name: t("Říjen", "October"),
    emoji: "🐷",
    images: [
      { src: "/assets/princezna.webp", alt: t("Prasinka Princezna", "The pig Princezna"), w: 6048, h: 4024 },
    ],
    blocks: [
      {
        type: "p",
        text: t(
          "Opět jsme se zapojili do celorepublikové sbírky DEN ZVÍŘAT 2025 pořádané organizací Běhejme a pomáhejme útulkům. Účastní se jí 160 útulků a sbírka končí v lednu. Už teď vybraná částka značně přesahuje tu z minulého roku. Je úžasné vidět, jaká solidarita u nás v republice roste.",
          "We again joined the nationwide ANIMAL DAY 2025 fundraiser organised by Běhejme a pomáhejme útulkům (Let's Run and Help Shelters). 160 shelters take part and the fundraiser ends in January. The amount raised already far exceeds last year's. It's amazing to see the solidarity growing here in our country.",
        ),
      },
      {
        type: "p",
        text: t(
          "Koncem října jsme jeli na operaci do Prahy s Princeznou (naší prasinkou). Již nějakou dobu se zhoršoval její stav a měla bolesti. Nakonec jí vyoperovali obrovský nádor z dělohy. Vše ale skvěle zvládla a brzy se začala zocelovat — teď je opět ve svém živlu. Pravděpodobně ji ale bude čekat další operace. Už ta první byla náročná, proto jsme nesmírně vděční za podporu všech dobrých lidí.",
          "At the end of October we drove to Prague for an operation with Princezna (our pig). Her condition had been worsening for a while and she was in pain. In the end they removed a huge tumour from her uterus. She came through it wonderfully and soon began to bounce back — now she's in her element again. She'll probably face another operation, though. Even the first one was demanding, so we're immensely grateful for the support of all the kind people.",
        ),
      },
    ],
    links: [
      { label: "Běh pro útulky", href: "https://www.behproutulky.cz/" },
      { label: t("Instagram Běh pro útulky", "Instagram – Běh pro útulky"), href: "https://www.instagram.com/behproutulky/" },
    ],
  },
  {
    name: t("Listopad", "November"),
    emoji: "🏡",
    blocks: [
      {
        type: "p",
        text: t(
          "V listopadu jsme pak kvůli zdravotnímu stavu některých zvířátek i lidských členů byli nuceni zrušit plánovanou brigádu i procházku.",
          "In November we had to cancel the planned work day and walk because of the health of some of the animals and human members.",
        ),
      },
      {
        type: "p",
        text: t(
          "Naše naděje, že se nám Listík vrátí, začala opadat jako barevné listí. Byl nám (a hlavně Tomášovi) zářivým a nezbedným plamínkem v časech, kdy světla bylo méně. Jsme ti za všechno vděční a snad se opět spatříme.",
          "Our hope that Listík would return began to fall away like the colourful leaves. He was a bright, mischievous little flame to us (and especially to Tomáš) at a time when there was less light. We're grateful to you for everything, and hopefully we'll meet again.",
        ),
      },
      {
        type: "p",
        text: t(
          "Rozšířili a vylepšili jsme domečky pro zvířátka, opravili kuchyň a zakryli její terasu. Nadále spolupracujeme s organizací Nakrm nás, díky které nám přicházejí dary pro zvířátka od našich podporovatelů, a koncem roku se znovu zapojujeme do iniciativy Click and Feed.",
          "We expanded and improved the animals' shelters, repaired the kitchen and covered its terrace. We continue to work with Nakrm nás, through which gifts for the animals come to us from our supporters, and at the end of the year we're again joining the Click and Feed initiative.",
        ),
      },
    ],
    links: [
      { label: "Click and Feed", href: "https://clickandfeed.cz/" },
    ],
  },
  {
    name: t("Prosinec", "December"),
    emoji: "✨",
    images: [
      { src: "/assets/report-couple.webp", alt: t("Maria a Tomáš se zvířaty — těší se na miminko", "Maria and Tomáš with the animals — expecting a baby"), w: 1600, h: 1065 },
    ],
    blocks: [
      {
        type: "p",
        text: t(
          "V prosinci proběhla procházka se zvířaty, která tak trochu uzavírá náš rok.",
          "In December we held a walk with the animals, which somewhat rounds off our year.",
        ),
      },
      {
        type: "p",
        text: t(
          "Celý tento rok pro nás byl hluboce transformační, plný změn, odchodů a příchodů, pádů a nových nadějí. Tomáš byl na louce dlouho sám a udržovat azyl v chodu v jednom člověku s cca 100 zvířaty opravdu není jednoduché. Nevzdal to, vydržel s nadějí a odevzdáním se procesu… a tak mohli přijít noví lidé s novou energií a společnou vizí.",
          "This whole year was deeply transformational for us — full of change, farewells and arrivals, falls and new hope. Tomáš was alone at the meadow for a long time, and keeping a sanctuary running single-handedly with about 100 animals really isn't easy. He didn't give up; he held on with hope and surrender to the process… and so new people could come with new energy and a shared vision.",
        ),
      },
      {
        type: "note",
        title: t("Velká radost na závěr", "A great joy to end on"),
        text: t(
          "Příští rok nás čeká opravdu mnoho nového a krásného, tím jsme si jisti. Tomáš s Mariou totiž čekají miminko. A to se stává jejich velkým hnacím motorem a prioritou. Chceme žít pro naši rodinu a dál budovat tento rodový statek s úctou ke všemu živému.",
          "Next year holds so much that is new and beautiful for us, of that we're sure. Tomáš and Maria are expecting a baby. And that is becoming their great driving force and priority. We want to live for our family and to keep building this homestead with respect for all living things.",
        ),
      },
      {
        type: "list",
        intro: t("Co plánujeme do dalšího roku:", "What we're planning for next year:"),
        items: [
          t("Dál se učit o bylinkách a jejich využívání.", "Keep learning about herbs and how to use them."),
          t("Pozorovat přírodu, následovat její cykly, být v úctě a dávat zpět.", "Observe nature, follow its cycles, stay in reverence and give back."),
          t("Pěstovat vlastní zeleninu a být více a více soběstační.", "Grow our own vegetables and become more and more self-sufficient."),
          t("Dostavět domeček nám i zvířátkům a dobudovat zázemí pro celou naši rodinu — i tu zvířecí.", "Finish building the house for us and the animals and complete the facilities for our whole family — the animal one too."),
          t("Pořídit více solárních panelů a dokopat studnu.", "Get more solar panels and finish digging the well."),
          t("Více otevírat azyl lidem, kteří chtějí zpomalit a napojit se na přírodu a zvířata.", "Open the sanctuary more to people who want to slow down and connect with nature and animals."),
          t("Více zapracovat na naší virtuální identitě.", "Work more on our online presence."),
        ],
      },
    ],
  },
  ];
}

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

export default async function VyrocniZprava2025() {
  const locale = await getLocale();
  const months = buildMonths(locale);
  const c = pick(locale, {
    cs: {
      heroAlt: "Východ slunce nad polem u Louky",
      heroEyebrow: "Výroční zpráva 2025",
      heroTitle: "Rok 2025 na Louce",
      heroSubtitle: "Měsíc po měsíci — příchody i odchody, brigády, sbírky a naděje. Tohle je náš společný rok.",
      intro1: "Rok 2025 byl pro nás hluboce transformační — plný změn, odchodů i příchodů, pádů i nových nadějí. Provedeme vás jím tak, jak jsme ho prožívali: měsíc po měsíci, se vším, co k životu na azylu patří.",
      intro2: "Starší výroční zprávy i stanovy spolku najdete ve sbírce listin na portálu Justice.cz.",
      thanks: "Jsme neskonale vděční všem, kteří s námi kráčejí na této cestě, jsou nám podporou a velkou pomocí. Bez nich by to opravdu nešlo.",
      ctaJoin: "Zapojte se",
      ctaAbout: "Zpět na O nás",
    },
    en: {
      heroAlt: "Sunrise over the field by the Meadow",
      heroEyebrow: "Annual report 2025",
      heroTitle: "The year 2025 at the Meadow",
      heroSubtitle: "Month by month — arrivals and farewells, work days, fundraisers and hope. This is our year together.",
      intro1: "2025 was deeply transformational for us — full of change, farewells and arrivals, falls and new hope. We'll take you through it just as we lived it: month by month, with everything that life at a sanctuary involves.",
      intro2: "Older annual reports and the association's statutes can be found in the collection of documents on the Justice.cz portal.",
      thanks: "We are endlessly grateful to everyone who walks this path with us, who supports us and helps us so much. Without them it truly wouldn't be possible.",
      ctaJoin: "Get involved",
      ctaAbout: "Back to About us",
    },
  });
  return (
    <>
      <PageHero
        image="/assets/vyrocni-hero.webp"
        imageAlt={c.heroAlt}
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
      />

      {/* Úvod */}
      <section className="bg-surface py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal className="space-y-5 text-lg leading-relaxed text-text">
            <p>{c.intro1}</p>
            <p className="text-base text-text-muted">{c.intro2}</p>
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
              {c.thanks}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/jak-se-zapojit"
                className="rounded-pill bg-accent px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                {c.ctaJoin}
              </Link>
              <Link
                href="/o-nas"
                className="rounded-pill border border-cream/30 px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-cream/10"
              >
                {c.ctaAbout}
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <SocialSection />
    </>
  );
}
