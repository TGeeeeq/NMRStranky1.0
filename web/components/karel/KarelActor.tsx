"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { KarelSvg } from "./KarelSvg";

export type KarelPose = "idle" | "walking" | "chomp" | "shake-no" | "graze";

const POSE_CLASS: Record<KarelPose, string> = {
  idle: "",
  walking: "karel-walking",
  chomp: "karel-chomp",
  "shake-no": "karel-shake-no",
  graze: "karel-pose-graze",
};

/** Karel s volitelnou řečovou bublinou — stavební kámen maskota.
 *  Pózy řídí třídy z karel.css, umístění na stránce řeší rodič. */
export function KarelActor({
  pose = "idle",
  flip = false,
  size = "h-24 sm:h-28",
  bubble,
  onKarelClick,
  karelLabel = "Osel Karel",
  className = "",
}: {
  pose?: KarelPose;
  /** Otočí Karla čumákem doleva (do stránky). */
  flip?: boolean;
  /** Tailwind výškové třídy pro SVG. */
  size?: string;
  bubble?: ReactNode;
  onKarelClick?: () => void;
  karelLabel?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-end gap-2 ${POSE_CLASS[pose]} ${className}`}>
      <AnimatePresence>
        {bubble != null && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mr-2 max-w-[calc(100vw-4rem)] rounded-lg border border-border bg-cream px-4 py-3 shadow-lift sm:max-w-sm"
          >
            <span
              aria-hidden
              className="absolute -bottom-[7px] right-10 h-3.5 w-3.5 rotate-45 border-b border-r border-border bg-cream"
            />
            <div className="text-sm font-medium leading-snug text-moss-deep">{bubble}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={onKarelClick}
        aria-label={karelLabel}
        title={onKarelClick ? "Klikni na Karla" : undefined}
        className={`group relative min-h-11 min-w-11 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss ${
          onKarelClick ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <span className="karel-bob block">
          <KarelSvg
            className={`${size} w-auto drop-shadow-md transition-transform duration-300 ${
              onKarelClick ? "group-hover:-rotate-2" : ""
            } ${flip ? "-scale-x-100" : ""}`}
          />
        </span>
      </button>
    </div>
  );
}
