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

export const metadata: Metadata = {
  title: "Domů",
  description:
    "Nech mě růst z.s. je nezisková organizace s vizí tvorby rodového statku, kde žijeme v harmonii s přírodou, zvířaty i sebou navzájem.",
  alternates: { canonical: "/" },
};

const values = [
  {
    icon: Heart,
    title: "Péče o zvířata",
    text: "Poskytování bezpečného a láskyplného domova pro zvířata.",
  },
  {
    icon: Sprout,
    title: "Soběstačnost",
    text: "Aktivní usilování o udržitelný a soběstačný způsob života.",
  },
  {
    icon: Users,
    title: "Komunita",
    text: "Budování silné a podporující komunity kolem naší Louky.",
  },
  {
    icon: Leaf,
    title: "Soulad s přírodou",
    text: "Láskyplné propojení s přírodou a cesta života v jejím rytmu.",
  },
];

const socials = [
  { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/nech_me_rust", external: true },
  { icon: FacebookIcon, label: "Facebook", href: "https://www.facebook.com/share/1BDFbAxfFf/", external: true },
  { icon: Mail, label: "Email", href: "mailto:info@nechmerust.org", external: false },
];

export default function Home() {
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
            <SectionHeader eyebrow="Kdo jsme" title="O projektu" />
          </Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="space-y-5 text-lg leading-relaxed text-text">
              <p>
                Na Louce žijí zvířata, která jsme přijali do péče, a která u nás
                nacházejí bezpečný domov, dostatek krmiva a čisté, teplé místo
                k odpočinku. Každé zvíře má svůj příběh a my se snažíme zajistit
                jim co nejlepší život.
              </p>
              <p>
                Věříme, že způsob, jakým žijeme a jak zacházíme se světem kolem
                nás, má hluboký dopad na naše blaho i na zdraví celé planety.
                Proto se snažíme žít vědomě, s úctou k tradičním hodnotám, ale
                i s otevřeností k novým, udržitelným přístupům.
              </p>
              <p>
                Naším posláním je nejen vytvářet takové prostředí pro nás
                samotné, ale také inspirovat ostatní, sdílet naše zkušenosti
                a znalosti, a tím přispívat k širší společenské transformaci
                směrem k harmoničtějšímu vztahu s naším prostředím.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Image
                src="/assets/about-image.webp"
                alt="Zvířata na louce"
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
            <SectionHeader eyebrow="Co nás vede" title="Naše hodnoty" />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <ValueCard
                  icon={<v.icon size={26} aria-hidden />}
                  title={v.title}
                  text={v.text}
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
            <SectionHeader eyebrow="Buďte v kontaktu" title="Sledujte nás" />
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
