import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { CopyButton } from "@/components/CopyButton";
import { BANK } from "@/lib/site";

export const metadata: Metadata = {
  title: "Virtuální adopce",
  description:
    "Staňte se patronem zvířete, které si oblíbíte. Podpořte konkrétního zvířecího obyvatele Louky pravidelným příspěvkem.",
  alternates: { canonical: "/virtualni-adopce" },
};

const steps = [
  { n: 1, title: "Výběr zvířete", text: "Vyberte si zvíře, které vás zaujme." },
  { n: 2, title: "Projev zájmu", text: "Kontaktujte nás s projevem zájmu o patronát." },
  {
    n: 3,
    title: "Nastavení trvalého příkazu",
    text: "Nastavte trvalý příkaz na náš transparentní účet. Do poznámky můžete uvést, pro které zvíře je příspěvek určen.",
  },
  { n: 4, title: "Certifikace", text: "Vystavíme vám certifikát potvrzující nabytí patronátu." },
];

export default function VirtualniAdopce() {
  return (
    <>
      <PageHero
        image="/assets/kveta7.webp"
        imageAlt="Tomáš objímá krávu Květu v lese"
        objectPosition="object-[50%_30%]"
        eyebrow="Adoptujte na dálku"
        title="Virtuální adopce"
        subtitle="Staňte se patronem zvířete, které si oblíbíte."
      />

      {/* Staňte se patronem */}
      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <SectionHeader align="left" eyebrow="Splňte si sen" title="Staňte se patronem" />
              <div className="space-y-5 text-lg leading-relaxed text-text">
                <p>
                  Pokud jste si vždy přáli mít doma například krávu či ovce, ale okolnosti vám to
                  nedovolily, patronát představuje ideální příležitost, jak si alespoň částečně
                  splnit tento sen. Věříme, že sny se mají plnit, a to nejen o Vánocích.
                </p>
                <p>
                  Jako patron budete mít možnost kdykoli navštívit zvíře, vzít ho na procházku nebo
                  se s ním pomazlit. Tyto interakce jsou prospěšné jak pro vás, tak pro zvířata.
                  V případě, že vám bude chybět přímý kontakt, můžeme vám zaslat aktuální fotografie
                  či videa, abyste měli přehled o tom, jak se vašemu patronovanému zvířeti daří.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Image
                src="/assets/virtual-adoption.webp"
                alt="Virtuální adopce"
                width={760}
                height={560}
                className="w-full rounded-lg object-cover shadow-soft"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Proces patronátu */}
      <section className="bg-surface-alt py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader eyebrow="Jak na to" title="Proces patronátu" />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.06}>
                <article className="h-full rounded-lg border border-border bg-surface p-7 shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-pill bg-moss font-serif text-lg font-semibold text-cream">
                    {s.n}
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-moss-deep">{s.title}</h3>
                  <p className="mt-2 text-text-muted">{s.text}</p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Bank info */}
          <Reveal className="mx-auto mt-10 max-w-xl rounded-lg border border-border bg-surface p-8 text-center shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-wide text-moss-soft">Transparentní účet</p>
            <p className="mt-2 font-serif text-2xl font-semibold text-moss-deep">{BANK.account}</p>
            <p className="mt-1 text-text-muted">{BANK.bank}</p>
            <p className="mt-4 text-sm text-text-muted">
              Do poznámky uveďte jméno zvířete, kterého chcete adoptovat.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <CopyButton value="2002645872/2010" label="Kopírovat číslo účtu" />
              <a
                href={BANK.transparentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-pill bg-moss px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-moss-deep"
              >
                Zobrazit účet
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      <SocialSection />
    </>
  );
}
