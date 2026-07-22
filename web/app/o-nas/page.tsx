import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { LogoMarquee } from "@/components/LogoMarquee";
import { SITE } from "@/lib/site";
import { getLocale } from "@/lib/i18n.server";
import { pick, type Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, { cs: "O nás", en: "About us" }),
    description: pick(locale, {
      cs: "Jsme spolek nadšenců, kteří věří v harmoničtější soužití s přírodou a zvířaty. Poznejte náš příběh, poslání a tým.",
      en: "We are an association of enthusiasts who believe in a more harmonious life alongside nature and animals. Discover our story, mission and team.",
    }),
    alternates: { canonical: "/o-nas" },
  };
}

const whatWeDo = [
  {
    cs: "Provozujeme azyl pro hospodářská a jiná zachráněná zvířata, kde mohou dožít bez hrozby násilné smrti.",
    en: "We run a sanctuary for farm and other rescued animals, where they can live out their days free from the threat of a violent death.",
  },
  {
    cs: "Pečujeme o krajinu v souladu se zásadami trvalé udržitelnosti a vytváříme permakulturní zahrady.",
    en: "We care for the land in line with the principles of sustainability and create permaculture gardens.",
  },
  {
    cs: "Vzděláváme veřejnost o možnostech etického a ekologického životního stylu bez využívání zvířat.",
    en: "We educate the public about ethical, eco-friendly living without exploiting animals.",
  },
  {
    cs: "Pořádáme semináře, přednášky a podporujeme dobrovolnictví a studentské stáže.",
    en: "We host seminars and talks and support volunteering and student internships.",
  },
];

const team = [
  {
    name: "Tomáš Bahník",
    role: { cs: "Předseda", en: "Chairman" },
    image: "/assets/tom.webp",
    bio: {
      cs: "Tomáš je vizionářem a srdcem celého projektu. Jeho láska ke zvířatům a přírodě je hnacím motorem naší organizace.",
      en: "Tomáš is the visionary and the heart of the whole project. His love for animals and nature is the driving force of our organisation.",
    },
  },
  {
    name: "Maria Krausová",
    role: { cs: "", en: "" },
    image: "/assets/maria.webp",
    bio: {
      cs: "Maria se stará o organizaci, administrativu a zajišťuje, aby vše fungovalo hladce. Je klíčovou osobou pro chod spolku.",
      en: "Maria takes care of organisation and administration and makes sure everything runs smoothly. She is key to keeping the association going.",
    },
  },
];

const partners = [
  { name: "Petra Kubicová", logo: "/assets/petra-kubicova.png", href: "https://www.petrakubicova.cz/" },
  { name: "ČSOP Trosečníci", logo: "/assets/csop-trosecnici.png", href: "https://csoptrosecnici.cz" },
  { name: "Kolodějové", logo: "/assets/kolodejove.png", href: "https://kolodejove.cz" },
  { name: "Škola pokojný bojovník", logo: "/assets/skola-pokojny-bojovnik.png", href: "https://skolapokojnybojovnik.cz" },
  { name: "Farma Jamboz", logo: "/assets/jamboz.png", href: "https://www.jamboz.cz" },
  { name: "Nakrm nás", logo: "/assets/nakrmnas.png", href: "https://www.nakrmnas.cz/nech-me-rust/" },
  { name: "Click and Feed", logo: "/assets/click-and-feed.png", href: "https://www.clickandfeed.cz" },
];

const t = {
  cs: {
    heroImageAlt: "Maria a Tomáš na Louce mezi zvířaty",
    heroEyebrow: "Kdo jsme",
    heroTitle: "Náš příběh a vize",
    heroSubtitle:
      "Jsme spolek nadšenců, kteří věří v harmoničtější soužití s přírodou a zvířaty. Pojďte se s námi seznámit.",
    missionEyebrow: "Proč to děláme",
    missionTitle: "Naše poslání",
    missionText:
      "Jsme samosprávná, dobrovolná a nepolitická nezisková organizace, jejímž hlavním cílem je pomáhat všem zvířatům. Usilujeme o osvětu v oblasti právní ochrany zvířat a aktivně chráníme životní prostředí. Naší vizí je vytvořit rodový statek, kde lidé, zvířata a příroda žijí ve vzájemné harmonii a respektu.",
    whatWeDoTitle: "Co děláme?",
    visionImageAlt: "Ruce držící klíček rostliny",
    teamEyebrow: "Lidé za projektem",
    teamTitle: "Náš tým",
    portraitAlt: "Portrét",
    infoEyebrow: "Transparentnost",
    infoTitle: "Informace o spolku",
    labelName: "Název",
    labelAddress: "Adresa",
    labelIco: "IČ",
    annualReport: "Výroční zpráva 2025",
    olderReports: "Starší zprávy a stanovy",
    infoNote:
      "Všechny výroční zprávy i stanovy spolku jsou dostupné také ve sbírce listin na portálu Justice.cz.",
    partnersEyebrow: "Děkujeme",
    partnersTitle: "Naši partneři, přátelé a podporovatelé",
    partnersDescription:
      "Velice si vážíme podpory našich partnerů, přátel a podporovatelů, díky kterým můžeme realizovat naše projekty a dosahovat stanovených cílů. Jejich důvěra a pomoc jsou pro nás klíčové.",
  },
  en: {
    heroImageAlt: "Maria and Tomáš at the Meadow among the animals",
    heroEyebrow: "Who we are",
    heroTitle: "Our story and vision",
    heroSubtitle:
      "We are an association of enthusiasts who believe in a more harmonious life alongside nature and animals. Come and get to know us.",
    missionEyebrow: "Why we do it",
    missionTitle: "Our mission",
    missionText:
      "We are a self-governing, voluntary and non-political non-profit organisation whose main goal is to help all animals. We work to raise awareness of the legal protection of animals and we actively protect the environment. Our vision is to create a homestead where people, animals and nature live together in harmony and mutual respect.",
    whatWeDoTitle: "What we do",
    visionImageAlt: "Hands holding a plant seedling",
    teamEyebrow: "The people behind the project",
    teamTitle: "Our team",
    portraitAlt: "Portrait",
    infoEyebrow: "Transparency",
    infoTitle: "About the association",
    labelName: "Name",
    labelAddress: "Address",
    labelIco: "Company ID",
    annualReport: "Annual report 2025",
    olderReports: "Older reports and statutes",
    infoNote:
      "All of the association's annual reports and statutes are also available in the collection of documents on the Justice.cz portal.",
    partnersEyebrow: "Thank you",
    partnersTitle: "Our partners, friends and supporters",
    partnersDescription:
      "We deeply appreciate the support of our partners, friends and supporters, thanks to whom we can carry out our projects and reach our goals. Their trust and help are essential to us.",
  },
} satisfies Record<Locale, Record<string, string>>;

export default async function ONas() {
  const locale = await getLocale();
  const c = t[locale];
  return (
    <>
      <PageHero
        image="/assets/o-nas-hero.webp"
        imageAlt={c.heroImageAlt}
        objectPosition="object-[72%_50%]"
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
      />

      {/* Poslání + Co děláme */}
      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader eyebrow={c.missionEyebrow} title={c.missionTitle} />
          </Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="space-y-6">
              <p className="text-lg leading-relaxed text-text">
                {c.missionText}
              </p>
              <div>
                <h3 className="font-serif text-xl font-semibold text-moss-deep">{c.whatWeDoTitle}</h3>
                <ul className="mt-4 space-y-3">
                  {whatWeDo.map((item) => (
                    <li key={item.cs} className="flex gap-3 text-text">
                      <Check size={20} className="mt-0.5 shrink-0 text-moss" aria-hidden />
                      <span>{pick(locale, item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Image
                src="/assets/vision-image.webp"
                alt={c.visionImageAlt}
                width={760}
                height={560}
                className="w-full rounded-lg object-cover shadow-soft"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Tým */}
      <section className="bg-surface-alt py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader eyebrow={c.teamEyebrow} title={c.teamTitle} />
          </Reveal>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <article className="h-full rounded-lg border border-border bg-surface p-7 text-center shadow-soft transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lift">
                  <Image
                    src={m.image}
                    alt={`${c.portraitAlt} – ${m.name}`}
                    width={140}
                    height={140}
                    className="mx-auto h-32 w-32 rounded-pill object-cover"
                  />
                  <h3 className="mt-4 font-serif text-xl font-semibold text-moss-deep">{m.name}</h3>
                  {pick(locale, m.role) ? <p className="text-sm font-medium uppercase tracking-wide text-moss">{pick(locale, m.role)}</p> : null}
                  <p className="mt-3 text-text-muted">{pick(locale, m.bio)}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Informace o spolku */}
      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader eyebrow={c.infoEyebrow} title={c.infoTitle} />
          </Reveal>
          <Reveal className="mx-auto max-w-2xl rounded-lg border border-border bg-surface-alt p-8 shadow-soft">
            <dl className="space-y-3 text-text">
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="font-semibold text-moss-deep">{c.labelName}</dt>
                <dd>{SITE.name}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="font-semibold text-moss-deep">{c.labelAddress}</dt>
                <dd>{SITE.seat}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="font-semibold text-moss-deep">{c.labelIco}</dt>
                <dd>{SITE.ico}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/vyrocni-zprava-2025"
                className="rounded-pill bg-moss px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-moss-deep"
              >
                {c.annualReport}
              </Link>
              <a
                href="https://or.justice.cz/ias/ui/vypis-sl-detail?dokument=78166435&subjektId=1213154&spis=1361387"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-pill border border-border px-5 py-2.5 text-sm font-medium text-moss-deep transition-colors hover:bg-surface-alt"
              >
                {c.olderReports}
              </a>
              <Link
                href="/gdpr"
                className="rounded-pill border border-border px-5 py-2.5 text-sm font-medium text-moss-deep transition-colors hover:bg-surface-alt"
              >
                GDPR
              </Link>
            </div>
            <p className="mt-4 text-sm text-text-muted">
              {c.infoNote}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Partneři */}
      <section className="bg-surface-alt py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow={c.partnersEyebrow}
              title={c.partnersTitle}
              description={c.partnersDescription}
            />
          </Reveal>
          <Reveal>
            <LogoMarquee logos={partners} />
          </Reveal>
        </Container>
      </section>

      <SocialSection />
    </>
  );
}
