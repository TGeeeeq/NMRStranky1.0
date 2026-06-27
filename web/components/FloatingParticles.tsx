import type { CSSProperties } from "react";

/**
 * Decorative drifting pollen/seeds for hero backgrounds. Deterministic configs
 * (no random → SSR-safe). Pure CSS animation, gated by prefers-reduced-motion
 * in globals.css, so it's invisible & static when motion is reduced.
 */
const PARTICLES = [
  { left: 8, bottom: 12, size: 6, opacity: 0.35, dur: 19, delay: 0, sway: 26, rise: 180 },
  { left: 18, bottom: 4, size: 4, opacity: 0.25, dur: 24, delay: 3, sway: -18, rise: 220 },
  { left: 27, bottom: 20, size: 5, opacity: 0.4, dur: 17, delay: 6, sway: 30, rise: 150 },
  { left: 38, bottom: 8, size: 3, opacity: 0.3, dur: 26, delay: 1, sway: -24, rise: 240 },
  { left: 47, bottom: 16, size: 7, opacity: 0.28, dur: 21, delay: 8, sway: 16, rise: 200 },
  { left: 56, bottom: 6, size: 4, opacity: 0.38, dur: 18, delay: 4, sway: -30, rise: 170 },
  { left: 64, bottom: 22, size: 5, opacity: 0.22, dur: 23, delay: 10, sway: 22, rise: 210 },
  { left: 73, bottom: 10, size: 6, opacity: 0.34, dur: 20, delay: 2, sway: -16, rise: 190 },
  { left: 81, bottom: 18, size: 3, opacity: 0.3, dur: 25, delay: 7, sway: 28, rise: 230 },
  { left: 89, bottom: 5, size: 5, opacity: 0.26, dur: 16, delay: 5, sway: -22, rise: 160 },
  { left: 13, bottom: 26, size: 4, opacity: 0.32, dur: 22, delay: 9, sway: 18, rise: 200 },
  { left: 94, bottom: 24, size: 4, opacity: 0.24, dur: 19, delay: 11, sway: -28, rise: 210 },
];

export function FloatingParticles({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden ${className ?? ""}`}
    >
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="particle bg-accent/70"
          style={
            {
              left: `${p.left}%`,
              bottom: `${p.bottom}%`,
              width: p.size,
              height: p.size,
              "--p-dur": `${p.dur}s`,
              "--p-delay": `${p.delay}s`,
              "--p-opacity": p.opacity,
              "--p-sway": `${p.sway}px`,
              "--p-rise": `${p.rise}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
