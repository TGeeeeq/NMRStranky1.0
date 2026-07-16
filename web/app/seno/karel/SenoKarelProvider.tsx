"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { motion, useReducedMotion } from "motion/react";
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

/** Kolik px Karla zůstane vidět, když uraženě vykukuje zpoza okraje. */
const PEEK_X = 72;
const OFFSCREEN_X = 320;

export function SenoKarelProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;

  const [phase, setPhase] = useState<Phase>("hidden");
  const [pose, setPose] = useState<KarelPose>("idle");
  const [bubble, setBubble] = useState<ReactNode>(null);
  const [swapped, setSwapped] = useState<ReadonlySet<SenoBlockId>>(new Set());
  const [restored, setRestored] = useState(false);
  const [pos, setPos] = useState({ x: OFFSCREEN_X, dur: 0 });

  const blockRefs = useRef(new Map<SenoBlockId, RefObject<HTMLDivElement | null>>());
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

  // --- choreografie ---------------------------------------------------------

  const finishTakeover = useCallback(() => {
    runSeq.current += 1;
    setSwapped(new Set(BLOCK_ORDER));
    setRestored(false);
    setPhase("karel");
    setPose("graze");
    setPos({ x: 0, dur: 0.4 });
    saveKarelStore({ choice: "accepted" });
    showBubble(KAREL_FINALE, 9000);
  }, [showBubble]);

  const runTakeover = useCallback(
    async (fast: boolean) => {
      const run = ++runSeq.current;
      setPhase("transforming");
      setBubble(null);

      for (let i = 0; i < BLOCK_ORDER.length; i++) {
        if (runSeq.current !== run) return;
        const id = BLOCK_ORDER[i];

        blockRefs.current
          .get(id)
          ?.current?.scrollIntoView({ behavior: reduced || fast ? "auto" : "smooth", block: "center" });

        if (!fast && !reduced) {
          // popojde, zakousne se, blok zmizí
          setPose("walking");
          setPos({ x: i % 2 ? -96 : -8, dur: 0.6 });
          await wait(650);
          if (runSeq.current !== run) return;
          setPose("chomp");
          setBubble(null);
          await wait(900);
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
          await wait(1500);
        } else {
          await wait(fast && !reduced ? 250 : 120);
        }
        if (runSeq.current !== run) return;
      }

      finishTakeover();
    },
    [finishTakeover, reduced, showBubble],
  );

  const accept = useCallback(async () => {
    setBubble(null);
    await wait(250);
    void runTakeover(false);
  }, [runTakeover]);

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
    setPos({ x: OFFSCREEN_X, dur: reduced ? 0 : 1.3 });
    await wait(reduced ? 100 : 1350);
    if (runSeq.current !== run) return;
    setPose("idle");
    setPhase("peek");
    setPos({ x: PEEK_X, dur: reduced ? 0 : 0.8 });
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
    setPos({ x: 0, dur: reduced ? 0 : 0.6 });
    showBubble(askBubble(KAREL_PEEK_ASK));
  }, [askBubble, reduced, showBubble]);

  const begin = useCallback(async () => {
    const stored = loadKarelStore();

    if (stored.choice === "declined") {
      setPhase("peek");
      setPos({ x: PEEK_X, dur: reduced ? 0 : 0.8 });
      return;
    }

    const run = ++runSeq.current;
    setPhase("entering");
    setPose("walking");
    setPos({ x: 0, dur: reduced ? 0 : 1.6 });
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

      {/* Karlova scéna — pevná vrstva u spodního okraje */}
      {phase !== "hidden" && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[90]">
          <div className="flex justify-end px-3 pb-1 sm:px-6 sm:pb-2">
            <motion.div
              initial={{ x: OFFSCREEN_X }}
              animate={{ x: pos.x }}
              transition={{ duration: pos.dur, ease: "easeInOut" }}
              className="pointer-events-auto"
            >
              <KarelActor
                pose={pose}
                flip
                size="h-20 sm:h-28"
                bubble={bubble}
                onKarelClick={onKarelClick}
                karelLabel={
                  phase === "peek" ? "Karel se uraženě schovává — klikni a udobři ho" : "Osel Karel"
                }
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* Přeskočení proměny */}
      {phase === "transforming" && (
        <button
          type="button"
          onClick={finishTakeover}
          className="fixed bottom-4 left-4 z-[90] rounded-pill border border-border bg-surface/95 px-4 py-2 text-sm font-medium text-text shadow-lift backdrop-blur transition-colors hover:bg-surface-alt"
        >
          Přeskočit ⏭
        </button>
      )}

      {/* Přepínač verzí po proměně */}
      {phase === "karel" && (
        <button
          type="button"
          onClick={toggleRestore}
          className="fixed bottom-4 left-4 z-[90] rounded-pill border border-border bg-surface/95 px-4 py-2 text-sm font-medium text-text shadow-lift backdrop-blur transition-colors hover:bg-surface-alt"
        >
          {restored ? "Zpět na Karlovu verzi" : "Vrátit původní verzi"}
        </button>
      )}
    </SenoKarelContext.Provider>
  );
}
