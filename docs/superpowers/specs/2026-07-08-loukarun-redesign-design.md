# Louka Run page redesign — design spec

Date: 2026-07-08
Status: approved by user (text-only brainstorm)

## Goal

Rebuild the visual layer of `web/app/loukarun/page.tsx` into an animated, professional page that feels like a slice of the game, with "digital Karel" guiding the visitor through sections using **newly written quotes** in the game's voice (lightly referencing the game, never copying its lines verbatim). Content structure, gate logic, server actions, and metadata stay unchanged.

## Decisions (from brainstorm)

1. **Scope**: complete visual redesign; content sections kept (hero, gate, characters, worlds, Google Play teaser, social).
2. **Karel's role**: page guide — appears at each section with a section-specific quote; clicking him shows a random quote + a small animation (ear hop). 2–3 quote variants per section, randomized.
3. **Quotes**: original, newly written in Karel's game persona (biting humor, carrot obsession, "I run this place"), referencing the game only obliquely. Stored in `web/app/loukarun/karel.ts`. Approved tone samples:
   - Hero: „Vítej na mojí louce. Teda… na jejím webu. Trávu si laskavě představ."
   - Gate: „Bez kódu dál nemůžeš. Já pravidla nevymyslel. Teda vymyslel, ale dobrý, ne?"
   - Characters: „Tohle jsou moji kamarádi. Vybírej pečlivě — stejně je ale nejlepší ten černej vlevo nahoře."
   - Worlds: „Šest světů a všechny moje. Jen ta hvězdná noc mě trochu děsí, ale to nikomu neříkej."
   - Google Play: „Prý budu i v mobilu. Doufám, že tam budou dobíjet mrkve."
   - Random click pool: „Hýkám, tedy jsem… počkat, to už jsem někde říkal?", „Tenhle web řídím já. Programátor si jen myslí, že ne.", „Scrolluješ hezky. Máš talent. Na mrkev to ale nestačí."
4. **Animation intensity**: lively game scene — parallax hills on scroll, drifting clouds, flying stork/swallow, a small running animal sprite loop, bobbing carrots. Respect `prefers-reduced-motion` (app-wide `MotionConfig` already drops transforms).
5. **Animal visuals**: flip cards — front = vector "game sprite" (SVG drawn from the game's `colors` in `public/loukarun/app/js/data.js`, run-cycle on hover) + game `tagline`; flip reveals the real photo + perk. Reinforces "všichni jsou skuteční".

## Components (all under `web/app/loukarun/`)

- `karel.ts` — quote data: `{ hero, gate, characters, worlds, play }` arrays + `random` pool. Czech only.
- `KarelSvg.tsx` — the donkey SVG (body `#45403c`, muzzle `#efe7da`, mane `#211d1a`, eye rings `#c6bab0`, inner ear `#b5a89a`, hooves `#26221e`), poses via props; CSS keyframes for blink / ear twitch / tail swish.
- `KarelGuide.tsx` (client) — Karel + speech bubble; enters on section intersection (motion `whileInView`), section prop picks the quote pool; click → random quote + ear-hop animation.
- `HeroScene.tsx` (client) — layered SVG scene: sky gradient, sun with rays, drifting clouds, flyers, three hill layers with `useScroll` parallax, running sprite loop, bobbing carrots; staggered title entrance.
- `CharacterCard.tsx` (client) — flip card (sprite front / photo back), keyboard accessible (button, flips on click/Enter), run-cycle on hover.
- `RunnerSprite.tsx` — small SVG run-cycle sprites per species reusing the game palette.
- `WorldScene.tsx` — six mini-scene cards, each with its own sky gradient + silhouette (meadow, orchard, fairy forest, village, golden hour, starry night), revealed on scroll.
- Gate section restyled as a wooden-sign / game-UI card (Karel's bubble jokes about signs); `GateForm`, bank details, mail flow unchanged.
- Google Play teaser: phone mockup with a game-scene inlay + Karel quote.

## Constraints

- No new dependencies — `motion@12` + CSS keyframes only.
- Page stays a Server Component; only the animated pieces are client components.
- No changes to `actions.ts`, `GateForm`, game access logic, or metadata/canonical. Sitemap already lists the route.
- Czech copy, design tokens from `globals.css` where applicable (moss/cream/terracotta), game palette allowed inside scene SVGs.
- Performance: CSS transforms/opacity only for loops; no canvas, no JS rAF loops.

## Testing

- `npm run lint`, `npx tsc --noEmit`, `npm run build` must pass.
- Manual: verify reduced-motion behavior, mobile layout, gate flow unchanged (cookie/`pristup=kod` param), Karel click quotes cycle.
