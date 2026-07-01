import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Gallery } from "@/components/Gallery";
import { GalleryVideos } from "@/components/GalleryVideos";
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
        image="/assets/galerie-hero.webp"
        imageAlt="Muflon ve zlatém světle Louky"
        eyebrow="Život na Louce"
        title="Galerie našich zvířat"
        subtitle="Nahlédněte do života obyvatel Louky skrze objektiv fotoaparátu."
      />
      <Gallery videos={<GalleryVideos embedded />} />
      <SocialSection tone="light" />
    </>
  );
}
