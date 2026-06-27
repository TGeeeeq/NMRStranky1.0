/**
 * Shared motion variants. Plain data (no "use client") — imported by the
 * client components that animate. Easing matches the design token
 * --ease-out: cubic-bezier(0.22, 1, 0.36, 1), same curve as Reveal.tsx.
 */
import type { Variants } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Parent: reveals its children one after another. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.12 },
  },
};

/** Child of staggerContainer: fade + rise. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Accent underline that wipes in from the left. transformOrigin set inline. */
export const underlineReveal: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 0.7, delay: 0.5, ease: EASE },
  },
};
