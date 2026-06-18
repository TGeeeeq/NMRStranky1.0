"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Heart, Images } from "lucide-react";
import type { Resident } from "@/lib/animals";
import { galleryAnimals } from "@/lib/animals";

const galleryNames = new Set(galleryAnimals.map((a) => a.name));

/** Animal resident card: lift + accent border + glow on hover, image zoom,
 *  plus quick links to virtual adoption and (when available) the gallery. */
export function AnimalCard({ animal }: { animal: Resident }) {
  const hasGallery = galleryNames.has(animal.name);
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-soft transition-[box-shadow,border-color] duration-300 hover:border-accent hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={animal.image}
          alt={animal.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {animal.status ? (
          <span className="absolute left-3 top-3 rounded-pill bg-terracotta px-3 py-1 text-xs font-semibold text-cream">
            {animal.status}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-serif text-xl font-semibold text-moss-deep">
          {animal.name}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
          {animal.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 pt-1">
          <Link
            href="/virtualni-adopce"
            className="inline-flex items-center gap-1.5 rounded-pill bg-moss px-3.5 py-1.5 text-xs font-semibold text-cream transition-colors hover:bg-moss-deep"
          >
            <Heart size={14} aria-hidden /> Adoptovat
          </Link>
          {hasGallery ? (
            <Link
              href={`/galerie?zvire=${encodeURIComponent(animal.name)}`}
              className="inline-flex items-center gap-1.5 rounded-pill border border-border px-3.5 py-1.5 text-xs font-semibold text-moss-deep transition-colors hover:border-accent hover:bg-surface-alt"
            >
              <Images size={14} aria-hidden /> Galerie
            </Link>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
