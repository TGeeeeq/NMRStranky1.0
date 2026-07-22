import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { AnimalCard } from "@/components/AnimalCard";
import { residents } from "@/lib/animals";
import { getLocale } from "@/lib/i18n.server";
import { pick } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, { cs: "Zvířecí obyvatelé", en: "Our animals" }),
    description: pick(locale, {
      cs: "Poznejte naše zvířecí obyvatele, kteří našli na naší Louce svůj domov — od osla Karla po kočku Mášu.",
      en: "Meet the animals who have found their home at our Meadow — from Karel the donkey to Máša the cat.",
    }),
    alternates: { canonical: "/zvireci-obyvatele" },
  };
}

export default async function ZvireciObyvatele() {
  const locale = await getLocale();
  return (
    <>
      <PageHero
        image="/assets/animals-hero.webp"
        imageAlt={pick(locale, { cs: "Zvířecí obyvatelé Louky", en: "The animals of the Meadow" })}
        eyebrow={pick(locale, { cs: "Naše rodina", en: "Our family" })}
        title={pick(locale, { cs: "Naši zvířecí obyvatelé", en: "Our animals" })}
        subtitle={pick(locale, {
          cs: "Poznejte naše zvířecí přátele, kteří našli na naší Louce svůj domov.",
          en: "Meet the animal friends who have found their home at our Meadow.",
        })}
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
