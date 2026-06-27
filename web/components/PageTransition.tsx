"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/** Enter animation that fires on every route change (the template remounts).
 *  Reduced motion drops the slide (kept opacity) via the app-wide MotionConfig.
 *  Enter-only by design — the old page unmounts before this remounts. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
