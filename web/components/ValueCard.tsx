"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/** Value card: lift + accent border + glow on hover, with an icon micro-bounce.
 *  `icon` is an already-rendered element (functions can't cross the RSC boundary). */
export function ValueCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group h-full rounded-lg border border-border bg-surface p-7 text-center shadow-soft transition-[box-shadow,border-color] duration-300 hover:border-accent hover:shadow-lift"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-pill bg-moss/10 text-moss transition-[transform,background-color] duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-accent/30">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-semibold text-moss-deep">{title}</h3>
      <p className="mt-2 text-text-muted">{text}</p>
    </motion.article>
  );
}
