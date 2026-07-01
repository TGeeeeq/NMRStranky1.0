"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { Container } from "@/components/Container";
import { FloatingParticles } from "@/components/FloatingParticles";
import { staggerContainer, staggerItem } from "@/lib/variants";

// Mutable tuple (not `as const`) so it satisfies motion's `number[]` easing type.
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Headline lines cascade up out of a clip mask, nested inside the stagger flow. */
const lineParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};
const lineChild: Variants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.85, ease: EASE } },
};

/**
 * Homepage-only cinematic hero ("Živá scéna"). A full-bleed photo that reacts
 * to the cursor (spring-smoothed 3D tilt + a light that follows the pointer) and
 * to scroll (multi-layer parallax that hands off by rounding the photo into a
 * framed panel as the next section rises to meet it). Purpose-built and single
 * use — the shared HeroMotion still serves the inner pages.
 *
 * Two independent gates, both resolved AFTER mount so the first client render
 * matches the server (no hydration mismatch): `motionOn` (scroll choreography,
 * on unless reduced-motion) and `fx` (cursor effects, desktop fine-pointer only).
 */
export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);

  const [motionOn, setMotionOn] = useState(false);
  const [fx, setFx] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setMotionOn(!reduce);
    setFx(!reduce && fine && !coarse);
  }, []);

  // ── Scroll choreography: progress 0 at rest → 1 as the hero leaves upward ──
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  // The "settle": photo insets + rounds over the last stretch, so the framed
  // panel reads as a hand-off to the About section rather than a hard cut.
  const frameRadius = useTransform(scrollYProgress, [0.5, 1], [0, 24]);
  const frameInset = useTransform(scrollYProgress, [0.5, 1], [0, 2.4]);
  const framePad = useMotionTemplate`${frameInset}rem`;

  // ── Cursor reactivity (fine pointer only) ──
  const px = useMotionValue(0); // normalized -0.5..0.5 within the section
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 120, damping: 18, mass: 0.6 });
  const imgX = useTransform(sx, [-0.5, 0.5], [16, -16]);
  const imgY = useTransform(sy, [-0.5, 0.5], [16, -16]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-3.5, 3.5]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [3.5, -3.5]);
  const hlX = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const hlY = useTransform(sy, [-0.5, 0.5], [-6, 6]);
  const glowX = useSpring(useMotionValue(-1000), { stiffness: 200, damping: 30 });
  const glowY = useSpring(useMotionValue(-1000), { stiffness: 200, damping: 30 });
  const glow = useMotionTemplate`radial-gradient(520px circle at ${glowX}px ${glowY}px, rgba(247,242,231,0.14), transparent 62%)`;

  useEffect(() => {
    if (!fx) return;
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px.set((e.clientX - r.left) / r.width - 0.5);
      py.set((e.clientY - r.top) / r.height - 0.5);
      glowX.set(e.clientX - r.left);
      glowY.set(e.clientY - r.top);
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
      glowX.set(-1000);
      glowY.set(-1000);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [fx, px, py, glowX, glowY]);

  return (
    <section
      ref={sectionRef}
      className="grain-overlay relative isolate flex min-h-[92vh] items-center overflow-hidden bg-moss-deep"
    >
      {/* Photo frame — scroll inset reveals the moss gutter as it settles */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-30"
        style={motionOn ? { padding: framePad } : undefined}
      >
        {/* Settle + dolly */}
        <motion.div
          className="relative h-full w-full overflow-hidden will-change-transform"
          style={
            motionOn
              ? { borderRadius: frameRadius, scale: photoScale, y: photoY }
              : undefined
          }
        >
          {/* Cursor tilt/pan — transformPerspective avoids the ancestor-perspective gotcha */}
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={
              fx
                ? { x: imgX, y: imgY, rotateX, rotateY, transformPerspective: 1200 }
                : undefined
            }
          >
            {/* One-shot arrival settle (1.08 → 1.0), overscanned so tilt/scale never reveal an edge */}
            <motion.div
              className="absolute inset-[-10%]"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.3, ease: EASE }}
            >
              <Image
                src="/assets/animals-hero.webp"
                alt="Husy, slepice a ovce na louce ve večerním světle"
                fill
                preload
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
            {fx ? (
              <motion.div
                aria-hidden
                className="absolute inset-0"
                style={{ background: glow }}
              />
            ) : null}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Aurora color wash over the photo */}
      <div aria-hidden className="bg-aurora absolute inset-0 -z-20 opacity-35" />

      {/* Legibility overlays — deepen as the hero scrolls out */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={motionOn ? { opacity: overlayOpacity } : undefined}
      >
        <div className="absolute inset-0 bg-moss-deep/40" />
        <div className="absolute inset-0 [background:radial-gradient(120%_100%_at_50%_34%,transparent_38%,rgba(31,61,42,0.55)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-moss-deep/85 via-moss-deep/25 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-moss-deep/55 to-transparent" />
      </motion.div>

      <FloatingParticles />

      {/* Content — single centered column, no logo */}
      <motion.div
        className="relative z-10 w-full"
        style={motionOn ? { y: contentY, opacity: contentOpacity } : undefined}
      >
        <Container className="py-28 sm:py-32">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            style={fx ? { x: hlX, y: hlY } : undefined}
            className="mx-auto max-w-3xl text-center text-cream"
          >
            <motion.p
              variants={staggerItem}
              className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-accent"
            >
              Nech mě růst z.s.
            </motion.p>
            <motion.h1
              variants={lineParent}
              className="text-balance font-serif text-[2.6rem] font-semibold leading-[1.05] text-cream sm:text-6xl lg:text-7xl"
            >
              <Line>Tvoříme prostor pro růst</Line>
              <Line>duše, srdce i přírody</Line>
            </motion.h1>
            <motion.p
              variants={staggerItem}
              className="mx-auto mt-6 max-w-xl text-lg text-cream/85"
            >
              Nezisková organizace s vizí tvorby rodového statku, kde žijeme
              v harmonii s přírodou, zvířaty i sebou navzájem.
            </motion.p>
            <motion.div
              variants={staggerItem}
              className="mt-9 flex flex-wrap justify-center gap-4"
            >
              <Link
                href="/jak-se-zapojit"
                className="rounded-pill bg-accent px-7 py-3 font-semibold text-moss-deep shadow-lift transition-transform hover:-translate-y-0.5"
              >
                Jak se zapojit
              </Link>
              <Link
                href="/o-nas"
                className="rounded-pill border border-cream/40 px-7 py-3 font-medium text-cream backdrop-blur-sm transition-colors hover:bg-cream/10"
              >
                Více o nás
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </motion.div>

      {/* Scroll cue — fades on first scroll */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center text-cream/70"
        style={motionOn ? { opacity: cueOpacity } : undefined}
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="flex h-10 w-10 items-center justify-center rounded-pill ring-1 ring-cream/30 backdrop-blur-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.span>
      </motion.div>
    </section>
  );
}

/** One headline line: a clip mask its inner span rises out of. */
function Line({ children }: { children: ReactNode }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span variants={lineChild} className="block">
        {children}
      </motion.span>
    </span>
  );
}
