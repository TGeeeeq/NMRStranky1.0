"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary';

/**
 * Soft accent ring that trails the pointer and grows over interactive elements.
 * The native cursor stays visible. Only renders on fine pointers (mouse) and
 * never under prefers-reduced-motion. Decorative — pointer-events: none.
 */
export function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      setHovering(!!target?.closest(INTERACTIVE));
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60]"
      style={{ x: sx, y: sy }}
    >
      {/* No backdrop-filter/mix-blend here — both force the browser to
          re-sample the pixels beneath the ring on every mousemove frame. */}
      <motion.span
        className="block -translate-x-1/2 -translate-y-1/2 rounded-pill border border-moss/50 bg-moss/5"
        animate={{
          width: hovering ? 48 : 26,
          height: hovering ? 48 : 26,
          borderColor: hovering ? "rgba(184, 92, 60, 0.6)" : "rgba(45, 90, 61, 0.5)",
          backgroundColor: hovering
            ? "rgba(240, 232, 146, 0.18)"
            : "rgba(45, 90, 61, 0.05)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
    </motion.div>
  );
}
