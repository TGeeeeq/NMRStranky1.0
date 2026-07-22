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
    title: pick(locale, { cs: "Novinky", en: "News" }),
    description: pick(locale, {
      cs: "Přečtěte si, co je u nás nového, radostného i náročného v životě našich zvířecích obyvatel.",
      en: "Read what's new with us — the joyful and the demanding moments in the lives of our animals.",
    }),
    alternates: { canonical: "/novinky" },
  };
}

type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "alert"; title: string; text: string };

type CtaLink = { label: string; href: string; external?: boolean };

type Article = {
  title: string;
  date: string;
  image?: string;
  imageAlt?: string;
  imageHref?: string;
  /** CSS object-position for the cropped card image (defaults to center). */
  imagePosition?: string;
  /** Special card design for remembering departed residents: whole portrait photo, warm framing. */
  memorial?: boolean;
  badge?: string;
  blocks: Block[];
  links?: CtaLink[];
  archived?: boolean;
};

const buildArticles = (locale: Locale): Article[] => [
  {
    title: pick(locale, { cs: "📱 Louka Run je na Google Play!", en: "📱 Louka Run is on Google Play!" }),
    date: "12. 7. 2026",
    image: "/assets/karel.webp",
    imageAlt: pick(locale, { cs: "Osel Karel — hlavní hrdina hry Louka Run", en: "Karel the donkey — the hero of the Louka Run game" }),
    imageHref: "/loukarun",
    badge: "Google Play",
    blocks: [
      { type: "p", text: pick(locale, { cs: "Máme obrovskou radost — naše hra Louka Run je oficiálně venku na Google Play! Schvalování je za námi a aplikaci pro Android si teď můžete stáhnout přímo z obchodu. Bez reklam, bez sledování a bez nákupů ve hře — a celý výtěžek jde na péči o zvířata, za která ve hře běháte.", en: "We're overjoyed — our Louka Run game is officially out on Google Play! The review is behind us and you can now download the Android app straight from the store. No ads, no tracking and no in-game purchases — and all the proceeds go toward caring for the animals you run as in the game." }) },
      { type: "p", text: pick(locale, { cs: "A jak jsme slibovali: brzy vyhlásíme velkou soutěž o krásnou cenu z naší ruční výroby pro toho, kdo doběhne nejdál. Tak stahujte, běhejte a trénujte — a sledujte nás, ať vám start soutěže neuteče!", en: "And as promised: soon we'll launch a big contest for whoever runs the farthest, with a beautiful handmade prize. So download it, run and train — and follow us so you don't miss the start of the contest!" }) },
    ],
    links: [
      { label: pick(locale, { cs: "Stáhnout na Google Play →", en: "Download on Google Play →" }), href: "https://play.google.com/store/apps/details?id=org.nechmerust.loukarun", external: true },
      { label: pick(locale, { cs: "Hrát na webu →", en: "Play on the web →" }), href: "/loukarun" },
    ],
  },
  {
    title: pick(locale, { cs: "🕊️ Vzpomínáme na Zorku", en: "🕊️ Remembering Zorka" }),
    date: "10. 7. 2026",
    image: "/assets/zorka1.webp",
    imageAlt: pick(locale, { cs: "Kobylka Zorka kráčí zasněženou strání", en: "Zorka the mare walking a snowy hillside" }),
    memorial: true,
    badge: pick(locale, { cs: "Vzpomínka", en: "In memory" }),
    blocks: [
      { type: "p", text: pick(locale, { cs: "Blíží se den, kdy nás opustila naše kobylka Zorka. Byla tu s námi úplně od začátku — patřila k úplně prvním obyvatelům Louky a společně s ní se celý náš azyl učil růst.", en: "The day is approaching when our mare Zorka left us. She was with us from the very beginning — one of the very first residents of the Meadow, and our whole sanctuary learned to grow alongside her." }) },
      { type: "p", text: pick(locale, { cs: "Zažili jsme spolu krásné časy, ale i ty náročné, co se péče týče. Zorka nás naučila trpělivosti a pokoře víc než kdokoli jiný. Za všechny společné chvíle — na pastvě, na cestách i v tichu večerní Louky — jí patří obrovský dík.", en: "We shared beautiful times together, but also demanding ones when it came to her care. Zorka taught us patience and humility more than anyone else. For all our moments together — out on the pasture, on the road and in the quiet of the evening Meadow — she has our deepest thanks." }) },
      { type: "p", text: pick(locale, { cs: "Vzpomínáme na ni s láskou a s klidem v srdci. Víme, že Zorka už je dávno, dávno dál a zažívá další zkušenost. Šťastnou cestu, Zorko. Jednou zas společně vyrazíme.", en: "We remember her with love and peace in our hearts. We know Zorka is long, long since on her way, living another experience. Safe travels, Zorka. One day we'll set off together again." }) },
    ],
    links: [
      { label: pick(locale, { cs: "Zorka v galerii →", en: "Zorka in the gallery →" }), href: "/galerie?zvire=Zorka" },
    ],
  },
  {
    title: pick(locale, { cs: "🎮 Louka Run je tady — naše vlastní hra!", en: "🎮 Louka Run is here — our very own game!" }),
    date: "9. 7. 2026",
    image: "/assets/karel.webp",
    imageAlt: pick(locale, { cs: "Osel Karel — hlavní hrdina hry Louka Run", en: "Karel the donkey — the hero of the Louka Run game" }),
    imageHref: "/loukarun",
    badge: pick(locale, { cs: "Nová hra", en: "New game" }),
    blocks: [
      { type: "p", text: pick(locale, { cs: "Máme obrovskou radost — spustili jsme na našem webu vlastní hru Louka Run! Je to endless runner, ve kterém běháte za naše skutečné zvířecí obyvatele: osla Karla, ovečku Pogo, krávu Avalu, prasátko Flíčka, muflona Yakula i krávu Květu. Každá postava má schopnosti podle své opravdové povahy a každý běh končí dobře — jsme přece azyl. Přístup ke hře získáte darem pro zvířata, takže si zaběháte a zároveň pomůžete.", en: "We're overjoyed — we've launched our very own game, Louka Run, on our website! It's an endless runner where you play as our real animal residents: Karel the donkey, Pogo the sheep, Avala the cow, Flíček the piglet, Yakul the mouflon and Květa the cow. Each character has abilities based on its real personality, and every run ends well — we are a sanctuary, after all. You unlock access to the game with a donation for the animals, so you get to run and help at the same time." }) },
      { type: "p", text: pick(locale, { cs: "A to není všechno! Hra už čeká na schválení na Google Play. Jakmile bude aplikace venku, uspořádáme velkou soutěž: kdo doběhne nejdál, vyhraje krásnou cenu z naší ruční výroby. Tak trénujte — a sledujte nás, ať vám start soutěže neuteče!", en: "And that's not all! The game is already awaiting approval on Google Play. Once the app is out, we'll hold a big contest: whoever runs the farthest wins a beautiful handmade prize. So keep training — and follow us so you don't miss the start of the contest!" }) },
    ],
    links: [
      { label: pick(locale, { cs: "Hrát Louka Run →", en: "Play Louka Run →" }), href: "/loukarun" },
    ],
  },
  {
    title: pick(locale, { cs: "🐑 Vítejte, Malvíno a Rozárko!", en: "🐑 Welcome, Malvína and Rozárka!" }),
    date: "6. 7. 2026",
    image: "/assets/malvina-rozarka.webp",
    imageAlt: pick(locale, { cs: "Ovečky Malvína a Rozárka", en: "Malvína and Rozárka the sheep" }),
    imageHref: "/zvireci-obyvatele",
    imagePosition: "center 30%",
    badge: pick(locale, { cs: "Nové obyvatelky", en: "New residents" }),
    blocks: [
      { type: "p", text: pick(locale, { cs: "Máme velkou radost — dnes k nám přijely dvě nové obyvatelky! Jsou to dvě dvouměsíční ovečky, které se jmenují Malvína a Rozárka. Už teď se u nás krásně sžívají s celou naší ovčí partou a roztomile bečí. Věříme, že se u nás budou cítit jako doma.", en: "We're delighted — two new residents arrived today! They're two-month-old sheep named Malvína and Rozárka. They're already settling in beautifully with our whole flock and bleating adorably. We're sure they'll feel right at home with us." }) },
      { type: "alert", title: pick(locale, { cs: "🏡 Kapacita Louky je zatím naplněná", en: "🏡 The Meadow is at capacity for now" }), text: pick(locale, { cs: "Z kapacitních důvodů momentálně bohužel nemůžeme přijímat nové zvířecí obyvatele. Jedinou výjimkou zůstává oslík — kamarád pro našeho Karla — a případně několik slepiček, kterým ještě dokážeme dát domov.", en: "For reasons of capacity, we sadly can't take in new animal residents at the moment. The only exception remains a donkey — a companion for our Karel — and possibly a few hens we can still give a home to." }) },
    ],
    links: [
      { label: pick(locale, { cs: "Poznejte naše obyvatele →", en: "Meet our animals →" }), href: "/zvireci-obyvatele" },
    ],
  },
  {
    title: pick(locale, { cs: "📅 Nadcházející akce na Louce jsou venku!", en: "📅 The Meadow's upcoming events are out!" }),
    date: "4. 7. 2026",
    image: "/assets/louka1.webp",
    imageAlt: pick(locale, { cs: "Léto a podzim na Louce", en: "Summer and autumn at the Meadow" }),
    imageHref: "/udalosti",
    badge: pick(locale, { cs: "Novinka", en: "News" }),
    blocks: [
      { type: "p", text: pick(locale, { cs: "Máme pro vás skvělou zprávu — vyhlašujeme termíny nadcházejících akcí na Louce! Léto a podzim u nás budou nabité společnými setkáními, na která už teď srdečně zveme každého, kdo se chce zapojit a strávit čas mezi zvířaty, přírodou a dobrými lidmi.", en: "We've got great news — we're announcing the dates of our upcoming events at the Meadow! Summer and autumn here will be packed with gatherings, and we warmly invite everyone who wants to get involved and spend time among the animals, nature and good people." }) },
      { type: "p", text: pick(locale, { cs: "Těšit se můžete na Loukádu ve dnech 21.–23. srpna a znovu 4.–6. září, na festival Spolu Mezi Lesy 11.–13. září a na společnou procházku 26.–27. září. Všechny termíny najdete přehledně v našich událostech.", en: "Look forward to the Loukáda on 21–23 August and again on 4–6 September, the Spolu Mezi Lesy festival on 11–13 September, and a walk together on 26–27 September. You'll find all the dates laid out clearly on our events page." }) },
      { type: "p", text: pick(locale, { cs: "Podrobnosti k programu budeme postupně doplňovat, tak nás sledujte, ať vám nic neunikne. Budeme se na vás moc těšit!", en: "We'll be adding programme details bit by bit, so follow us so you don't miss anything. We're really looking forward to seeing you!" }) },
    ],
    links: [
      { label: pick(locale, { cs: "Zobrazit události →", en: "View events →" }), href: "/udalosti" },
    ],
  },
  {
    title: pick(locale, { cs: "📖 Výroční zpráva 2025 je tu", en: "📖 The 2025 annual report is here" }),
    date: "29. 6. 2026",
    image: "/assets/louka1.webp",
    imageAlt: pick(locale, { cs: "Maria a Tomáš na Louce", en: "Maria and Tomáš at the Meadow" }),
    imageHref: "/vyrocni-zprava-2025",
    badge: pick(locale, { cs: "Novinka", en: "News" }),
    blocks: [
      { type: "p", text: pick(locale, { cs: "Sepsali jsme, jaký byl rok 2025 na Louce — měsíc po měsíci, se vším, co k životu na azylu patří. Příchody nových obyvatel i bolestná loučení, brigády, sbírky, dýňová sezóna i nové naděje do dalšího roku.", en: "We've written up what 2025 was like at the Meadow — month by month, with everything that life at a sanctuary brings. The arrivals of new residents and painful farewells, work weekends, fundraisers, the pumpkin season and new hopes for the year ahead." }) },
      { type: "p", text: pick(locale, { cs: "Provázíme vás celým rokem tak, jak jsme ho prožívali. Přečtěte si naši první výroční zprávu přímo tady na webu — a potěšte se i novými fotkami ze života na Louce.", en: "We take you through the whole year just as we lived it. Read our first annual report right here on the website — and enjoy new photos from life at the Meadow too." }) },
    ],
    links: [
      { label: pick(locale, { cs: "Přečíst výroční zprávu 2025 →", en: "Read the 2025 annual report →" }), href: "/vyrocni-zprava-2025" },
    ],
  },
  {
    title: pick(locale, { cs: "🌲 Spolu Mezi Lesy se přesouvá na nový termín", en: "🌲 Spolu Mezi Lesy is moving to a new date" }),
    date: "29. 6. 2026",
    image: "/assets/mezilesy.jpg",
    imageAlt: pick(locale, { cs: "Spolu Mezi Lesy — víkend na Louce", en: "Spolu Mezi Lesy — a weekend at the Meadow" }),
    badge: pick(locale, { cs: "Nový termín", en: "New date" }),
    blocks: [
      { type: "p", text: pick(locale, { cs: "Náš víkend Spolu Mezi Lesy — třídenní setkání na pomezí retreatu a festivalu přímo na Louce — se přesouvá na nový termín. Nově se potkáme 11.–13. září 2026.", en: "Our Spolu Mezi Lesy weekend — a three-day gathering somewhere between a retreat and a festival, right at the Meadow — is moving to a new date. We'll now meet on 11–13 September 2026." }) },
      { type: "p", text: pick(locale, { cs: "Podrobný program i možnost přihlášení najdete na naší facebookové události. Těšíme se na společný čas mezi lesy, zvířaty a dobrými lidmi.", en: "You'll find the full programme and sign-up on our Facebook event. We're looking forward to time together among the forests, the animals and good people." }) },
    ],
    links: [
      { label: pick(locale, { cs: "Více info na Facebooku", en: "More info on Facebook" }), href: "https://facebook.com/events/s/spolu-mezi-lesy-presunuto-na-z/2298157060995232/", external: true },
    ],
  },
  {
    title: pick(locale, { cs: "Naše Máša má nemocnou pacičku", en: "Our Máša has a poorly paw" }),
    date: "19. 3. 2026",
    image: "/assets/masule.webp",
    imageAlt: pick(locale, { cs: "Kočička Máša", en: "Máša the cat" }),
    blocks: [
      { type: "p", text: pick(locale, { cs: "Naše milovaná kočička Blondýnka ze Sibiře, Máša, nás v posledních dnech trochu potrápila. Zjistili jsme, že má nemocnou pacičku, což jí způsobovalo bolest a neumožňovalo jí plně si užívat běžné kočičí radosti.", en: "Our beloved Siberian blondie, Máša the cat, has given us a bit of a scare these past few days. We found she has a poorly paw, which was causing her pain and keeping her from fully enjoying the usual feline pleasures." }) },
      { type: "p", text: pick(locale, { cs: "Okamžitě jsme s ní vyrazili na veterinu, kde jí byla poskytnuta veškerá potřebná péče. Dostala léky proti bolesti, aby se jí ulevilo, a také antibiotika pro léčbu případné infekce. Máša je statečná a věříme, že se brzy uzdraví.", en: "We took her to the vet straight away, where she received all the care she needed. She was given painkillers for relief and antibiotics to treat any infection. Máša is brave and we're sure she'll recover soon." }) },
      { type: "p", text: pick(locale, { cs: "O víkendu s ní půjdeme na kontrolu, abychom se ujistili, že léčba probíhá správně a pacička se hojí. Držíme jí palce a děkujeme za vaši podporu!", en: "This weekend we'll take her for a check-up to make sure the treatment is working and the paw is healing. We're rooting for her — and thank you for your support!" }) },
    ],
  },
  {
    title: pick(locale, { cs: "🌿 Dvoudenní putování se zvířaty", en: "🌿 A two-day wandering with the animals" }),
    date: "24. 4. 2026",
    image: "/assets/hero-image.webp",
    imageAlt: pick(locale, { cs: "Putování se zvířaty", en: "Wandering with the animals" }),
    imageHref: "/putovani-se-zviraty",
    blocks: [
      { type: "p", text: pick(locale, { cs: "Připravujeme pro vás neuvěřitelné dobrodružství! Vydáme se na dvoudenní putování středočeskou krajinou ve společnosti psů, osla, muflona a dalších zvířecích přátel. Spát budeme pod širým nebem, večeři si připravíme na ohni s hudebním doprovodem a ráno si můžete vyzkoušet rozcvičku v duchu kung-fu. Tohle bude nezapomenutelný čas plný sdílení a plynutí života!", en: "We're preparing an incredible adventure for you! We'll set out on a two-day journey through the Central Bohemian countryside in the company of dogs, a donkey, a mouflon and other animal friends. We'll sleep under the open sky, cook dinner over the fire with live music, and in the morning you can try a kung-fu-style warm-up. This will be an unforgettable time full of sharing and letting life flow!" }) },
    ],
    links: [{ label: pick(locale, { cs: "Více informací a registrace →", en: "More information and registration →" }), href: "/putovani-se-zviraty" }],
  },
  {
    title: pick(locale, { cs: "Společná procházka v dubnu", en: "A walk together in April" }),
    date: "11. 4. 2026",
    image: "/assets/prochy.webp",
    imageAlt: pick(locale, { cs: "Společná procházka", en: "A walk together" }),
    blocks: [
      { type: "p", text: pick(locale, { cs: "Srdečně vás zveme na další společnou procházku, která se uskuteční v sobotu 11. dubna. Sraz bude v 10:30 přímo u nás na Louce. Těšíme se na další krásný čas strávený společně se zvířaty i s vámi!", en: "We warmly invite you to another walk together, taking place on Saturday 11 April. We'll meet at 10:30 right here at the Meadow. We're looking forward to more lovely time spent together with the animals and with you!" }) },
    ],
    links: [{ label: pick(locale, { cs: "Zobrazit události →", en: "View events →" }), href: "/udalosti" }],
  },
  {
    title: pick(locale, { cs: "Procházka 14. března je úspěšně za námi", en: "The walk on 14 March was a great success" }),
    date: "14. 3. 2026",
    image: "/assets/prochy1.webp",
    imageAlt: pick(locale, { cs: "Společná procházka", en: "A walk together" }),
    blocks: [
      { type: "p", text: pick(locale, { cs: "Naše březnová procházka byla naprosto kouzelná! Sešlo se nás téměř 40 lidí a atmosféra byla plná radosti. Zvířata si pozornost a společnost návštěvníků moc užila. Bylo pro nás krásné sdílet společné chvíle se všemi bytostmi, které za námi dorazily.", en: "Our March walk was absolutely magical! Nearly 40 of us came together and the atmosphere was full of joy. The animals thoroughly enjoyed the attention and company of the visitors. It was wonderful for us to share these moments with all the beings who came to see us." }) },
      { type: "p", text: pick(locale, { cs: "Moc děkujeme za všechny vaše příspěvky a dary, kterých si nesmírně vážíme. Stejně tak děkujeme za krásné fotky a záběry, které jste s námi posdíleli.", en: "Thank you so much for all your contributions and donations, which we deeply appreciate. And thank you too for the lovely photos and footage you shared with us." }) },
    ],
  },
  {
    title: pick(locale, { cs: "Zimní okénko: Kesy a Julek", en: "Winter window: Kesy and Julek" }),
    date: "18. 2. 2026",
    image: "/assets/kesy.webp",
    imageAlt: "Kesy",
    blocks: [
      { type: "p", text: pick(locale, { cs: "Zima je u nás celkem klidná, tedy až na občasné nahánění Kesy a zvýšenou péči o kohouta Julka. Ten se momentálně hřeje v boudě a z vděčnosti začíná kokrhat už ve 4 hodiny ráno. Máme tak o spolehlivý budíček postaráno!", en: "Winter here is fairly peaceful — apart from the occasional chase after Kesy and some extra care for Julek the rooster. He's currently warming up in his little house and, out of gratitude, starts crowing as early as 4 in the morning. So we've got a reliable alarm clock sorted!" }) },
    ],
    links: [{ label: pick(locale, { cs: "Virtuální adopce →", en: "Virtual adoption →" }), href: "/virtualni-adopce" }],
  },
  {
    title: pick(locale, { cs: "Navštívili nás Hovory ze země", en: "Hovory ze země paid us a visit" }),
    date: "18. 2. 2026",
    image: "/assets/tom.jpg",
    imageAlt: "Tom",
    blocks: [
      { type: "p", text: pick(locale, { cs: "Máme velkou radost, že nás navštívili Hovory ze země. Tomášovo povídání o naší Louce a zvířatech si můžete poslechnout ve videu.", en: "We're delighted that Hovory ze země came to visit. You can listen to Tomáš talking about our Meadow and the animals in the video." }) },
    ],
    links: [{ label: pick(locale, { cs: "Hovory ze země →", en: "Hovory ze země →" }), href: "https://youtu.be/1pVDwP4iqWA?si=okKKTsAtnmTwmY4N", external: true }],
  },
  {
    title: pick(locale, { cs: "Poděkování za Valentýnskou procházku", en: "Thank you for the Valentine's walk" }),
    date: "14. 2. 2026",
    image: "/assets/valentyn.jpg",
    imageAlt: pick(locale, { cs: "Valentýnská procházka", en: "Valentine's walk" }),
    blocks: [
      { type: "p", text: pick(locale, { cs: "Valentinská procházka je úspěšně za námi! Byla překrásná a moc děkujeme všem zúčastněným za účast, jejich dary a mazlení zvířat. Moc jsme si to společně užili.", en: "The Valentine's walk was a great success! It was beautiful, and thank you so much to everyone who came, for your donations and for cuddling the animals. We all enjoyed it enormously." }) },
    ],
  },
  {
    title: pick(locale, { cs: "🤝 Výzva pro tvůrce: Pojďte s námi do toho!", en: "🤝 A call to makers: join us!" }),
    date: pick(locale, { cs: "Aktuálně", en: "Ongoing" }),
    badge: pick(locale, { cs: "Spolupráce", en: "Collaboration" }),
    blocks: [
      { type: "p", text: pick(locale, { cs: "Chcete podpořit naše snažení a zároveň nabídnout své výrobky široké veřejnosti? Hledáme šikovné tvůrce, řemeslníky a umělce, kteří by se chtěli zapojit do spolupráce a prodávat své produkty přes náš e-shop. Každá spolupráce pomáhá zvířatům!", en: "Would you like to support our efforts and offer your products to a wide audience at the same time? We're looking for talented makers, craftspeople and artists who'd like to team up and sell their products through our e-shop. Every collaboration helps the animals!" }) },
      { type: "p", text: pick(locale, { cs: "Ozvěte se nám na info@nechmerust.org nebo našem Instagramu.", en: "Get in touch at info@nechmerust.org or on our Instagram." }) },
    ],
    links: [{ label: pick(locale, { cs: "Napsat e-mail", en: "Send an e-mail" }), href: "mailto:info@nechmerust.org" }],
  },
  {
    title: pick(locale, { cs: "Kouzelná procházka", en: "A magical walk" }),
    date: "13. 12. 2025",
    image: "/assets/prochazka.webp",
    imageAlt: pick(locale, { cs: "Kouzelná procházka se zvířátky", en: "A magical walk with the animals" }),
    archived: true,
    blocks: [
      { type: "p", text: pick(locale, { cs: "Kouzelná procházka se zvířátky je za námi! Už jsme se byli se zvířátky projít a bylo to kouzelné. Děkujeme všem, kteří dorazili a pomohli vytvořit nezapomenutelnou atmosféru. Zvířátka si to moc užila a my s nimi!", en: "The magical walk with the animals is behind us! We went for a stroll with the animals and it was magical. Thank you to everyone who came and helped create an unforgettable atmosphere. The animals loved it, and so did we!" }) },
    ],
  },
  {
    title: pick(locale, { cs: "Luční obchůdek je spuštěn!", en: "The Meadow Shop is now open!" }),
    date: "8. 12. 2025",
    archived: true,
    blocks: [
      { type: "h", text: pick(locale, { cs: "🎉 S nadšením oznamujeme: Luční obchůdek je ONLINE! 🎉", en: "🎉 We're thrilled to announce: the Meadow Shop is ONLINE! 🎉" }) },
      { type: "p", text: pick(locale, { cs: "Po dlouhých přípravách je náš e-shop, Luční obchůdek, konečně spuštěn! Nákupem jakéhokoliv produktu podpoříte přímo chod naší Louky a péči o zvířecí obyvatele. Najdete zde výrobky z naší tvorby i krásné věci od našich spřátelených tvůrců.", en: "After long preparations, our e-shop — the Meadow Shop — is finally open! By buying any product you directly support the running of our Meadow and the care of our animal residents. You'll find our own creations here as well as beautiful things from makers we're friends with." }) },
    ],
    links: [{ label: pick(locale, { cs: "Otevřít Luční obchůdek", en: "Open the Meadow Shop" }), href: "/obchod" }],
  },
  {
    title: pick(locale, { cs: "Podzimní ohlédnutí: Plné seníky, bojovnice Princezna a novinky z Lučního obchůdku", en: "Autumn look back: full hay stores, Princezna the fighter, and news from the Meadow Shop" }),
    date: "21. 11. 2025",
    archived: true,
    blocks: [
      { type: "p", text: pick(locale, { cs: "Milí přátelé a příznivci Louky, podzim se pomalu chýlí ke konci a my bychom se s vámi rádi podělili o to, co všechno se u nás v posledních týdnech událo. Bylo to období plné kontrastů – zažili jsme obrovskou vlnu solidarity, radost z uzdravování, ale i náročné chvíle bojů s počasím a nemocemi.", en: "Dear friends and supporters of the Meadow, autumn is slowly drawing to a close and we'd love to share with you everything that's happened here over the past few weeks. It's been a time full of contrasts — we experienced a huge wave of solidarity and the joy of recovery, but also demanding moments of battling the weather and illness." }) },
      { type: "h", text: pick(locale, { cs: "Seníky praskají ve švech – díky VÁM! 🌾", en: "The hay stores are bursting at the seams — thanks to YOU! 🌾" }) },
      { type: "p", text: pick(locale, { cs: "Začneme tou nejlepší zprávou. Díky vaší úžasné podpoře ve sbírce se nám podařilo naplnit seníky až po strop! Je to pro nás obrovská úleva. Víme, že ať bude zima jakákoliv, naše bříška budou mít co jíst. Děkujeme každému z vás, kdo přispěl. Bez vás by to nešlo.", en: "Let's start with the best news. Thanks to your amazing support in the fundraiser, we managed to fill the hay stores right to the roof! That's a huge relief for us. We know that whatever the winter brings, our little bellies will have plenty to eat. Thank you to every one of you who contributed. We couldn't have done it without you." }) },
      { type: "h", text: pick(locale, { cs: "Dýňová sezóna a boj s větry 🎃💨", en: "Pumpkin season and battling the winds 🎃💨" }) },
      { type: "p", text: pick(locale, { cs: "Máme za sebou také intenzivní dýňovou sezónu. Pomáhali jsme v Dýňovém světě a provozovali náš stánek. Byla to fuška, ale krásná. Bohužel, příroda nám ukázala svou sílu a silný vítr nám náš stánek zničil. I to je ale život na venkově a my se nevzdáváme. Mezitím jsme na Louce stihli velký úkol – úspěšně jsme odvodnili sklep, což je pro Luční zázemí klíčové.", en: "We've also come through an intense pumpkin season. We helped out at the Pumpkin World and ran our stall. It was hard work, but lovely. Sadly, nature showed us its strength and a strong wind destroyed our stall. But that too is country life, and we're not giving up. Meanwhile, at the Meadow we managed a big task — we successfully drained the cellar, which is key for the Meadow's facilities." }) },
      { type: "h", text: pick(locale, { cs: "Princezna se uzdravuje 🐷", en: "Princezna is recovering 🐷" }) },
      { type: "p", text: pick(locale, { cs: "Jak mnozí víte, naše prasinka Princezna podstoupila nákladnou a náročnou operaci. S radostí hlásíme, že se zotavuje! Je to naše velká bojovnice. Děkujeme za všechny myšlenky a příspěvky, které jí pomohly zajistit tu nejlepší péči.", en: "As many of you know, our pig Princezna underwent a costly and demanding operation. We're happy to report that she's recovering! She's our great little fighter. Thank you for all the thoughts and contributions that helped secure her the very best care." }) },
      { type: "alert", title: pick(locale, { cs: "⚠️ Zdraví nás trochu potrápilo – ZRUŠENÍ akcí", en: "⚠️ Our health has given us some trouble — EVENTS CANCELLED" }), text: pick(locale, { cs: "Bohužel, s podzimem přišly i nemoci, které se nevyhnuly ani nám dvounožcům, ani zvířecím obyvatelům. Abychom všichni nabrali sílu a nic se nepřenášelo, jsme nuceni zrušit nadcházející Loukádu i nejbližší společnou procházku. Moc nás to mrzí, ale zdraví a klid na lůžku (a ve slámě) jsou teď přednější.", en: "Sadly, autumn also brought illnesses that spared neither us two-leggeds nor the animal residents. So that we can all regain our strength and nothing spreads, we're forced to cancel the upcoming Loukáda and the next walk together. We're very sorry, but health and rest in bed (and in the straw) come first right now." }) },
      { type: "alert", title: pick(locale, { cs: "⚠️ ZRUŠENÍ účasti na Veggie Vánoce", en: "⚠️ CANCELLING our appearance at Veggie Vánoce" }), text: pick(locale, { cs: "Bohužel vám musíme oznámit, že jsme nuceni zrušit také účast na akci Veggie Vánoce pořádanou @vegan_fighter. Pořadatelům se moc omlouváme. I přes naši absenci vás srdečně zveme k účasti na akci. Určitě si tam i bez nás užijete skvělou atmosféru a spoustu vegan pochoutek.", en: "Unfortunately, we must let you know that we're also forced to cancel our appearance at the Veggie Vánoce event organised by @vegan_fighter. We sincerely apologise to the organisers. Even without us, we warmly encourage you to attend — you're sure to enjoy a great atmosphere and plenty of vegan treats there." }) },
      { type: "h", text: pick(locale, { cs: "Naděje na prosinec a VÝZVA tvůrcům ✨", en: "Hopes for December and a CALL to makers ✨" }) },
      { type: "p", text: pick(locale, { cs: "Věříme, že se brzy všichni dáme do kupy. Moc doufáme, že se uvidíme na poslední akci roku – Kouzelné procházce 13. prosince. Zároveň máme výzvu pro všechny šikovné tvůrce! Chystáme Luční obchůdek a hledáme originální výrobky, které by potěšily naše příznivce a pomohly zvířatům. Pokud tvoříte s láskou, ozvěte se nám!", en: "We're confident we'll all be back on our feet soon. We very much hope to see you at the last event of the year — the magical walk on 13 December. We also have a call for all talented makers! We're preparing the Meadow Shop and looking for original products that would delight our supporters and help the animals. If you create with love, get in touch!" }) },
    ],
  },
];

function ArticleLink({ link }: { link: CtaLink }) {
  const cls =
    "inline-flex items-center rounded-pill bg-moss px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-moss-deep";
  return link.external ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {link.label}
    </a>
  ) : (
    <Link href={link.href} className={cls}>
      {link.label}
    </Link>
  );
}

function MemorialCard({ a, locale }: { a: Article; locale: Locale }) {
  return (
    <article className="overflow-hidden rounded-lg border border-accent/60 bg-gradient-to-br from-surface-alt via-surface to-accent/15 shadow-soft">
      {/* Jemný barevný proužek — poznávací znamení vzpomínkové karty */}
      <div className="h-1.5 bg-gradient-to-r from-moss via-accent to-terracotta" aria-hidden />
      <div className="flex flex-col items-center gap-8 p-6 sm:p-8 md:flex-row md:items-start">
        {/* Celá fotka na výšku, jako památeční fotografie z alba */}
        <figure className="w-full max-w-[260px] shrink-0 sm:max-w-[280px]">
          <div className="-rotate-2 rounded-md bg-cream p-3 pb-2 shadow-soft ring-1 ring-border transition-transform duration-300 hover:rotate-0">
            <Image
              src={a.image!}
              alt={a.imageAlt ?? a.title}
              width={1050}
              height={1400}
              sizes="280px"
              className="rounded-sm"
            />
            <figcaption className="py-2 text-center font-serif text-sm italic text-moss-soft">
              {pick(locale, { cs: "Zorka ✿ navždy v našich srdcích", en: "Zorka ✿ forever in our hearts" })}
            </figcaption>
          </div>
        </figure>
        <div className="min-w-0 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:justify-start">
            <span className="font-medium text-moss-soft">📅 {a.date}</span>
            {a.badge ? (
              <span className="rounded-pill bg-accent/40 px-3 py-0.5 text-xs font-semibold text-moss-deep">{a.badge}</span>
            ) : null}
          </div>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-moss-deep">{a.title}</h2>
          <div className="mt-4 space-y-4 text-left text-text">
            {a.blocks.map((b, i) => (
              <p key={i} className="leading-relaxed">{b.type === "p" ? b.text : null}</p>
            ))}
          </div>
          <p className="mt-5 text-center font-serif text-lg italic text-terracotta md:text-left" aria-hidden>
            ❀ ❀ ❀
          </p>
          {a.links?.length ? (
            <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
              {a.links.map((l) => (
                <ArticleLink key={l.label} link={l} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ArticleCard({ a, locale }: { a: Article; locale: Locale }) {
  if (a.memorial && a.image) return <MemorialCard a={a} locale={locale} />;
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-surface shadow-soft">
      {a.image ? (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image src={a.image} alt={a.imageAlt ?? a.title} fill sizes="(min-width: 768px) 720px, 100vw" className="object-cover" style={a.imagePosition ? { objectPosition: a.imagePosition } : undefined} />
        </div>
      ) : null}
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-medium text-moss-soft">📅 {a.date}</span>
          {a.badge ? (
            <span className="rounded-pill bg-accent/40 px-3 py-0.5 text-xs font-semibold text-moss-deep">{a.badge}</span>
          ) : null}
        </div>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-moss-deep">{a.title}</h2>
        <div className="mt-4 space-y-4 text-text">
          {a.blocks.map((b, i) => {
            if (b.type === "h") return <h3 key={i} className="font-serif text-lg font-semibold text-moss-deep">{b.text}</h3>;
            if (b.type === "alert")
              return (
                <div key={i} className="rounded-md border-l-4 border-terracotta bg-surface-alt p-4">
                  <p className="font-semibold text-moss-deep">{b.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">{b.text}</p>
                </div>
              );
            return <p key={i} className="leading-relaxed">{b.text}</p>;
          })}
        </div>
        {a.links?.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {a.links.map((l) => (
              <ArticleLink key={l.label} link={l} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default async function Novinky() {
  const locale = await getLocale();
  const articles = buildArticles(locale);
  const current = articles.filter((a) => !a.archived);
  const archived = articles.filter((a) => a.archived);

  return (
    <>
      <PageHero
        image="/assets/novinky-hero.webp"
        imageAlt={pick(locale, { cs: "Krávy na zelené pastvě na Louce", en: "Cows on the green pasture at the Meadow" })}
        eyebrow={pick(locale, { cs: "Co je nového", en: "What's new" })}
        title={pick(locale, { cs: "Novinky z Louky", en: "News from the Meadow" })}
        subtitle={pick(locale, {
          cs: "Přečtěte si, co je u nás nového, radostného i náročného v životě našich zvířecích obyvatel.",
          en: "Read what's new with us — the joyful and the demanding moments in the lives of our animals.",
        })}
      />

      <section className="bg-surface py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-10">
            {current.map((a, i) => (
              <Reveal key={a.title} delay={(i % 2) * 0.05}>
                <ArticleCard a={a} locale={locale} />
              </Reveal>
            ))}
          </div>

          {archived.length ? (
            <>
              <div className="my-14 flex items-center gap-4">
                <span className="h-px flex-1 bg-border" />
                <h2 className="font-serif text-xl font-semibold text-moss-soft">{pick(locale, { cs: "Starší novinky", en: "Older news" })}</h2>
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-10">
                {archived.map((a) => (
                  <Reveal key={a.title}>
                    <ArticleCard a={a} locale={locale} />
                  </Reveal>
                ))}
              </div>
            </>
          ) : null}
        </Container>
      </section>

      <SocialSection tone="alt" />
    </>
  );
}
