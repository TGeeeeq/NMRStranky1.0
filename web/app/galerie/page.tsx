import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Gallery } from "@/components/Gallery";
import { SocialSection } from "@/components/SocialSection";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Nahlédněte do života obyvatel Louky skrze objektiv fotoaparátu.",
  alternates: { canonical: "/galerie" },
};

export default function Galerie() {
  return (
    <>
      <PageHero
        image="/assets/animals-hero.webp"
        imageAlt="Galerie zvířat"
        eyebrow="Život na Louce"
        title="Galerie našich zvířat"
        subtitle="Nahlédněte do života obyvatel Louky skrze objektiv fotoaparátu."
      />
      <Gallery />
      <SocialSection tone="alt" />
    </>
  );
}
