import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, Sprout, Users, Leaf, Mail } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { VideoFacade } from "@/components/VideoFacade";
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
      <section className="relative isolate overflow-hidden">
        <Image
          src="/assets/hero-image.webp"
          alt="Lidé se zvířaty na louce"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-moss-deep/85 via-moss-deep/70 to-moss/55" />
        <Container className="flex min-h-[86vh] items-center py-24">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="text-cream">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Nech mě růst z.s.
              </p>
              <h1 className="text-balance font-serif text-4xl font-semibold leading-[1.1] text-cream sm:text-5xl lg:text-6xl">
                Tvoříme prostor pro růst duše,{" "}
                <span className="relative whitespace-nowrap">
                  srdce i přírody
                  <span className="absolute -bottom-1 left-0 -z-10 h-3 w-full rounded-pill bg-accent/40" />
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-cream/90">
                Nech Mě Růst z.s. je nezisková organizace s vizí tvorby rodového
                statku, kde žijeme v harmonii s přírodou, zvířaty i sebou navzájem.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/jak-se-zapojit"
                  className="rounded-pill bg-accent px-7 py-3 font-semibold text-moss-deep shadow-lift transition-transform hover:-translate-y-0.5"
                >
                  Jak se zapojit
                </Link>
                <Link
                  href="/o-nas"
                  className="rounded-pill border border-cream/40 px-7 py-3 font-medium text-cream transition-colors hover:bg-cream/10"
                >
                  Více o nás
                </Link>
              </div>
            </div>
            <div className="hidden justify-self-center lg:block">
              <div className="rounded-pill bg-cream/10 p-4 ring-1 ring-cream/20 backdrop-blur-sm">
                <Image
                  src="/assets/logo-circle.png"
                  alt="Logo Nech mě růst"
                  width={300}
                  height={300}
                  priority
                  className="h-64 w-64 rounded-pill object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* About */}
      <section className="bg-surface py-20 sm:py-24">
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

      {/* Values */}
      <section className="bg-surface-alt py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader eyebrow="Co nás vede" title="Naše hodnoty" />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <article className="h-full rounded-lg border border-border bg-surface p-7 text-center shadow-soft transition-transform hover:-translate-y-1">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-pill bg-moss/10 text-moss">
                    <v.icon size={26} aria-hidden />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-moss-deep">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-text-muted">{v.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Video */}
      <section id="video-section" className="bg-moss-deep py-20 sm:py-24">
        <Container>
          <Reveal>
            <VideoFacade
              poster="/assets/video-poster.webp"
              title="Naše společné procházky"
            />
            <p className="mt-5 text-center text-cream/85">
              Naše společné procházky
            </p>
          </Reveal>
        </Container>
      </section>

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
