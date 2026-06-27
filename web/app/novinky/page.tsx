import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";

export const metadata: Metadata = {
  title: "Novinky",
  description:
    "Přečtěte si, co je u nás nového, radostného i náročného v životě našich zvířecích obyvatel.",
  alternates: { canonical: "/novinky" },
};

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
  badge?: string;
  blocks: Block[];
  links?: CtaLink[];
  archived?: boolean;
};

const articles: Article[] = [
  {
    title: "🌲 Blíží se Spolu Mezi Lesy — letní víkend na Louce",
    date: "1. 6. 2026",
    image: "/assets/mezilesy.jpg",
    imageAlt: "Spolu Mezi Lesy — víkend na Louce 12.–14. 6. 2026",
    badge: "⏳ Posledních 5 míst",
    blocks: [
      { type: "p", text: "Už 12.–14. června 2026 nás čeká Spolu Mezi Lesy — třídenní víkend na pomezí retreatu a festivalu přímo na naší Louce. Prolíná se v něm příroda, zvířata, intuitivní umění, pohyb a živá hudba." },
      { type: "p", text: "Na programu jsou ranní meditace a jóga, autorské čtení a zpěv, arteterapie, společné tvoření, muzikoterapie, večerní jamy u ohně i otevírání hlasu se zvířecími zvuky. Program je dobrovolný — kdykoli si můžeš místo toho jen mazlit zvířátka, ležet v trávě nebo lézt po stromech." },
      { type: "p", text: "Cena 2 470 Kč zahrnuje třídenní pobyt na Louce, sobotní brunch, večeři a nedělní brunch. Výdělek z akce jde z velké části na rozvoj azylu Nech Mě Růst." },
      { type: "alert", title: "⏳ Zbývá posledních 5 míst!", text: "Kapacita je záměrně omezená, aby se tu každý cítil komfortně a měl svůj prostor. Pokud váháš, ozvi se nám raději brzy — místa rychle mizí." },
    ],
    links: [
      { label: "Facebook událost", href: "https://www.facebook.com/share/1BDFbAxfFf/", external: true },
    ],
  },
  {
    title: "Naše Máša má nemocnou pacičku",
    date: "19. 3. 2026",
    image: "/assets/masule.webp",
    imageAlt: "Kočička Máša",
    blocks: [
      { type: "p", text: "Naše milovaná kočička Blondýnka ze Sibiře, Máša, nás v posledních dnech trochu potrápila. Zjistili jsme, že má nemocnou pacičku, což jí způsobovalo bolest a neumožňovalo jí plně si užívat běžné kočičí radosti." },
      { type: "p", text: "Okamžitě jsme s ní vyrazili na veterinu, kde jí byla poskytnuta veškerá potřebná péče. Dostala léky proti bolesti, aby se jí ulevilo, a také antibiotika pro léčbu případné infekce. Máša je statečná a věříme, že se brzy uzdraví." },
      { type: "p", text: "O víkendu s ní půjdeme na kontrolu, abychom se ujistili, že léčba probíhá správně a pacička se hojí. Držíme jí palce a děkujeme za vaši podporu!" },
    ],
  },
  {
    title: "🌿 Dvoudenní putování se zvířaty",
    date: "24. 4. 2026",
    image: "/assets/hero-image.webp",
    imageAlt: "Putování se zvířaty",
    imageHref: "/putovani-se-zviraty",
    blocks: [
      { type: "p", text: "Připravujeme pro vás neuvěřitelné dobrodružství! Vydáme se na dvoudenní putování středočeskou krajinou ve společnosti psů, osla, muflona a dalších zvířecích přátel. Spát budeme pod širým nebem, večeři si připravíme na ohni s hudebním doprovodem a ráno si můžete vyzkoušet rozcvičku v duchu kung-fu. Tohle bude nezapomenutelný čas plný sdílení a plynutí života!" },
    ],
    links: [{ label: "Více informací a registrace →", href: "/putovani-se-zviraty" }],
  },
  {
    title: "Společná procházka v dubnu",
    date: "11. 4. 2026",
    image: "/assets/prochy.webp",
    imageAlt: "Společná procházka",
    blocks: [
      { type: "p", text: "Srdečně vás zveme na další společnou procházku, která se uskuteční v sobotu 11. dubna. Sraz bude v 10:30 přímo u nás na Louce. Těšíme se na další krásný čas strávený společně se zvířaty i s vámi!" },
    ],
    links: [{ label: "Zobrazit události →", href: "/udalosti" }],
  },
  {
    title: "Procházka 14. března je úspěšně za námi",
    date: "14. 3. 2026",
    image: "/assets/prochy1.webp",
    imageAlt: "Společná procházka",
    blocks: [
      { type: "p", text: "Naše březnová procházka byla naprosto kouzelná! Sešlo se nás téměř 40 lidí a atmosféra byla plná radosti. Zvířata si pozornost a společnost návštěvníků moc užila. Bylo pro nás krásné sdílet společné chvíle se všemi bytostmi, které za námi dorazily." },
      { type: "p", text: "Moc děkujeme za všechny vaše příspěvky a dary, kterých si nesmírně vážíme. Stejně tak děkujeme za krásné fotky a záběry, které jste s námi posdíleli." },
    ],
  },
  {
    title: "Zimní okénko: Kesy a Julek",
    date: "18. 2. 2026",
    image: "/assets/kesy.webp",
    imageAlt: "Kesy",
    blocks: [
      { type: "p", text: "Zima je u nás celkem klidná, tedy až na občasné nahánění Kesy a zvýšenou péči o kohouta Julka. Ten se momentálně hřeje v boudě a z vděčnosti začíná kokrhat už ve 4 hodiny ráno. Máme tak o spolehlivý budíček postaráno!" },
    ],
    links: [{ label: "Virtuální adopce →", href: "/virtualni-adopce" }],
  },
  {
    title: "Navštívili nás Hovory ze země",
    date: "18. 2. 2026",
    image: "/assets/tom.jpg",
    imageAlt: "Tom",
    blocks: [
      { type: "p", text: "Máme velkou radost, že nás navštívili Hovory ze země. Tomášovo povídání o naší Louce a zvířatech si můžete poslechnout ve videu." },
    ],
    links: [{ label: "Hovory ze země →", href: "https://youtu.be/1pVDwP4iqWA?si=okKKTsAtnmTwmY4N", external: true }],
  },
  {
    title: "Poděkování za Valentýnskou procházku",
    date: "14. 2. 2026",
    image: "/assets/valentyn.jpg",
    imageAlt: "Valentýnská procházka",
    blocks: [
      { type: "p", text: "Valentinská procházka je úspěšně za námi! Byla překrásná a moc děkujeme všem zúčastněným za účast, jejich dary a mazlení zvířat. Moc jsme si to společně užili." },
    ],
  },
  {
    title: "🤝 Výzva pro tvůrce: Pojďte s námi do toho!",
    date: "Aktuálně",
    badge: "Spolupráce",
    blocks: [
      { type: "p", text: "Chcete podpořit naše snažení a zároveň nabídnout své výrobky široké veřejnosti? Hledáme šikovné tvůrce, řemeslníky a umělce, kteří by se chtěli zapojit do spolupráce a prodávat své produkty přes náš e-shop. Každá spolupráce pomáhá zvířatům!" },
      { type: "p", text: "Ozvěte se nám na info@nechmerust.org nebo našem Instagramu." },
    ],
    links: [{ label: "Napsat e-mail", href: "mailto:info@nechmerust.org" }],
  },
  {
    title: "Kouzelná procházka",
    date: "13. 12. 2025",
    image: "/assets/prochazka.webp",
    imageAlt: "Kouzelná procházka se zvířátky",
    archived: true,
    blocks: [
      { type: "p", text: "Kouzelná procházka se zvířátky je za námi! Už jsme se byli se zvířátky projít a bylo to kouzelné. Děkujeme všem, kteří dorazili a pomohli vytvořit nezapomenutelnou atmosféru. Zvířátka si to moc užila a my s nimi!" },
    ],
  },
  {
    title: "Luční obchůdek je spuštěn!",
    date: "8. 12. 2025",
    archived: true,
    blocks: [
      { type: "h", text: "🎉 S nadšením oznamujeme: Luční obchůdek je ONLINE! 🎉" },
      { type: "p", text: "Po dlouhých přípravách je náš e-shop, Luční obchůdek, konečně spuštěn! Nákupem jakéhokoliv produktu podpoříte přímo chod naší Louky a péči o zvířecí obyvatele. Najdete zde výrobky z naší tvorby i krásné věci od našich spřátelených tvůrců." },
    ],
    links: [{ label: "Otevřít Luční obchůdek", href: "/obchod" }],
  },
  {
    title: "Podzimní ohlédnutí: Plné seníky, bojovnice Princezna a novinky z Lučního obchůdku",
    date: "21. 11. 2025",
    archived: true,
    blocks: [
      { type: "p", text: "Milí přátelé a příznivci Louky, podzim se pomalu chýlí ke konci a my bychom se s vámi rádi podělili o to, co všechno se u nás v posledních týdnech událo. Bylo to období plné kontrastů – zažili jsme obrovskou vlnu solidarity, radost z uzdravování, ale i náročné chvíle bojů s počasím a nemocemi." },
      { type: "h", text: "Seníky praskají ve švech – díky VÁM! 🌾" },
      { type: "p", text: "Začneme tou nejlepší zprávou. Díky vaší úžasné podpoře ve sbírce se nám podařilo naplnit seníky až po strop! Je to pro nás obrovská úleva. Víme, že ať bude zima jakákoliv, naše bříška budou mít co jíst. Děkujeme každému z vás, kdo přispěl. Bez vás by to nešlo." },
      { type: "h", text: "Dýňová sezóna a boj s větry 🎃💨" },
      { type: "p", text: "Máme za sebou také intenzivní dýňovou sezónu. Pomáhali jsme v Dýňovém světě a provozovali náš stánek. Byla to fuška, ale krásná. Bohužel, příroda nám ukázala svou sílu a silný vítr nám náš stánek zničil. I to je ale život na venkově a my se nevzdáváme. Mezitím jsme na Louce stihli velký úkol – úspěšně jsme odvodnili sklep, což je pro Luční zázemí klíčové." },
      { type: "h", text: "Princezna se uzdravuje 🐷" },
      { type: "p", text: "Jak mnozí víte, naše prasinka Princezna podstoupila nákladnou a náročnou operaci. S radostí hlásíme, že se zotavuje! Je to naše velká bojovnice. Děkujeme za všechny myšlenky a příspěvky, které jí pomohly zajistit tu nejlepší péči." },
      { type: "alert", title: "⚠️ Zdraví nás trochu potrápilo – ZRUŠENÍ akcí", text: "Bohužel, s podzimem přišly i nemoci, které se nevyhnuly ani nám dvounožcům, ani zvířecím obyvatelům. Abychom všichni nabrali sílu a nic se nepřenášelo, jsme nuceni zrušit nadcházející Loukádu i nejbližší společnou procházku. Moc nás to mrzí, ale zdraví a klid na lůžku (a ve slámě) jsou teď přednější." },
      { type: "alert", title: "⚠️ ZRUŠENÍ účasti na Veggie Vánoce", text: "Bohužel vám musíme oznámit, že jsme nuceni zrušit také účast na akci Veggie Vánoce pořádanou @vegan_fighter. Pořadatelům se moc omlouváme. I přes naši absenci vás srdečně zveme k účasti na akci. Určitě si tam i bez nás užijete skvělou atmosféru a spoustu vegan pochoutek." },
      { type: "h", text: "Naděje na prosinec a VÝZVA tvůrcům ✨" },
      { type: "p", text: "Věříme, že se brzy všichni dáme do kupy. Moc doufáme, že se uvidíme na poslední akci roku – Kouzelné procházce 13. prosince. Zároveň máme výzvu pro všechny šikovné tvůrce! Chystáme Luční obchůdek a hledáme originální výrobky, které by potěšily naše příznivce a pomohly zvířatům. Pokud tvoříte s láskou, ozvěte se nám!" },
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

function ArticleCard({ a }: { a: Article }) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-surface shadow-soft">
      {a.image ? (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image src={a.image} alt={a.imageAlt ?? a.title} fill sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
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

export default function Novinky() {
  const current = articles.filter((a) => !a.archived);
  const archived = articles.filter((a) => a.archived);

  return (
    <>
      <PageHero
        image="/assets/about-hero.webp"
        imageAlt="Novinky z Louky"
        eyebrow="Co je nového"
        title="Novinky z Louky"
        subtitle="Přečtěte si, co je u nás nového, radostného i náročného v životě našich zvířecích obyvatel."
      />

      <section className="bg-surface py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="space-y-10">
            {current.map((a, i) => (
              <Reveal key={a.title} delay={(i % 2) * 0.05}>
                <ArticleCard a={a} />
              </Reveal>
            ))}
          </div>

          {archived.length ? (
            <>
              <div className="my-14 flex items-center gap-4">
                <span className="h-px flex-1 bg-border" />
                <h2 className="font-serif text-xl font-semibold text-moss-soft">Starší novinky</h2>
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-10">
                {archived.map((a) => (
                  <Reveal key={a.title}>
                    <ArticleCard a={a} />
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
