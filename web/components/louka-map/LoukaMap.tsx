"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { ExternalLink, Minus, Plus, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";
import {
  IMG,
  starts,
  routes,
  pois,
  loukaDetail,
  type RouteId,
  type PoiId,
  type XY,
} from "./overview-data";

const MIN_SCALE = 1;
const MAX_SCALE = 4.5;

/** Catmull-Rom → plynulá bezierová křivka (hezčí než lomená čára). */
function smoothPath(points: XY[]): string {
  if (points.length === 0) return "";
  if (points.length < 3) {
    return (
      `M ${points[0][0]},${points[0][1]} ` +
      points
        .slice(1)
        .map((p) => `L ${p[0]},${p[1]}`)
        .join(" ")
    );
  }
  const d: string[] = [`M ${points[0][0]},${points[0][1]}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(`C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`);
  }
  return d.join(" ");
}

function walkingTimeMinutes(km: number): number {
  return Math.max(5, Math.round((km / 4.5) * 60 / 5) * 5);
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

type Transform = { scale: number; tx: number; ty: number };

export function LoukaMap({ compact = false }: { compact?: boolean }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState<Transform>({ scale: 1, tx: 0, ty: 0 });
  const [routeId, setRouteId] = useState<RouteId | null>(null);
  const [activePoi, setActivePoi] = useState<PoiId | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const activeRoute = routes.find((r) => r.id === routeId) ?? null;
  const poiInfo = pois.find((p) => p.id === activePoi) ?? null;

  // --- Zoom / pan ------------------------------------------------------------

  /** Omezí posun tak, aby obrázek vždy vyplňoval výřez. */
  const clampTransform = useCallback((next: Transform): Transform => {
    const el = viewportRef.current;
    if (!el) return next;
    const w = el.clientWidth;
    const h = el.clientHeight;
    const scale = clamp(next.scale, MIN_SCALE, MAX_SCALE);
    const tx = clamp(next.tx, w * (1 - scale), 0);
    const ty = clamp(next.ty, h * (1 - scale), 0);
    return { scale, tx, ty };
  }, []);

  /** Zoom se středem v bodě (cx, cy) v pixelech výřezu. */
  const zoomAt = useCallback(
    (cx: number, cy: number, factor: number) => {
      setT((prev) => {
        const scale = clamp(prev.scale * factor, MIN_SCALE, MAX_SCALE);
        const k = scale / prev.scale;
        // Bod pod kurzorem zůstane na místě.
        const tx = cx - (cx - prev.tx) * k;
        const ty = cy - (cy - prev.ty) * k;
        return clampTransform({ scale, tx, ty });
      });
    },
    [clampTransform],
  );

  const reset = useCallback(() => setT({ scale: 1, tx: 0, ty: 0 }), []);

  const zoomButton = useCallback(
    (factor: number) => {
      const el = viewportRef.current;
      if (!el) return;
      zoomAt(el.clientWidth / 2, el.clientHeight / 2, factor);
    },
    [zoomAt],
  );

  // Nativní wheel listener (kvůli preventDefault musí být non-passive).
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, factor);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // Drag / pan + pinch přes pointer events.
  const drag = useRef<{
    pointers: Map<number, { x: number; y: number }>;
    start: Transform;
    startX: number;
    startY: number;
    moved: boolean;
    pinchDist: number;
  }>({
    pointers: new Map(),
    start: { scale: 1, tx: 0, ty: 0 },
    startX: 0,
    startY: 0,
    moved: false,
    pinchDist: 0,
  });

  const onPointerDown = (e: ReactPointerEvent) => {
    const d = drag.current;
    d.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    d.start = t;
    d.startX = e.clientX;
    d.startY = e.clientY;
    d.moved = false;
    if (d.pointers.size === 2) {
      const [a, b] = [...d.pointers.values()];
      d.pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d.pointers.has(e.pointerId)) return;
    d.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (d.pointers.size >= 2) {
      // Pinch zoom.
      const [a, b] = [...d.pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (d.pinchDist > 0) {
        const el = viewportRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const cx = (a.x + b.x) / 2 - rect.left;
          const cy = (a.y + b.y) / 2 - rect.top;
          zoomAt(cx, cy, dist / d.pinchDist);
        }
      }
      d.pinchDist = dist;
      d.moved = true;
      return;
    }

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) > 6) {
      d.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (d.moved) {
      setT(clampTransform({ ...d.start, tx: d.start.tx + dx, ty: d.start.ty + dy }));
    }
  };

  const endPointer = (e: ReactPointerEvent) => {
    const d = drag.current;
    d.pointers.delete(e.pointerId);
    if (d.pointers.size < 2) d.pinchDist = 0;
  };

  const onDoubleClick = (e: ReactMouseEvent) => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, 1.8);
  };

  // --- Interakce s body ------------------------------------------------------

  /** Klik na start: parkoviště/Vlkaneč vyberou trasu; Nová Ves přepíná
   *  mezi svými dvěma variantami. */
  const selectStart = (id: string) => {
    if (id === "novaves") {
      setRouteId((cur) =>
        cur === "novaves-silnice" ? "novaves-luka" : "novaves-silnice",
      );
    } else {
      setRouteId((cur) => (cur === id ? null : (id as RouteId)));
    }
    setActivePoi(null);
  };

  const clickPoi = (id: PoiId) => {
    if (id === "louka") {
      setDetailOpen(true);
      return;
    }
    setActivePoi((cur) => (cur === id ? null : id));
  };

  // Zavření modalu klávesou Esc.
  useEffect(() => {
    if (!detailOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetailOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detailOpen]);

  // Konstantní velikost markerů/čar bez ohledu na zoom.
  const k = 1 / t.scale;

  const shownRouteIds = useMemo(() => {
    if (!routeId) return [];
    return [routeId];
  }, [routeId]);

  return (
    <div>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-border bg-[#f3ecda] shadow-soft",
        )}
      >
        {/* Výřez se zoomem */}
        <div
          ref={viewportRef}
          className="relative aspect-square w-full cursor-grab touch-none select-none active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onDoubleClick={onDoubleClick}
          role="application"
          aria-label="Interaktivní kreslená mapa cesty na Louku — táhnutím posunete, kolečkem přiblížíte"
        >
          <div
            className="absolute inset-0 origin-top-left"
            style={{
              transform: `translate(${t.tx}px, ${t.ty}px) scale(${t.scale})`,
            }}
          >
            {/* Podkladová kreslená mapa */}
            <Image
              src={IMG.src}
              alt="Kreslená mapa okolí Louky u Nové Vsi u Leštiny"
              fill
              sizes="(min-width: 768px) 720px, 100vw"
              className="pointer-events-none object-cover"
              priority={!compact}
              draggable={false}
            />

            {/* Interaktivní vrstva */}
            <svg
              viewBox={`0 0 ${IMG.w} ${IMG.h}`}
              className="absolute inset-0 h-full w-full"
              style={{ pointerEvents: "none" }}
            >
              {/* Trasy */}
              {routes.map((r) => {
                const isActive = shownRouteIds.includes(r.id);
                if (routeId && !isActive) return null;
                return (
                  <g key={r.id}>
                    {/* Světlá „aura" pod trasou */}
                    <path
                      d={smoothPath(r.points)}
                      fill="none"
                      stroke="#f7f2e7"
                      strokeWidth={9 * k}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.7}
                    />
                    {/* Vlastní trasa */}
                    <path
                      d={smoothPath(r.points)}
                      fill="none"
                      stroke="#b3472a"
                      strokeWidth={4.5 * k}
                      strokeDasharray={`${13 * k} ${9 * k}`}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lm-route"
                    />
                  </g>
                );
              })}

              {/* Zajímavé body */}
              {pois.map((p) => {
                const isActive = activePoi === p.id;
                return (
                  <g
                    key={p.id}
                    transform={`translate(${p.at[0]},${p.at[1]}) scale(${k})`}
                    style={{ pointerEvents: "auto", cursor: "pointer" }}
                    onClick={() => clickPoi(p.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        clickPoi(p.id);
                      }
                    }}
                    aria-label={p.label}
                  >
                    <title>{p.label}</title>
                    {p.kind === "louka" ? (
                      <g className="lm-pulse">
                        {/* Srdce = Louka */}
                        <circle r={22} fill="#b3472a" opacity={0.18} />
                        <path
                          d="M0,7 C-2,-4 -17,-5 -17,6 C-17,15 -5,20 0,26 C5,20 17,15 17,6 C17,-5 2,-4 0,7Z"
                          fill="#b3472a"
                          stroke="#7d3a22"
                          strokeWidth={1.5}
                          transform="translate(0,-4) scale(0.9)"
                        />
                      </g>
                    ) : p.kind === "house" ? (
                      <g>
                        <circle
                          r={16}
                          fill={isActive ? "#f0e08a" : "#f7f2e7"}
                          stroke="#2a3530"
                          strokeWidth={2}
                        />
                        {/* Domeček */}
                        <path
                          d="M-8,2 L0,-7 L8,2 Z M-6,2 L-6,9 L6,9 L6,2"
                          fill="none"
                          stroke="#2a3530"
                          strokeWidth={1.8}
                          strokeLinejoin="round"
                        />
                      </g>
                    ) : (
                      // Aleje — stromeček
                      <g>
                        <circle
                          r={15}
                          fill={isActive ? "#6b8e4e" : "#f7f2e7"}
                          stroke="#4a6b34"
                          strokeWidth={2.2}
                        />
                        {/* Koruna + kmínek */}
                        <circle
                          cx={0}
                          cy={-2}
                          r={6.5}
                          fill={isActive ? "#f7f2e7" : "#6b8e4e"}
                          stroke="#4a6b34"
                          strokeWidth={1.2}
                        />
                        <rect
                          x={-1.3}
                          y={3}
                          width={2.6}
                          height={5}
                          fill={isActive ? "#f7f2e7" : "#4a6b34"}
                        />
                      </g>
                    )}
                    {/* Popisek pod bodem */}
                    <text
                      y={p.kind === "louka" ? 40 : 30}
                      textAnchor="middle"
                      fontFamily="var(--font-serif), serif"
                      fontStyle="italic"
                      fontSize={p.kind === "louka" ? 17 : 13}
                      fill={p.kind === "louka" ? "#b3472a" : "#2a3530"}
                      paintOrder="stroke"
                      stroke="#f7f2e7"
                      strokeWidth={4}
                    >
                      {p.label}
                    </text>
                  </g>
                );
              })}

              {/* Startovní body (parkoviště, vlaky) */}
              {starts.map((s) => {
                const selected =
                  activeRoute?.from === s.id ||
                  (s.id === "novaves" &&
                    (routeId === "novaves-silnice" || routeId === "novaves-luka"));
                return (
                  <g
                    key={s.id}
                    transform={`translate(${s.at[0]},${s.at[1]}) scale(${k})`}
                    style={{ pointerEvents: "auto", cursor: "pointer" }}
                    onClick={() => selectStart(s.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectStart(s.id);
                      }
                    }}
                    aria-pressed={selected}
                    aria-label={s.tooltip}
                  >
                    <title>{s.tooltip}</title>
                    <circle
                      r={17}
                      fill={selected ? "#f0e08a" : "#f7f2e7"}
                      stroke={selected ? "#b3472a" : "#2a3530"}
                      strokeWidth={selected ? 3 : 2}
                    />
                    {s.kind === "parking" ? (
                      <text
                        y={1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontFamily="var(--font-serif), serif"
                        fontWeight="bold"
                        fontSize={18}
                        fill="#2a3530"
                      >
                        P
                      </text>
                    ) : (
                      <g>
                        <rect x={-8} y={-7} width={16} height={11} rx={2.5} fill="#2a3530" />
                        <circle cx={-4} cy={6.5} r={2.3} fill="#2a3530" />
                        <circle cx={4} cy={6.5} r={2.3} fill="#2a3530" />
                        <line x1={-5.5} y1={-10.5} x2={5.5} y2={-10.5} stroke="#2a3530" strokeWidth={1.8} />
                      </g>
                    )}
                    <text
                      y={32}
                      textAnchor="middle"
                      fontFamily="var(--font-serif), serif"
                      fontStyle="italic"
                      fontSize={13}
                      fill="#2a3530"
                      paintOrder="stroke"
                      stroke="#f7f2e7"
                      strokeWidth={4}
                    >
                      {s.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Ovládání zoomu */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          <ZoomBtn label="Přiblížit" onClick={() => zoomButton(1.4)}>
            <Plus size={18} aria-hidden />
          </ZoomBtn>
          <ZoomBtn label="Oddálit" onClick={() => zoomButton(1 / 1.4)}>
            <Minus size={18} aria-hidden />
          </ZoomBtn>
          <ZoomBtn label="Výchozí pohled" onClick={reset}>
            <RotateCcw size={16} aria-hidden />
          </ZoomBtn>
        </div>
      </div>

      {/* Informační řádek / vybraná trasa / vybraný bod */}
      <div className="mt-3 min-h-[1.5rem]">
        {poiInfo?.note ? (
          <p className={cn("text-text", compact ? "text-xs" : "text-sm")}>{poiInfo.note}</p>
        ) : activeRoute ? (
          <p className={cn("text-text", compact ? "text-xs" : "text-sm")}>
            <span className="font-medium text-moss-deep">{activeRoute.label}:</span>{" "}
            ≈ {activeRoute.km} km pěšky (zhruba {walkingTimeMinutes(activeRoute.km)} min) — trasa
            je vyznačená terakotově a animovaně.
          </p>
        ) : (
          <p className={cn("italic text-text-muted", compact ? "text-xs" : "text-sm")}>
            Kudy k nám přijedete? Klikněte na bod v mapě nebo na tlačítko níže. Mapu lze
            přiblížit a posouvat.
          </p>
        )}
      </div>

      {/* Výběr trasy */}
      <div className="mt-3 flex flex-wrap gap-2">
        {routes.map((r) => {
          const selected = routeId === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setRouteId(selected ? null : r.id);
                setActivePoi(null);
              }}
              aria-pressed={selected}
              className={cn(
                "rounded-pill border px-4 py-1.5 text-sm font-medium transition-colors",
                selected
                  ? "border-terracotta bg-accent/40 text-moss-deep"
                  : "border-border bg-surface-alt text-moss-deep hover:bg-sand/60",
              )}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {/* Tlačítko na Mapy.cz */}
      <div className="mt-3">
        <a
          href={SITE.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-pill bg-moss px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-moss-deep"
        >
          <ExternalLink size={16} aria-hidden />
          Otevřít v Mapy.cz — navigace
        </a>
      </div>

      {/* Modal: detailní mapa Louky */}
      {detailOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-moss-deep/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Detailní mapa Louky"
          onClick={() => setDetailOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-surface p-6 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDetailOpen(false)}
              aria-label="Zavřít"
              className="absolute right-4 top-4 rounded-full border border-border bg-surface-alt p-1.5 text-moss-deep transition-colors hover:bg-sand/60"
            >
              <X size={18} aria-hidden />
            </button>
            <h3 className="font-serif text-2xl font-semibold text-moss-deep">Louka — detail</h3>
            {loukaDetail.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={loukaDetail.src}
                alt={loukaDetail.alt}
                className="mt-4 w-full rounded-lg border border-border"
              />
            ) : (
              <div className="mt-4 rounded-lg border border-dashed border-border bg-surface-alt p-8 text-center">
                <p className="text-text">
                  Detailní kreslená mapa Louky se připravuje — brzy tu bude s vyznačenými místy,
                  třešňovou i švestkovo-jablečnou alejí.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <style>{`
        @keyframes lm-march { to { stroke-dashoffset: -44; } }
        .lm-route { animation: lm-march 1.4s linear infinite; }
        .lm-pulse { animation: lm-pulse 2.2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        @keyframes lm-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }
        @media (prefers-reduced-motion: reduce) {
          .lm-route, .lm-pulse { animation: none; }
        }
      `}</style>
    </div>
  );
}

function ZoomBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/90 text-moss-deep shadow-soft backdrop-blur transition-colors hover:bg-surface"
    >
      {children}
    </button>
  );
}
