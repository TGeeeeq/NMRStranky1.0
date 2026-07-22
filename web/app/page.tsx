import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Sprout, Users, Leaf, Mail } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { HomeHero } from "@/components/HomeHero";
import { StatsBand } from "@/components/StatsBand";
import { SectionDivider } from "@/components/SectionDivider";
import { ValueCard } from "@/components/ValueCard";
import { InstagramIcon, FacebookIcon } from "@/components/BrandIcons";
import { getLocale } from "@/lib/i18n.server";
import { pick, type Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, { cs: "Domů", en: "Home" }),
    description: pick(locale, {
      cs: "Nech mě růst z.s. je nezisková organizace s vizí tvorby rodového statku, kde žijeme v harmonii s přírodou, zvířaty i sebou navzájem.",
      en: "Nech mě růst z.s. is a non-profit with a vision of a homestead where we live in harmony with nature, animals and one another.",
    }),
    alternates: { canonical: "/" },
  };
}

const values = [
  {
    icon: Heart,
    title: { cs: "Péče o zvířata", en: "Care for animals" },
    text: {
      cs: "Poskytování bezpečného a láskyplného domova pro zvířata.",
      en: "Providing a safe and loving home for animals.",
    },
  },
  {
    icon: Sprout,
    title: { cs: "Soběstačnost", en: "Self-sufficiency" },
    text: {
      cs: "Aktivní usilování o udržitelný a soběstačný způsob života.",
      en: "Actively pursuing a sustainable, self-sufficient way of life.",
    },
  },
  {
    icon: Users,
    title: { cs: "Komunita", en: "Community" },
    text: {
      cs: "Budování silné a podporující komunity kolem naší Louky.",
      en: "Building a strong, supportive community around our Meadow.",
    },
  },
  {
    icon: Leaf,
    title: { cs: "Soulad s přírodou", en: "Harmony with nature" },
    text: {
      cs: "Láskyplné propojení s přírodou a cesta života v jejím rytmu.",
      en: "A loving connection with nature and a life lived to its rhythm.",
    },
  },
];

const socials = [
  { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/nech_me_rust", external: true },
  { icon: FacebookIcon, label: "Facebook", href: "https://www.facebook.com/share/1BDFbAxfFf/", external: true },
  { icon: Mail, label: "Email", href: "mailto:info@nechmerust.org", external: false },
];

const t = {
  cs: {
    aboutEyebrow: "Kdo jsme",
    aboutTitle: "O projektu",
    about1:
      "Na Louce žijí zvířata, která jsme přijali do péče, a která u nás nacházejí bezpečný domov, dostatek krmiva a čisté, teplé místo k odpočinku. Každé zvíře má svůj příběh a my se snažíme zajistit jim co nejlepší život.",
    about2:
      "Věříme, že způsob, jakým žijeme a jak zacházíme se světem kolem nás, má hluboký dopad na naše blaho i na zdraví celé planety. Proto se snažíme žít vědomě, s úctou k tradičním hodnotám, ale i s otevřeností k novým, udržitelným přístupům.",
    about3:
      "Naším posláním je nejen vytvářet takové prostředí pro nás samotné, ale také inspirovat ostatní, sdílet naše zkušenosti a znalosti, a tím přispívat k širší společenské transformaci směrem k harmoničtějšímu vztahu s naším prostředím.",
    aboutAlt: "Zvířata na louce",
    valuesEyebrow: "Co nás vede",
    valuesTitle: "Naše hodnoty",
    socialEyebrow: "Buďte v kontaktu",
    socialTitle: "Sledujte nás",
  },
  en: {
    aboutEyebrow: "Who we are",
    aboutTitle: "About the project",
    about1:
      "The Meadow is home to animals we have taken into our care, where they find a safe home, plenty of food and a clean, warm place to rest. Every animal has its story, and we do our best to give them the finest life possible.",
    about2:
      "We believe that the way we live and treat the world around us has a profound impact on our well-being and on the health of the whole planet. That is why we strive to live consciously — with respect for traditional values, yet open to new, sustainable approaches.",
    about3:
      "Our mission is not only to create such an environment for ourselves, but also to inspire others, to share our experience and knowledge, and thereby contribute to a wider social shift toward a more harmonious relationship with our surroundings.",
    aboutAlt: "Animals in the meadow",
    valuesEyebrow: "What drives us",
    valuesTitle: "Our values",
    socialEyebrow: "Stay in touch",
    socialTitle: "Follow us",
  },
} satisfies Record<Locale, Record<string, string>>;

export default async function Home() {
  const locale = await getLocale();
  const c = t[locale];
  return (
    <>
      {/* Hero */}
      <HomeHero />

      {/* About */}
      <section className="relative isolate overflow-hidden bg-surface py-20 sm:py-24">
        <div
          aria-hidden
          className="blob blob-accent blob-morph -left-32 top-10 h-80 w-80 opacity-30"
        />
        <Container>
          <Reveal>
            <SectionHeader eyebrow={c.aboutEyebrow} title={c.aboutTitle} />
          </Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="space-y-5 text-lg leading-relaxed text-text">
              <p>{c.about1}</p>
              <p>{c.about2}</p>
              <p>{c.about3}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <Image
                src="/assets/about-image.webp"
                alt={c.aboutAlt}
                width={760}
                height={560}
                className="w-full rounded-lg object-cover shadow-soft"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      <SectionDivider from="bg-surface" to="fill-moss-deep" />

      {/* Impact stats */}
      <StatsBand />

      <SectionDivider from="bg-moss-deep" to="fill-surface-alt" flip />

      {/* Values */}
      <section className="relative isolate overflow-hidden bg-surface-alt py-20 sm:py-24">
        <div
          aria-hidden
          className="blob blob-moss blob-morph -right-40 -bottom-20 h-96 w-96 opacity-20"
        />
        <Container>
          <Reveal>
            <SectionHeader eyebrow={c.valuesEyebrow} title={c.valuesTitle} />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title.cs} delay={i * 0.06}>
                <ValueCard
                  icon={<v.icon size={26} aria-hidden />}
                  title={pick(locale, v.title)}
                  text={pick(locale, v.text)}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <SectionDivider from="bg-surface-alt" to="fill-surface" />

      {/* Social */}
      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader eyebrow={c.socialEyebrow} title={c.socialTitle} />
          </Reveal>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.external ? "_blank" : undefined}
                rel={s.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-3 rounded-pill border border-border bg-surface px-6 py-3 font-medium text-moss-deep shadow-soft transition-transform hover:-translate-y-0.5"
              >
                <s.icon size={20} /> {s.label}
              </a>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
