import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { AnimalCard } from "@/components/AnimalCard";
import { residents } from "@/lib/animals";

export const metadata: Metadata = {
  title: "Zvířecí obyvatelé",
  description:
    "Poznejte naše zvířecí obyvatele, kteří našli na naší Louce svůj domov — od osla Karla po kočku Mášu.",
  alternates: { canonical: "/zvireci-obyvatele" },
};

export default function ZvireciObyvatele() {
  return (
    <>
      <PageHero
        image="/assets/animals-hero.webp"
        imageAlt="Zvířecí obyvatelé Louky"
        eyebrow="Naše rodina"
        title="Naši zvířecí obyvatelé"
        subtitle="Poznejte naše zvířecí přátele, kteří našli na naší Louce svůj domov."
      />

      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {residents.map((a, i) => (
              <Reveal key={a.name} delay={(i % 3) * 0.05}>
                <AnimalCard animal={a} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <SocialSection tone="alt" />
    </>
  );
}
