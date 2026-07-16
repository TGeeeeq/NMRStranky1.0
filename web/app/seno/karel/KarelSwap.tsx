"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSenoKarel } from "./SenoKarelProvider";
import type { SenoBlockId } from "./seno-karel-content";

/** Přepínatelný blok stránky /seno: serverové děti = vážná verze, po
 *  Karlově zákusu se „vykousne" a nahradí Karlovou variantou z obsahové
 *  mapy. Vykousnutí = odskákaný scale po krocích, příchod = pružinka. */
export function KarelSwap({ id, children }: { id: SenoBlockId; children: ReactNode }) {
  const { isSwapped, registerBlock, karelVariant } = useSenoKarel();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => registerBlock(id, ref), [id, registerBlock]);

  const swapped = isSwapped(id);

  return (
    <div ref={ref}>
      <AnimatePresence mode="wait" initial={false}>
        {swapped ? (
          <motion.div
            key="karel"
            initial={{ opacity: 0, scale: 0.88, rotate: 1.2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
            transition={{ type: "spring", stiffness: 260, damping: 19 }}
          >
            {karelVariant(id)}
          </motion.div>
        ) : (
          <motion.div
            key="serious"
            exit={{
              scale: [1, 0.82, 0.82, 0.55, 0.55, 0.2],
              rotate: [0, -2, -2, 2, 2, -1],
              opacity: [1, 1, 1, 1, 1, 0],
              transition: { duration: 0.65, times: [0, 0.22, 0.4, 0.6, 0.78, 1] },
            }}
            style={{ transformOrigin: "85% 100%" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
