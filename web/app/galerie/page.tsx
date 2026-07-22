import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Gallery } from "@/components/Gallery";
import { GalleryVideos } from "@/components/GalleryVideos";
import { SocialSection } from "@/components/SocialSection";
import { getLocale } from "@/lib/i18n.server";
import { pick } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, { cs: "Galerie", en: "Gallery" }),
    description: pick(locale, {
      cs: "Nahlédněte do života obyvatel Louky skrze objektiv fotoaparátu.",
      en: "A glimpse into the lives of the Meadow's residents through the camera lens.",
    }),
    alternates: { canonical: "/galerie" },
  };
}

export default async function Galerie() {
  const locale = await getLocale();
  return (
    <>
      <PageHero
        image="/assets/galerie-hero.webp"
        imageAlt={pick(locale, {
          cs: "Muflon ve zlatém světle Louky",
          en: "A mouflon in the golden light of the Meadow",
        })}
        eyebrow={pick(locale, { cs: "Život na Louce", en: "Life at the Meadow" })}
        title={pick(locale, {
          cs: "Galerie našich zvířat",
          en: "Gallery of our animals",
        })}
        subtitle={pick(locale, {
          cs: "Nahlédněte do života obyvatel Louky skrze objektiv fotoaparátu.",
          en: "A glimpse into the lives of the Meadow's residents through the camera lens.",
        })}
      />
      <Gallery videos={<GalleryVideos embedded />} />
      <SocialSection tone="light" />
    </>
  );
}
