"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/** Makes every motion component honor the OS "reduce motion" setting
 *  (transforms/layout disabled, gentle opacity kept) without per-component
 *  render branches that would break SSR hydration. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
