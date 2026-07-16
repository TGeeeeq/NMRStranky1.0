"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { KarelActor, type KarelPose } from "@/components/karel/KarelActor";
import { loadKarelStore, saveKarelStore, pickQuote } from "./karel-store";
import {
  BLOCK_ORDER,
  KAREL_ASK,
  KAREL_BLOCKS,
  KAREL_COMMENTARY,
  KAREL_DECLINE,
  KAREL_FINALE,
  KAREL_IDLE,
  KAREL_PEEK_ASK,
  KAREL_REACTIONS,
  KAREL_RESTORE,
  KAREL_RETURN,
  KAREL_UNRESTORE,
  type SenoBlockId,
} from "./seno-karel-content";

/** Fáze Karlova vystoupení na /seno. */
type Phase =
  | "hidden" // před příchodem
  | "entering" // přichází zprava
  | "asking" // nabízí překopání
  | "transforming" // žere stránku blok po bloku
  | "karel" // hotovo — Karlova verze, reakce a hlášky
  | "leaving" // uraženě odchází
  | "peek"; // vykukuje zpoza okraje

type Ctx = {
  isSwapped: (id: SenoBlockId) => boolean;
  registerBlock: (id: SenoBlockId, ref: RefObject<HTMLDivElement | null>) => () => void;
  karelVariant: (id: SenoBlockId) => ReactNode;
};

const SenoKarelContext = createContext<Ctx | null>(null);

export function useSenoKarel(): Ctx {
  const ctx = useContext(SenoKarelContext);
  if (!ctx) throw new Error("useSenoKarel must be used within SenoKarelProvider");
  return ctx;
}

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), Math.max(min, max));

/** Kolik px Karla zůstane vidět, když uraženě vykukuje zpoza okraje. */
const PEEK_X = 72;
const OFFSCREEN_X = 320;

/** Hýknutí při schválení překopání — kopie zvuku z Louka Run. */
const BRAY_SRC = "/assets/karel-hykani.mp3";

/** Kam si Karel u bloku stoupne (zlomky šířky/výšky bloku) — střídá se,
 *  aby putoval po celé ploše, ne jen po spodní hraně. */
const ROAM_SPOTS = [
  { x: 0.12, y: 0.2 },
  { x: 0.88, y: 0.55 },
  { x: 0.2, y: 0.9 },
  { x: 0.82, y: 0.15 },
  { x: 0.5, y: 0.5 },
  { x: 0.1, y: 0.6 },
  { x: 0.9, y: 0.9 },
];

/** Řečová bublina ukotvená ke Karlovi, ale klampovaná do viewportu, aby byla
 *  vždy celá vidět i na malém displeji. Podle Karlovy polohy se překlopí
 *  doleva/doprava a nad/pod něj; šipka míří na jeho střed. */
function SceneBubble({
  anchorRef,
  children,
}: {
  anchorRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  const [layout, setLayout] = useState<{
    box: CSSProperties;
    arrow: CSSProperties;
    below: boolean;
  } | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 10;
      const gap = 8;
      const cx = r.left + r.width / 2;

      const alignLeft = cx < vw / 2;
      const horiz: CSSProperties = alignLeft
        ? { left: clamp(r.left - 4, margin, vw - margin) }
        : { right: clamp(vw - r.right - 4, margin, vw - margin) };
      const anchorEdge = alignLeft ? (horiz.left as number) : (horiz.right as number);
      const maxWidth = Math.min(352, vw - anchorEdge - margin);

      // Málo místa nad hlavou → bublina pod Karlem.
      const below = r.top < 180;
      const vert: CSSProperties = below ? { top: r.bottom + gap } : { bottom: vh - r.top + gap };

      const arrowOffset = clamp(alignLeft ? cx - anchorEdge - 7 : vw - anchorEdge - cx - 7, 14, 120);
      const arrow: CSSProperties = alignLeft ? { left: arrowOffset } : { right: arrowOffset };

      setLayout({ box: { ...horiz, ...vert, maxWidth }, arrow, below });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [anchorRef, children]);

  if (!layout) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: layout.below ? -8 : 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: layout.below ? -6 : 6, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={layout.box}
      className="pointer-events-auto absolute min-w-40 rounded-lg border border-border bg-cream px-4 py-3 shadow-lift"
    >
      <span
        aria-hidden
        style={layout.arrow}
        className={`absolute h-3.5 w-3.5 rotate-45 bg-cream ${
          layout.below
            ? "-top-[7px] border-l border-t border-border"
            : "-bottom-[7px] border-b border-r border-border"
        }`}
      />
      <div className="text-sm font-medium leading-snug text-moss-deep">{children}</div>
    </motion.div>
  );
}

export function SenoKarelProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;

  const [phase, setPhase] = useState<Phase>("hidden");
  const [pose, setPose] = useState<KarelPose>("idle");
  const [facing, setFacing] = useState<"left" | "right">("left");
  const [bubble, setBubble] = useState<ReactNode>(null);
  const [swapped, setSwapped] = useState<ReadonlySet<SenoBlockId>>(new Set());
  const [restored, setRestored] = useState(false);
  const [pos, setPos] = useState({ x: OFFSCREEN_X, y: 0, dur: 0 });

  const blockRefs = useRef(new Map<SenoBlockId, RefObject<HTMLDivElement | null>>());
  const karelBoxRef = useRef<HTMLDivElement | null>(null);
  const brayRef = useRef<HTMLAudioElement | null>(null);
  const runSeq = useRef(0); // zneplatnění běžící choreografie (skip, unmount)
  const bubbleTimer = useRef<number | null>(null);
  const lastQuote = useRef<string | null>(null);
  const lastReactionAt = useRef(0);
  const started = useRef(false);

  // refs pro listenery, ať nemusí re-subscribovat při každé změně stavu
  const phaseRef = useRef(phase);
  const bubbleRef = useRef(bubble);
  const restoredRef = useRef(restored);
  useEffect(() => {
    phaseRef.current = phase;
    bubbleRef.current = bubble;
    restoredRef.current = restored;
  });

  const registerBlock = useCallback(
    (id: SenoBlockId, ref: RefObject<HTMLDivElement | null>) => {
      blockRefs.current.set(id, ref);
      return () => {
        blockRefs.current.delete(id);
      };
    },
    [],
  );

  const isSwapped = useCallback(
    (id: SenoBlockId) => !restored && swapped.has(id),
    [restored, swapped],
  );

  const karelVariant = useCallback((id: SenoBlockId) => KAREL_BLOCKS[id](), []);

  const showBubble = useCallback((content: ReactNode, hideAfterMs?: number) => {
    if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current);
    setBubble(content);
    if (hideAfterMs) {
      bubbleTimer.current = window.setTimeout(() => setBubble(null), hideAfterMs);
    }
  }, []);

  const sayQuote = useCallback(
    (pool: string[], hideAfterMs = 6500) => {
      const quote = pickQuote(pool, lastQuote.current);
      lastQuote.current = quote;
      showBubble(quote, hideAfterMs);
    },
    [showBubble],
  );

  // --- pohyb po ploše --------------------------------------------------------

  /** Dojde na zadané místo ve viewportu (souřadnice levého horního rohu
   *  Karlova boxu), otočí se po směru chůze a vrátí délku přesunu v ms. */
  const moveTo = useCallback((left: number, top: number) => {
    const el = karelBoxRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const dx = left - r.left;
    const dy = top - r.top;
    if (Math.abs(dx) > 12) setFacing(dx > 0 ? "right" : "left");
    const dur = clamp(Math.hypot(dx, dy) / 420, 0.45, 1.3);
    setPos((p) => ({ x: p.x + dx, y: p.y + dy, dur }));
    return dur * 1000;
  }, []);

  /** Návrat na domovské místo (vpravo dole). */
  const moveHome = useCallback((dur: number) => {
    setFacing("left");
    setPos({ x: 0, y: 0, dur });
  }, []);

  // --- choreografie ---------------------------------------------------------

  const finishTakeover = useCallback(() => {
    runSeq.current += 1;
    setSwapped(new Set(BLOCK_ORDER));
    setRestored(false);
    setPhase("karel");
    setPose("graze");
    moveHome(0.4);
    saveKarelStore({ choice: "accepted" });
    showBubble(KAREL_FINALE, 9000);
  }, [moveHome, showBubble]);

  const runTakeover = useCallback(
    async (fast: boolean) => {
      const run = ++runSeq.current;
      setPhase("transforming");
      setBubble(null);

      for (let i = 0; i < BLOCK_ORDER.length; i++) {
        if (runSeq.current !== run) return;
        const id = BLOCK_ORDER[i];
        const blockEl = blockRefs.current.get(id)?.current;

        blockEl?.scrollIntoView({
          behavior: reduced || fast ? "auto" : "smooth",
          block: "center",
        });

        if (!fast && !reduced) {
          // dojde k bloku (putuje po celé ploše), zakousne se, blok zmizí
          setBubble(null);
          setPose("walking");
          await wait(550); // doscrollování bloku do středu
          if (runSeq.current !== run) return;

          let travel = 500;
          const rect = blockEl?.getBoundingClientRect();
          const box = karelBoxRef.current?.getBoundingClientRect();
          if (rect && box) {
            const spot = ROAM_SPOTS[i % ROAM_SPOTS.length];
            const left = clamp(
              rect.left + rect.width * spot.x - box.width / 2,
              8,
              window.innerWidth - box.width - 8,
            );
            const top = clamp(
              rect.top + rect.height * spot.y - box.height,
              72,
              window.innerHeight - box.height - 8,
            );
            travel = moveTo(left, top);
          }
          await wait(travel + 100);
          if (runSeq.current !== run) return;
          setPose("chomp");
          await wait(850);
          if (runSeq.current !== run) return;
        }

        setSwapped((prev) => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });

        if (!fast && !reduced) {
          setPose("idle");
          const commentary = KAREL_COMMENTARY[id];
          if (commentary) showBubble(commentary);
          await wait(commentary ? 1400 : 500);
        } else {
          await wait(fast && !reduced ? 250 : 120);
        }
        if (runSeq.current !== run) return;
      }

      if (!fast && !reduced) {
        // spokojený návrat domů
        setBubble(null);
        setPose("walking");
        moveHome(0.9);
        await wait(950);
        if (runSeq.current !== run) return;
      }

      finishTakeover();
    },
    [finishTakeover, moveHome, moveTo, reduced, showBubble],
  );

  const bray = useCallback(() => {
    try {
      const audio = brayRef.current ?? new Audio(BRAY_SRC);
      brayRef.current = audio;
      audio.volume = 0.45;
      audio.currentTime = 0;
      void audio.play().catch(() => {});
    } catch {
      // bez zvuku se obejdeme
    }
  }, []);

  const accept = useCallback(async () => {
    bray();
    setBubble(null);
    await wait(250);
    void runTakeover(false);
  }, [bray, runTakeover]);

  const decline = useCallback(async () => {
    const run = ++runSeq.current;
    saveKarelStore({ choice: "declined" });
    setPose("shake-no");
    showBubble(KAREL_DECLINE);
    await wait(2400);
    if (runSeq.current !== run) return;
    setBubble(null);
    setPose("walking");
    setPhase("leaving");
    setFacing("left");
    setPos({ x: OFFSCREEN_X, y: 0, dur: reduced ? 0 : 1.3 });
    await wait(reduced ? 100 : 1350);
    if (runSeq.current !== run) return;
    setPose("idle");
    setPhase("peek");
    setPos({ x: PEEK_X, y: 0, dur: reduced ? 0 : 0.8 });
  }, [reduced, showBubble]);

  const askBubble = useCallback(
    (text: string) => (
      <div>
        <p>{text}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={accept}
            className="rounded-pill bg-moss px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-moss-deep"
          >
            {KAREL_ASK.yes}
          </button>
          <button
            type="button"
            onClick={decline}
            className="rounded-pill border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-alt"
          >
            {KAREL_ASK.no}
          </button>
        </div>
      </div>
    ),
    [accept, decline],
  );

  const reAsk = useCallback(() => {
    setPhase("asking");
    setPose("idle");
    setFacing("left");
    setPos({ x: 0, y: 0, dur: reduced ? 0 : 0.6 });
    showBubble(askBubble(KAREL_PEEK_ASK));
  }, [askBubble, reduced, showBubble]);

  const begin = useCallback(async () => {
    const stored = loadKarelStore();

    if (stored.choice === "declined") {
      setPhase("peek");
      setPos({ x: PEEK_X, y: 0, dur: reduced ? 0 : 0.8 });
      return;
    }

    const run = ++runSeq.current;
    setPhase("entering");
    setPose("walking");
    setPos({ x: 0, y: 0, dur: reduced ? 0 : 1.6 });
    await wait(reduced ? 100 : 1650);
    if (runSeq.current !== run) return;
    setPose("idle");

    if (stored.choice === "accepted") {
      showBubble(KAREL_RETURN);
      await wait(1800);
      if (runSeq.current !== run) return;
      void runTakeover(true);
    } else {
      setPhase("asking");
      showBubble(askBubble(KAREL_ASK.text));
    }
  }, [askBubble, reduced, runTakeover, showBubble]);

  const beginRef = useRef(begin);
  useEffect(() => {
    beginRef.current = begin;
  }, [begin]);

  // Vstup na scénu — až po rozhodnutí o cookies (ať se Karel nepere s lištou)
  // a s malou prodlevou, ať si návštěvník stihne stránku prohlédnout.
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let disposed = false;
    let timer: number | undefined;
    const start = () => {
      if (!disposed) void beginRef.current();
    };

    if (document.cookie.includes("cookieConsent=")) {
      timer = window.setTimeout(start, 1800);
    } else {
      const onConsent = () => {
        window.removeEventListener("nmr:consent-changed", onConsent);
        timer = window.setTimeout(start, 1200);
      };
      window.addEventListener("nmr:consent-changed", onConsent);
      return () => {
        disposed = true;
        window.removeEventListener("nmr:consent-changed", onConsent);
        if (timer) window.clearTimeout(timer);
      };
    }
    return () => {
      disposed = true;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  // Reakce na kliknutí na označené prvky (QR, účet, sdílení…)
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement | null)?.closest?.("[data-karel-react]");
      if (!target) return;
      const p = phaseRef.current;
      if (p !== "karel" && p !== "asking") return;
      const now = Date.now();
      if (now - lastReactionAt.current < 8000) return;
      const pool = KAREL_REACTIONS[target.getAttribute("data-karel-react") ?? ""];
      if (!pool) return;
      lastReactionAt.current = now;
      const quote = pickQuote(pool, lastQuote.current);
      lastQuote.current = quote;
      showBubble(quote, 6000);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [showBubble]);

  // Občasná hláška, když se nic neděje
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (phaseRef.current !== "karel" || bubbleRef.current != null) return;
      const quote = pickQuote(KAREL_IDLE, lastQuote.current);
      lastQuote.current = quote;
      showBubble(quote, 6500);
    }, 45000);
    return () => window.clearInterval(timer);
  }, [showBubble]);

  // Úklid při odchodu ze stránky
  useEffect(
    () => () => {
      runSeq.current += 1;
      if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current);
    },
    [],
  );

  const toggleRestore = useCallback(() => {
    const wasRestored = restoredRef.current;
    setRestored(!wasRestored);
    showBubble(wasRestored ? KAREL_UNRESTORE : KAREL_RESTORE, 6000);
  }, [showBubble]);

  const quip = useCallback(() => sayQuote(KAREL_IDLE), [sayQuote]);

  const onKarelClick =
    phase === "peek" ? reAsk : phase === "karel" || phase === "asking" ? quip : undefined;

  return (
    <SenoKarelContext.Provider value={{ isSwapped, registerBlock, karelVariant }}>
      {children}

      {/* Karlova scéna — pevná vrstva přes celý viewport, Karel putuje po ploše */}
      {phase !== "hidden" && (
        <div className="pointer-events-none fixed inset-0 z-[90]">
          <motion.div
            ref={karelBoxRef}
            initial={{ x: OFFSCREEN_X, y: 0 }}
            animate={{ x: pos.x, y: pos.y }}
            transition={{ duration: pos.dur, ease: "easeInOut" }}
            className="pointer-events-auto absolute bottom-1 right-3 sm:bottom-2 sm:right-6"
          >
            <KarelActor
              pose={pose}
              flip={facing === "left"}
              size="h-20 sm:h-28"
              onKarelClick={onKarelClick}
              karelLabel={
                phase === "peek" ? "Karel se uraženě schovává — klikni a udobři ho" : "Osel Karel"
              }
            />
          </motion.div>
          <AnimatePresence>
            {bubble != null && <SceneBubble anchorRef={karelBoxRef}>{bubble}</SceneBubble>}
          </AnimatePresence>
        </div>
      )}

      {/* Přeskočení proměny */}
      {phase === "transforming" && (
        <button
          type="button"
          onClick={finishTakeover}
          className="fixed bottom-4 left-4 z-[95] rounded-pill border border-border bg-surface/95 px-4 py-2 text-sm font-medium text-text shadow-lift backdrop-blur transition-colors hover:bg-surface-alt"
        >
          Přeskočit ⏭
        </button>
      )}

      {/* Přepínač verzí po proměně */}
      {phase === "karel" && (
        <button
          type="button"
          onClick={toggleRestore}
          className="fixed bottom-4 left-4 z-[95] rounded-pill border border-border bg-surface/95 px-4 py-2 text-sm font-medium text-text shadow-lift backdrop-blur transition-colors hover:bg-surface-alt"
        >
          {restored ? "Zpět na Karlovu verzi" : "Vrátit původní verzi"}
        </button>
      )}
    </SenoKarelContext.Provider>
  );
}
