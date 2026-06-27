"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { staggerContainer, staggerItem, underlineReveal } from "@/lib/variants";
import { FloatingParticles } from "@/components/FloatingParticles";

const OVERLAY_GRADIENT =
  "bg-gradient-to-br from-moss-deep/80 via-moss-deep/55 to-moss/40";

type HeroMotionProps = {
  image: string;
  imageAlt: string;
  priority?: boolean;
  /** Max parallax travel of the background, in px. Tune per hero height. */
  parallax?: number;
  /** Classes for the <section> (min-height, etc.). */
  className?: string;
  /** Classes for the staggered content wrapper (flex/centering). */
  innerClassName?: string;
  /** Override the moss gradient overlay. */
  gradientClassName?: string;
  /** Show the bouncing scroll-down chevron. */
  scrollCue?: boolean;
  children: ReactNode;
};

/**
 * Full-bleed hero shell: parallax background image, drifting aurora + moss
 * gradient overlays, film grain, and a staggered-reveal content wrapper.
 * Wrap each element you want staggered in <HeroItem>. Respects reduced motion:
 * the parallax stops and content renders in its final state without animating.
 */
export function HeroMotion({
  image,
  imageAlt,
  priority = true,
  parallax = 120,
  className,
  innerClassName,
  gradientClassName = OVERLAY_GRADIENT,
  scrollCue = false,
  children,
}: HeroMotionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, parallax]);

  // Enable parallax only after mount, and only when motion is welcome — keeps
  // the first client render identical to the server (no hydration mismatch).
  const [parallaxOn, setParallaxOn] = useState(false);
  useEffect(() => {
    const ok =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !window.matchMedia("(pointer: coarse)").matches;
    setParallaxOn(ok);
  }, []);

  return (
    <section
      ref={ref}
      className={cn(
        "grain-overlay relative isolate overflow-hidden",
        className,
      )}
    >
      {/* Parallax background. Inner padding overscans the image so the
          translate never reveals an edge. */}
      <motion.div
        aria-hidden
        style={parallaxOn ? { y } : undefined}
        className="absolute inset-0 -z-20 will-change-transform"
      >
        <div className="absolute inset-[-18%]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="100vw"
            className="hero-kenburns object-cover"
          />
        </div>
      </motion.div>

      {/* Aurora mesh + moss gradient */}
      <div aria-hidden className="bg-aurora absolute inset-0 -z-10 opacity-55" />
      <div aria-hidden className={cn("absolute inset-0 -z-10", gradientClassName)} />

      {/* Drifting pollen */}
      <FloatingParticles />

      {/* Staggered content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className={cn("relative z-10", innerClassName)}
      >
        {children}
      </motion.div>

      {scrollCue ? <ScrollCue /> : null}
    </section>
  );
}

/** Highlighted heading phrase with an accent underline that wipes in. */
export function HeroUnderline({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className="relative whitespace-nowrap">
      {children}
      <motion.span
        aria-hidden
        variants={underlineReveal}
        style={{ transformOrigin: "left" }}
        className={cn(
          "absolute -bottom-1 left-0 -z-10 h-3 w-full rounded-pill bg-accent/40",
          className,
        )}
      />
    </span>
  );
}

/** A single staggered hero element. Inherits hidden/show from HeroMotion. */
export function HeroItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

function ScrollCue() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center text-cream/70"
    >
      <motion.span
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="flex h-10 w-10 items-center justify-center rounded-pill ring-1 ring-cream/30 backdrop-blur-sm"
      >
        <ChevronDown size={20} />
      </motion.span>
    </div>
  );
}
