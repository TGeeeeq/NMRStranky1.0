"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { RunnerSprite } from "./RunnerSprite";
import { KarelGuide } from "./KarelGuide";

function Carrot({ className, size = 24, rot = 0 }: { className?: string; size?: number; rot?: number }) {
  return (
    <svg
      viewBox="0 0 24 34"
      width={size}
      className={`lr-carrot-bob ${className ?? ""}`}
      style={{ "--rot": `${rot}deg` } as React.CSSProperties}
      aria-hidden="true"
    >
      <path d="M4 8 L12 32 L20 8 Z" fill="#e8833a" />
      <path d="M7 6 Q9 -2 12 5 Q14 -3 17 6" stroke="#4a7c4e" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Cloud({ className, duration, delay = 0 }: { className?: string; duration: number; delay?: number }) {
  return (
    <svg
      viewBox="0 0 160 48"
      fill="#ffffff"
      className={`lr-cloud absolute ${className ?? ""}`}
      style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      <ellipse cx="40" cy="30" rx="40" ry="16" />
      <ellipse cx="85" cy="22" rx="34" ry="14" />
      <ellipse cx="120" cy="32" rx="38" ry="14" />
    </svg>
  );
}

function Flyer({ top, duration, delay, swallow }: { top: string; duration: number; delay: number; swallow?: boolean }) {
  const c = swallow ? "#3a4a5a" : "#f4f1ea";
  return (
    <div className="lr-flyer absolute left-0" style={{ top, animationDuration: `${duration}s`, animationDelay: `${delay}s` }} aria-hidden>
      <svg viewBox="0 0 60 30" width={swallow ? 34 : 52}>
        <ellipse cx="30" cy="18" rx="16" ry="6" fill={c} />
        {!swallow && <path d="M14 18 L2 14 L6 20 Z" fill="#e8833a" />}
        <circle cx="44" cy="14" r="5" fill={c} />
        <g className="lr-wing">
          <path d="M22 16 Q30 -2 44 8 Q34 14 30 18 Z" fill={c} stroke={swallow ? "none" : "#d8d2c4"} strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}

const TITLE = "Louka Run".split("");

export function HeroScene({ hasAccess }: { hasAccess: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const hillBack = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 60]);
  const hillMid = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 30]);
  const skyFloat = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-[#8ed4f7] via-[#a8e0f9] to-[#c8ecfb]">
      {/* obloha */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ y: skyFloat }}>
        <div className="lr-sun absolute right-[10%] top-8 h-24 w-24 rounded-full bg-[#fff3b0] blur-[2px] sm:right-[12%] sm:h-36 sm:w-36" />
        <Cloud className="top-14 w-44 opacity-90" duration={95} />
        <Cloud className="top-36 w-28 opacity-70" duration={70} delay={-30} />
        <Cloud className="top-6 w-24 opacity-50" duration={120} delay={-70} />
        <Flyer top="18%" duration={26} delay={-4} />
        <Flyer top="28%" duration={17} delay={-11} swallow />
      </motion.div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 pb-64 pt-20 text-center sm:pb-72 sm:pt-24">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-moss-deep/70"
        >
          Hra azylu Nech mě růst
        </motion.p>

        <h1 className="font-serif text-6xl font-bold leading-none text-moss-deep drop-shadow-[0_4px_16px_rgba(255,255,255,0.5)] sm:text-7xl lg:text-8xl">
          <span className="sr-only">Louka Run</span>
          <span aria-hidden>
            {TITLE.map((ch, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: reduced ? 0 : 38, rotate: reduced ? 0 : -6 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.55, delay: 0.12 + i * 0.055, type: "spring", bounce: 0.45 }}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </span>
          <motion.svg
            aria-hidden
            viewBox="0 0 24 34"
            className="ml-2 inline-block h-[0.55em] w-auto align-baseline"
            initial={{ opacity: 0, scale: 0, rotate: 120 }}
            animate={{ opacity: 1, scale: 1, rotate: -12 }}
            transition={{ duration: 0.6, delay: 0.75, type: "spring", bounce: 0.5 }}
          >
            <path d="M4 8 L12 32 L20 8 Z" fill="#e8833a" />
            <path d="M7 6 Q9 -2 12 5 Q14 -3 17 6" stroke="#4a7c4e" strokeWidth="3" fill="none" strokeLinecap="round" />
          </motion.svg>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 max-w-xl text-balance text-lg font-medium text-moss-deep sm:text-xl"
        >
          Endless runner ze skutečné louky. Běhej, skákej a sbírej mrkve za šest
          zachráněných zvířat z našeho azylu.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={hasAccess ? "/loukarun/app/index.html" : "#hrat"}
            className="rounded-pill bg-moss px-10 py-4 text-lg font-semibold text-cream shadow-lg transition hover:-translate-y-0.5 hover:bg-moss-deep"
          >
            ▶ {hasAccess ? "Hrát" : "Chci hrát"}
          </a>
          <a
            href="#zvirata"
            className="rounded-pill border-2 border-moss-deep/30 bg-white/50 px-8 py-4 text-lg font-semibold text-moss-deep backdrop-blur transition hover:bg-white/80"
          >
            Poznej běžce
          </a>
        </motion.div>

        <KarelGuide section="hero" className="mt-12 sm:mt-14" />
      </div>

      {/* vrstvené kopce s parallaxem */}
      <motion.svg
        aria-hidden
        style={{ y: hillBack }}
        className="absolute bottom-6 left-0 w-full"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
      >
        <path d="M0 120 Q 240 60 480 110 T 960 100 T 1440 90 V220 H0 Z" fill="#6b8e6e" opacity="0.55" />
      </motion.svg>
      <motion.svg
        aria-hidden
        style={{ y: hillMid }}
        className="absolute bottom-3 left-0 w-full"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
      >
        <path d="M0 150 Q 300 90 620 140 T 1440 130 V220 H0 Z" fill="#4a7c4e" opacity="0.75" />
      </motion.svg>
      <svg aria-hidden className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 220" preserveAspectRatio="none">
        <path d="M0 180 Q 360 130 760 175 T 1440 165 V220 H0 Z" fill="#2d5a3d" />
      </svg>

      {/* mrkve na přední louce */}
      <div aria-hidden className="pointer-events-none absolute bottom-2 left-[13%]"><Carrot rot={8} size={22} /></div>
      <div aria-hidden className="pointer-events-none absolute bottom-5 left-[47%]"><Carrot rot={-5} size={17} className="[animation-delay:-1.2s]" /></div>
      <div aria-hidden className="pointer-events-none absolute bottom-3 right-[16%]"><Carrot rot={4} size={20} className="[animation-delay:-0.6s]" /></div>

      {/* běžící sprite přes celou louku */}
      <div aria-hidden className="lr-runner pointer-events-none absolute bottom-0 left-0" style={{ animationDuration: "17s" }}>
        <RunnerSprite id="karel" className="h-16 w-auto sm:h-20" />
      </div>
    </section>
  );
}
