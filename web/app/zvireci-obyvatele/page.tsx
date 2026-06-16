import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
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
                <article className="group h-full overflow-hidden rounded-lg border border-border bg-surface shadow-soft transition-transform hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={a.image}
                      alt={a.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {a.status ? (
                      <span className="absolute left-3 top-3 rounded-pill bg-terracotta px-3 py-1 text-xs font-semibold text-cream">
                        {a.status}
                      </span>
                    ) : null}
                  </div>
                  <div className="p-5">
                    <h2 className="font-serif text-xl font-semibold text-moss-deep">{a.name}</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{a.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <SocialSection tone="alt" />
    </>
  );
}
