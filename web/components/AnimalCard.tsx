"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Resident } from "@/lib/animals";

/** Animal resident card: lift + accent border + glow on hover, image zoom. */
export function AnimalCard({ animal }: { animal: Resident }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group h-full overflow-hidden rounded-lg border border-border bg-surface shadow-soft transition-[box-shadow,border-color] duration-300 hover:border-accent hover:shadow-lift"
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
      <div className="p-5">
        <h2 className="font-serif text-xl font-semibold text-moss-deep">
          {animal.name}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
          {animal.description}
        </p>
      </div>
    </motion.article>
  );
}
