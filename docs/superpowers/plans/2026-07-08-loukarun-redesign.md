# Louka Run Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/loukarun` as an animated, game-flavored landing page with digital Karel guiding each section using original quotes in the game's voice.

**Architecture:** The page stays a Server Component; all motion lives in small client components under `web/app/loukarun/`. Animations are `motion@12` (already installed) for scroll/entrance work plus CSS keyframes (in a route-local `loukarun.css`) for infinite loops. Gate logic, server actions, and metadata are untouched.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, motion/react, hand-drawn SVG (game palette from `public/loukarun/app/js/data.js`).

**Spec:** `docs/superpowers/specs/2026-07-08-loukarun-redesign-design.md`

**Palette (from game `data.js`):** Karel body `#45403c`, belly `#93887f`, mane `#211d1a`, muzzle `#efe7da`, inner ear `#b5a89a`, eye ring `#c6bab0`, hooves `#26221e`; carrot `#e8833a` + greens `#4a7c4e`; sky `#8ed4f7→#c8ecfb`; hills `#6b8e6e / #4a7c4e / #2d5a3d`.

---

### Task 1: Karel quote data

**Files:** Create `web/app/loukarun/karel.ts`

- [ ] Write `karel.ts` exporting `KAREL_QUOTES: Record<Section, string[]>` with sections `hero | gate | characters | worlds | play` (2–3 original quotes each, approved tone) and `KAREL_RANDOM: string[]` (≥8 quotes for the click pool). All Czech, no lines copied from the game. Include the six approved samples from the spec verbatim.
- [ ] Commit: `feat(loukarun): Karlovy hlášky pro web`

### Task 2: Karel SVG + guide component

**Files:** Create `web/app/loukarun/KarelSvg.tsx`, `web/app/loukarun/KarelGuide.tsx`, `web/app/loukarun/loukarun.css`

- [ ] `KarelSvg.tsx` (server-safe, pure SVG): donkey bust/full body in game palette — big ears (animatable groups with `class="karel-ear-l/r"`), eye rings, white muzzle, mane, tail. Props: `pose?: "side" | "peek"`, `className`.
- [ ] `loukarun.css`: keyframes `karel-blink` (eyelid scaleY, every ~4s), `karel-ear` (subtle rotate, alternating), `karel-tail`, `karel-hop` (triggered class), `cloud-drift`, `carrot-bob`, `flyer-glide`, `run-cycle` (leg swing), all wrapped so `@media (prefers-reduced-motion: reduce)` disables them. Import from `page.tsx`.
- [ ] `KarelGuide.tsx` (`"use client"`): renders Karel + speech bubble (rounded, cream bg, small tail pointing at Karel). Props: `section: Section`, `align?: "left" | "right"`. Behavior: `motion` `whileInView` slide-in; initial quote picked deterministically for SSR (first of pool) then randomized on mount is NOT needed — pick per-render on client only via `useState(() => pick)` in a client component is fine (no SSR mismatch because component renders same initial? No —) use `useState` initialized to index 0 and shuffle on first click instead, avoiding hydration mismatch. Click on Karel: next random quote from `KAREL_RANDOM`, add `karel-hop` class for 600 ms, `aria-live="polite"` on bubble text.
- [ ] Verify: `npx tsc --noEmit` passes.
- [ ] Commit: `feat(loukarun): digitální Karel s bublinou`

### Task 3: Hero scene

**Files:** Create `web/app/loukarun/HeroScene.tsx`; modify `web/app/loukarun/page.tsx` (replace `MeadowHero`)

- [ ] `HeroScene.tsx` (`"use client"`): full-bleed section — sky gradient, sun with slow-rotating rays, 3 drifting cloud groups (`cloud-drift`, different durations/directions), stork + swallow gliding across (`flyer-glide`), three hill layers parallaxed with `useScroll`+`useTransform` (deeper = slower), bobbing carrots on the hills, and a small running Karel sprite loop along the front hill. Title "Louka Run" letters stagger in (`motion` variants), keep carrot glyph, CTA buttons (`▶ Hrát` when `hasAccess`, else `▶ Chci hrát` → `#hrat`; `Poznej běžce` → `#zvirata`). Prop: `hasAccess: boolean`. KarelGuide `section="hero"` anchored bottom-left of hero.
- [ ] Replace `MeadowHero` usage in `page.tsx`; delete the old inline component.
- [ ] Verify: `npm run dev` renders hero, parallax works, reduced-motion leaves static scene.
- [ ] Commit: `feat(loukarun): živá hero scéna s parallaxem`

### Task 4: Runner sprites + character flip cards

**Files:** Create `web/app/loukarun/RunnerSprite.tsx`, `web/app/loukarun/CharacterCard.tsx`; modify `web/app/loukarun/page.tsx`

- [ ] `RunnerSprite.tsx`: SVG side-view runner per species (`osel`, `ovce`, `kráva`, `prase`, `muflon`) built from shared body parts, colored via a `colors` prop mirroring the game's `colors` objects (copy the six characters' palettes from `data.js` into a local const). Legs in `.run-legs` group animated by `run-cycle` only when parent has `.is-running`.
- [ ] `CharacterCard.tsx` (`"use client"`): accessible flip card — `<button>` with `aria-pressed`, 3D flip (`transform-style: preserve-3d`, `rotateY`), front = sprite on pale meadow gradient + name + game tagline, hover/focus adds `.is-running`; back = real photo (`next/image`, existing `/assets/*.webp`) + perk text. Props: `{ id, name, image, tagline, perk, colors }`.
- [ ] In `page.tsx`: extend the `characters` array with `tagline` + `colors` (from game data, Czech only), render grid of `CharacterCard` inside `Reveal`s, add `KarelGuide section="characters"` above the grid. Keep link to `/zvireci-obyvatele`.
- [ ] Verify in browser: flip via mouse + keyboard, run-cycle on hover.
- [ ] Commit: `feat(loukarun): flip karty běžců se sprity ze hry`

### Task 5: Worlds mini-scenes

**Files:** Create `web/app/loukarun/WorldScene.tsx`; modify `web/app/loukarun/page.tsx`

- [ ] `WorldScene.tsx` (server-safe): six cards, each an SVG mini-scene with its own sky gradient + silhouette: Rozkvetlá louka (day sky, flowers), Ovocný sad (trees with fruit dots), Pohádkový les (teal dusk, tall trees, fireflies), Veselá vesnice (rooftops), Zlatá hodinka (orange sky, long shadows), Hvězdná noc (indigo, stars + moon). Titles under each scene.
- [ ] Replace the pill list in the moss-deep section with the grid (staggered `Reveal`s), keep the "žádná prohra" copy, add `KarelGuide section="worlds"` (align right).
- [ ] Commit: `feat(loukarun): šest světů jako mini-scény`

### Task 6: Gate restyle + Google Play mockup

**Files:** Modify `web/app/loukarun/page.tsx`

- [ ] Gate section: wrap the how-to card as a wooden sign (rounded rect, wood-brown fills `#8a6a4f/#6f5540`, two "posts", slightly rotated nailed look via CSS; content unchanged: steps, `BANK.account`, mailto, `GateForm`). `KarelGuide section="gate"` beside it. `hasAccess` branch keeps play button, gains a happy Karel line.
- [ ] Google Play section: CSS phone mockup (rounded frame, notch) containing a static mini game scene (reuse `WorldScene`-style SVG + running sprite), copy unchanged, `KarelGuide section="play"`.
- [ ] Commit: `feat(loukarun): brána jako cedule + mockup telefonu`

### Task 7: Verification & ship

- [ ] `npm run lint` → clean; `npx tsc --noEmit` → clean; `npm test` → passes (no existing tests touch this page).
- [ ] `npm run build` (with `.env.local`) → succeeds.
- [ ] Manual pass (webapp-testing/screenshot): hero animates, Karel quotes cycle on click, reduced-motion static, mobile 375px layout sane, gate flow (`?pristup=kod`) unchanged.
- [ ] Push to `main` (production).
