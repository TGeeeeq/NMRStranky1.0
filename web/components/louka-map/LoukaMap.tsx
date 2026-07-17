"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import {
  VIEW,
  forests,
  waters,
  streams,
  rails,
  roads,
  lanes,
  trails,
  places,
  startPoints,
  targets,
  routes,
  type StartId,
  type TargetId,
} from "./map-data";
import { pois } from "./poi";

const TARGET: TargetId = "louka";

/** Převede pole souřadnic na SVG path string. */
function pointsToPath(points: Array<[number, number]>, closed = false): string {
  if (points.length === 0) return "";
  const parts: string[] = [];
  parts.push(`M ${points[0][0]},${points[0][1]}`);
  for (let i = 1; i < points.length; i++) {
    parts.push(`L ${points[i][0]},${points[i][1]}`);
  }
  if (closed) parts.push("Z");
  return parts.join(" ");
}

/** Vypočítá dobu chůze v minutách (zaokrouhleno na 5 minut). */
function walkingTimeMinutes(km: number): number {
  return Math.round((km / 4) * 60 / 5) * 5;
}

export function LoukaMap({ compact = false }: { compact?: boolean }) {
  const [from, setFrom] = useState<StartId | null>(null);
  // Mapa může být na stránce vícekrát — id filtrů musí být unikátní.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const roughId = `lm-rough-${uid}`;
  const paperId = `lm-paper-${uid}`;

  // Trasy vedoucí k Louce
  const shownRoutes = routes.filter((r) => r.to === TARGET);
  const activeRoute = shownRoutes.find((r) => r.from === from);

  // Cílové místo (Louka)
  const loukaTarget = targets.find((t) => t.id === TARGET);
  if (!loukaTarget) return null;

  const toggleStart = (id: StartId) => {
    setFrom(from === id ? null : id);
  };

  const allLabels = [...places, ...pois];

  // Přebalit tlačítka — mapuj startPoints na čeština
  const buttonLabels: Record<StartId, string> = {
    parking: "Autem — parkoviště",
    vlkanec: "Vlakem — Vlkaneč",
    novaves: "Vlakem — Nová Ves u Leštiny",
  };

  return (
    <div className={cn("overflow-hidden", !compact && "rounded-lg")}>
      <div className="overflow-hidden rounded-lg border border-border shadow-soft">
        <svg
          viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
          className="h-auto w-full"
          role="img"
          aria-label="Kreslená mapa cesty na Louku"
        >
          {/* Filtry */}
          <defs>
            {/* Rough / hand-drawn wobble */}
            <filter
              id={roughId}
              x="-5%"
              y="-5%"
              width="110%"
              height="110%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.015"
                numOctaves="2"
                seed="7"
                result="n"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="n"
                scale="4"
              />
            </filter>
            {/* Papír texture */}
            <filter id={paperId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="2"
                seed="3"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0.06 0"
              />
            </filter>
          </defs>

          {/* Pozadí */}
          <rect
            width={VIEW.width}
            height={VIEW.height}
            fill="#f7f2e7"
          />
          <rect
            width={VIEW.width}
            height={VIEW.height}
            filter={`url(#${paperId})`}
          />

          {/* Terén (lesy, voda, potoky) */}
          <g filter={`url(#${roughId})`}>
            {/* Lesy */}
            {forests.map((forest, i) => (
              <path
                key={"forest-" + i}
                d={pointsToPath(forest, true)}
                fill="#6b8e6e"
                fillOpacity={0.28}
                stroke="#2d5a3d"
                strokeOpacity={0.45}
                strokeWidth={1.2}
                strokeDasharray="2 3"
              />
            ))}
            {/* Voda */}
            {waters.map((water, i) => (
              <path
                key={"water-" + i}
                d={pointsToPath(water, true)}
                fill="#9ec1c9"
                fillOpacity={0.55}
                stroke="#5a8a96"
                strokeWidth={1}
              />
            ))}
            {/* Potoky */}
            {streams.map((stream, i) => (
              <path
                key={"stream-" + i}
                d={pointsToPath(stream, false)}
                fill="none"
                stroke="#5a8a96"
                strokeWidth={1.5}
                strokeOpacity={0.7}
              />
            ))}
            {/* Louka — jedno území rozprostřené mezi oběma body z podkladové
                mapy; trasy vedou k jejímu jihovýchodnímu okraji (vstupu). */}
            <ellipse
              cx={390}
              cy={562}
              rx={105}
              ry={50}
              transform="rotate(67 390 562)"
              fill="#f0e892"
              fillOpacity={0.5}
              stroke="#6b8e6e"
              strokeWidth={1.6}
              strokeDasharray="3 4"
            />
          </g>

          {/* Cesty (kolejnice, silnice, polní cesty, stezky) */}
          <g>
            {/* Kolejnice */}
            {rails.map((rail, i) => (
              <g key={"rail-" + i}>
                {/* Spodní vrstva — tmavá */}
                <polyline
                  points={rail.map((p) => p.join(",")).join(" ")}
                  fill="none"
                  stroke="#2a3530"
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Horní vrstva — přerušované */ }
                <polyline
                  points={rail.map((p) => p.join(",")).join(" ")}
                  fill="none"
                  stroke="#f7f2e7"
                  strokeWidth={1.6}
                  strokeDasharray="7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ))}
            {/* Silnice */}
            {roads.map((road, i) => (
              <g key={"road-" + i}>
                {/* Spodní vrstva */}
                <polyline
                  points={road.map((p) => p.join(",")).join(" ")}
                  fill="none"
                  stroke="#2a3530"
                  strokeWidth={4.6}
                  strokeOpacity={0.85}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Horní vrstva */}
                <polyline
                  points={road.map((p) => p.join(",")).join(" ")}
                  fill="none"
                  stroke="#e8dfc8"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ))}
            {/* Polní cesty */}
            {lanes.map((lane, i) => (
              <polyline
                key={"lane-" + i}
                points={lane.map((p) => p.join(",")).join(" ")}
                fill="none"
                stroke="#8a7a5f"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {/* Stezky */}
            {trails.map((trail, i) => (
              <polyline
                key={"trail-" + i}
                points={trail.map((p) => p.join(",")).join(" ")}
                fill="none"
                stroke="#7a6a4f"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                strokeOpacity={0.9}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* Trasy */}
          <g>
            {shownRoutes.map((route, i) => {
              const isActive = route.from === from;
              return (
                <path
                  key={"route-" + i}
                  d={pointsToPath(route.points, false)}
                  fill="none"
                  stroke={isActive ? "#b85c3c" : "#5a6660"}
                  strokeWidth={isActive ? 5 : 2.5}
                  strokeDasharray={isActive ? "12 8" : "6 5"}
                  strokeLinecap="round"
                  opacity={
                    isActive ? 1 : from === null ? 0.4 : 0.12
                  }
                  className={isActive ? "lm-route-active" : ""}
                />
              );
            })}
          </g>

          {/* Popisky míst (vesnice + zajímavá místa) */}
          <g>
            {allLabels.map((label, i) => (
              <text
                key={"label-" + i}
                x={label.at[0]}
                y={label.at[1]}
                fontStyle="italic"
                fontFamily="var(--font-serif), serif"
                fontSize={22}
                fill="#2a3530"
                opacity={0.8}
                textAnchor="middle"
                letterSpacing={0.5}
              >
                {label.name}
              </text>
            ))}
          </g>

          {/* Startovní body */}
          <g>
            {startPoints.map((start) => {
              const isSelected = from === start.id;

              return (
                <g
                  key={"start-" + start.id}
                  role="button"
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleStart(start.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleStart(start.id);
                    }
                  }}
                  aria-pressed={isSelected}
                >
                  {/* Kruh */}
                  <circle
                    cx={start.at[0]}
                    cy={start.at[1]}
                    r={14}
                    fill={isSelected ? "#f0e892" : "#f7f2e7"}
                    stroke={isSelected ? "#b85c3c" : "#2a3530"}
                    strokeWidth={isSelected ? 2.5 : 2}
                  />

                  {/* Ikona uvnitř */}
                  {start.id === "parking" ? (
                    // Parkování: "P"
                    <text
                      x={start.at[0]}
                      y={start.at[1]}
                      fontWeight="bold"
                      fontFamily="var(--font-serif), serif"
                      fontSize={16}
                      fill="#2a3530"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      P
                    </text>
                  ) : (
                    // Vlak: jednoduchá ikonka
                    <g>
                      {/* Vagón */}
                      <rect
                        x={start.at[0] - 6.5}
                        y={start.at[1] - 6}
                        width={13}
                        height={9}
                        rx={2}
                        fill="#2a3530"
                      />
                      {/* Kola */}
                      <circle
                        cx={start.at[0] - 3.5}
                        cy={start.at[1] + 5.5}
                        r={1.9}
                        fill="#2a3530"
                      />
                      <circle
                        cx={start.at[0] + 3.5}
                        cy={start.at[1] + 5.5}
                        r={1.9}
                        fill="#2a3530"
                      />
                      {/* Střecha (pantograf) */}
                      <line
                        x1={start.at[0] - 4.5}
                        y1={start.at[1] - 8.5}
                        x2={start.at[0] + 4.5}
                        y2={start.at[1] - 8.5}
                        stroke="#2a3530"
                        strokeWidth={1.5}
                      />
                    </g>
                  )}

                  {/* Popisek pod markerem */}
                  <text
                    x={start.at[0]}
                    y={start.at[1] + 30}
                    fontStyle="italic"
                    fontFamily="var(--font-serif), serif"
                    fontSize={14}
                    fill="#2a3530"
                    textAnchor="middle"
                    paintOrder="stroke"
                    stroke="#f7f2e7"
                    strokeWidth={4}
                  >
                    {start.label}
                  </text>

                  <title>
                    {start.id === "parking"
                      ? "Přijedu autem — parkoviště"
                      : start.id === "vlkanec"
                        ? "Vlakem — stanice Vlkaneč"
                        : "Vlakem — stanice Nová Ves u Leštiny"}
                  </title>
                </g>
              );
            })}
          </g>

          {/* Cílový marker: Louka (srdce) */}
          <g>
            <g
              transform={`translate(${loukaTarget.at[0]}, ${loukaTarget.at[1]})`}
            >
              {/* Srdce */}
              <path
                d="M0,4 C-1,-2 -9,-3 -9,3 C-9,8 -3,11 0,14 C3,11 9,8 9,3 C9,-3 1,-2 0,4Z"
                fill="#b85c3c"
                stroke="#7d3a22"
                strokeWidth={1}
              />
            </g>
            {/* Nápis "Louka" ve středu území */}
            <text
              x={390}
              y={570}
              fontStyle="italic"
              fontFamily="var(--font-serif), serif"
              fontSize={27}
              fill="#b85c3c"
              textAnchor="middle"
              transform="rotate(-14 390 562)"
              paintOrder="stroke"
              stroke="#f7f2e7"
              strokeWidth={4}
            >
              Louka
            </text>
          </g>

          {/* Kompas — horní pravý roh (inset ~60) */}
          <g transform={`translate(${VIEW.width - 60}, 60)`}>
            {/* První hvězda (0°) */}
            <path
              d="M0,-24 L2,-8 L24,-8 L6,4 L10,20 L0,8 L-10,20 L-6,4 L-24,-8 L-2,-8 Z"
              fill="#2a3530"
            />
            {/* Druhá hvězda (45°, menší, světlejší) */}
            <path
              d="M0,-17 L1.5,-5.5 L17,-5.5 L4,2.5 L7,14 L0,5.5 L-7,14 L-4,2.5 L-17,-5.5 L-1.5,-5.5 Z"
              fill="#b85c3c"
              opacity={0.6}
              transform="rotate(45)"
            />
            {/* Písmeno N */}
            <text
              x={0}
              y={-32}
              fontFamily="var(--font-serif), serif"
              fontSize={16}
              fill="#2a3530"
              textAnchor="middle"
            >
              N
            </text>
          </g>

          {/* Rám (dvojitý) */}
          <rect
            x={8}
            y={8}
            width={VIEW.width - 16}
            height={VIEW.height - 16}
            fill="none"
            stroke="#2a3530"
            strokeWidth={2}
            rx={4}
          />
          <rect
            x={14}
            y={14}
            width={VIEW.width - 28}
            height={VIEW.height - 28}
            fill="none"
            stroke="#2a3530"
            strokeWidth={0.8}
            rx={4}
          />

          {/* Animace */}
          <style>{`
            @keyframes lm-march {
              to { stroke-dashoffset: -40; }
            }
            .lm-route-active {
              animation: lm-march 1.4s linear infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .lm-route-active {
                animation: none;
              }
            }
          `}</style>
        </svg>
      </div>

      {/* Text pod mapou */}
      <div>
        {from === null ? (
          <p className={cn("mt-3 italic text-text-muted", compact ? "text-xs" : "text-sm")}>
            Kudy k nám přijedete? Klikněte na mapě nebo vyberte níže.
          </p>
        ) : activeRoute ? (
          <p className={cn("mt-3 text-text", compact ? "text-xs" : "text-sm")}>
            ≈ {activeRoute.km} km pěšky (zhruba {walkingTimeMinutes(activeRoute.km)} min) —
            {" "}
            trasa je na mapě vyznačená terakotově.
          </p>
        ) : null}
      </div>

      {/* Tlačítka */}
      <div className="mt-3 flex flex-wrap gap-2">
        {startPoints.map((start) => {
          const isSelected = from === start.id;
          return (
            <button
              key={"btn-" + start.id}
              type="button"
              onClick={() => toggleStart(start.id)}
              aria-pressed={isSelected}
              className={cn(
                "rounded-pill border px-4 py-1.5 text-sm font-medium transition-colors",
                isSelected
                  ? "border-terracotta bg-accent/40 text-moss-deep"
                  : "border-border bg-surface-alt text-moss-deep hover:bg-sand/60"
              )}
            >
              {buttonLabels[start.id]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
