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

export const metadata: Metadata = {
  title: "O nás",
  description:
    "Jsme spolek nadšenců, kteří věří v harmoničtější soužití s přírodou a zvířaty. Poznejte náš příběh, poslání a tým.",
  alternates: { canonical: "/o-nas" },
};

const whatWeDo = [
  "Provozujeme azyl pro hospodářská a jiná zachráněná zvířata, kde mohou dožít bez hrozby násilné smrti.",
  "Pečujeme o krajinu v souladu se zásadami trvalé udržitelnosti a vytváříme permakulturní zahrady.",
  "Vzděláváme veřejnost o možnostech etického a ekologického životního stylu bez využívání zvířat.",
  "Pořádáme semináře, přednášky a podporujeme dobrovolnictví a studentské stáže.",
];

const team = [
  {
    name: "Tomáš Bahník",
    role: "Předseda",
    image: "/assets/tom.webp",
    bio: "Tomáš je vizionářem a srdcem celého projektu. Jeho láska ke zvířatům a přírodě je hnacím motorem naší organizace.",
  },
  {
    name: "Maria Krausová",
    role: "",
    image: "/assets/maria.webp",
    bio: "Maria se stará o organizaci, administrativu a zajišťuje, aby vše fungovalo hladce. Je klíčovou osobou pro chod spolku.",
  },
];

const partners = [
  { name: "Nakrmnas.cz", logo: "/assets/nakrmnas.png", href: "https://www.nakrmnas.cz/nech-me-rust/" },
  { name: "clickandfeed.cz", logo: "/assets/click-and-feed.png", href: "https://www.clickandfeed.cz" },
  { name: "jamboz.cz", logo: "/assets/jamboz.webp", href: "https://www.jamboz.cz" },
];

export default function ONas() {
  return (
    <>
      <PageHero
        image="/assets/o-nas-hero.webp"
        imageAlt="Maria a Tomáš na Louce mezi zvířaty"
        eyebrow="Kdo jsme"
        title="Náš příběh a vize"
        subtitle="Jsme spolek nadšenců, kteří věří v harmoničtější soužití s přírodou a zvířaty. Pojďte se s námi seznámit."
      />

      {/* Poslání + Co děláme */}
      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader eyebrow="Proč to děláme" title="Naše poslání" />
          </Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="space-y-6">
              <p className="text-lg leading-relaxed text-text">
                Jsme samosprávná, dobrovolná a nepolitická nezisková organizace, jejímž
                hlavním cílem je pomáhat všem zvířatům. Usilujeme o osvětu v oblasti
                právní ochrany zvířat a aktivně chráníme životní prostředí. Naší vizí je
                vytvořit rodový statek, kde lidé, zvířata a příroda žijí ve vzájemné
                harmonii a respektu.
              </p>
              <div>
                <h3 className="font-serif text-xl font-semibold text-moss-deep">Co děláme?</h3>
                <ul className="mt-4 space-y-3">
                  {whatWeDo.map((item) => (
                    <li key={item} className="flex gap-3 text-text">
                      <Check size={20} className="mt-0.5 shrink-0 text-moss" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Image
                src="/assets/vision-image.webp"
                alt="Ruce držící klíček rostliny"
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
            <SectionHeader eyebrow="Lidé za projektem" title="Náš tým" />
          </Reveal>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <article className="h-full rounded-lg border border-border bg-surface p-7 text-center shadow-soft transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lift">
                  <Image
                    src={m.image}
                    alt={`Portrét – ${m.name}`}
                    width={140}
                    height={140}
                    className="mx-auto h-32 w-32 rounded-pill object-cover"
                  />
                  <h3 className="mt-4 font-serif text-xl font-semibold text-moss-deep">{m.name}</h3>
                  {m.role ? <p className="text-sm font-medium uppercase tracking-wide text-moss">{m.role}</p> : null}
                  <p className="mt-3 text-text-muted">{m.bio}</p>
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
            <SectionHeader eyebrow="Transparentnost" title="Informace o spolku" />
          </Reveal>
          <Reveal className="mx-auto max-w-2xl rounded-lg border border-border bg-surface-alt p-8 shadow-soft">
            <dl className="space-y-3 text-text">
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="font-semibold text-moss-deep">Název</dt>
                <dd>{SITE.name}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="font-semibold text-moss-deep">Adresa</dt>
                <dd>{SITE.seat}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="font-semibold text-moss-deep">IČ</dt>
                <dd>{SITE.ico}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/vyrocni-zprava-2025"
                className="rounded-pill bg-moss px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-moss-deep"
              >
                Výroční zpráva 2025
              </Link>
              <a
                href="https://or.justice.cz/ias/ui/vypis-sl-detail?dokument=78166435&subjektId=1213154&spis=1361387"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-pill border border-border px-5 py-2.5 text-sm font-medium text-moss-deep transition-colors hover:bg-surface-alt"
              >
                Starší zprávy a stanovy
              </a>
              <Link
                href="/gdpr"
                className="rounded-pill border border-border px-5 py-2.5 text-sm font-medium text-moss-deep transition-colors hover:bg-surface-alt"
              >
                GDPR
              </Link>
            </div>
            <p className="mt-4 text-sm text-text-muted">
              Všechny výroční zprávy i stanovy spolku jsou dostupné také ve sbírce
              listin na portálu Justice.cz.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Partneři */}
      <section className="bg-surface-alt py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow="Děkujeme"
              title="Naši partneři"
              description="Velice si vážíme podpory našich partnerů, díky kterým můžeme realizovat naše projekty a dosahovat stanovených cílů. Jejich důvěra a podpora jsou pro nás klíčové."
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
