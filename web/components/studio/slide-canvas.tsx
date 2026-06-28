import type { CSSProperties } from "react"
import {
  SLIDE_H,
  SLIDE_W,
  speciesLabels,
  type Branding,
  type Carousel,
  type Slide,
  type SpeciesLabels,
} from "@/lib/carousel-schema"
import { resolvePalette, type Palette } from "./theme"

// Mapováno na self-hostované fonty webu „Nech mě růst" (viz app/globals.css):
// --font-serif = Fraunces, --font-sans = Plus Jakarta Sans.
const FONT_SERIF = 'var(--font-serif), Georgia, "Times New Roman", serif'
const FONT_SANS = 'var(--font-sans), system-ui, -apple-system, sans-serif'
const PAD = 100

type Props = {
  slide: Slide
  carousel: Carousel
  index: number
  total: number
}

/**
 * Vykreslí jeden slajd v plné velikosti 1080×1350 v herbářové estetice.
 * Pro náhled se zmenšuje přes CSS `transform: scale` v rodiči.
 * Záměrně používá inline styly, aby export (html-to-image) byl věrný.
 */
export function SlideCanvas({ slide, carousel, index, total }: Props) {
  const palette = resolvePalette(carousel.theme, carousel.accent)
  const align = slide.align ?? carousel.align
  const fs = carousel.fontScale
  const sLabels = speciesLabels(carousel.kind)

  const root: CSSProperties = {
    position: "relative",
    width: SLIDE_W,
    height: SLIDE_H,
    overflow: "hidden",
    background: `linear-gradient(160deg, ${palette.bgFrom}, ${palette.bgTo})`,
    color: palette.text,
    fontFamily: FONT_SANS,
    display: "flex",
    flexDirection: "column",
  }

  return (
    <div style={root}>
      <PaperGrain palette={palette} />
      <Vignette palette={palette} />
      <CornerSprig palette={palette} corner="top-right" />
      <CornerSprig palette={palette} corner="bottom-left" />
      <PlateFrame palette={palette} />

      <TopMarker palette={palette} index={index} total={total} fs={fs} />

      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: `0 ${PAD}px`,
          textAlign: align,
          alignItems: align === "center" ? "center" : "flex-start",
        }}
      >
        <SlideBody slide={slide} palette={palette} fs={fs} align={align} sLabels={sLabels} />
      </div>

      <Footer palette={palette} branding={carousel.branding} />
    </div>
  )
}

/* ----------------------------- těla slajdů ----------------------------- */

function SlideBody({
  slide,
  palette,
  fs,
  align,
  sLabels,
}: {
  slide: Slide
  palette: Palette
  fs: number
  align: "left" | "center"
  sLabels: SpeciesLabels
}) {
  switch (slide.type) {
    case "cover":
      return <CoverBody slide={slide} palette={palette} fs={fs} />
    case "plant":
      return <PlantBody slide={slide} palette={palette} fs={fs} align={align} sLabels={sLabels} />
    case "tip":
      return <FactBody slide={slide} palette={palette} fs={fs} tip />
    case "outro":
      return <OutroBody slide={slide} palette={palette} fs={fs} align={align} />
    case "photo":
      return <PhotoBody slide={slide} palette={palette} fs={fs} />
    case "fact":
    default:
      return <FactBody slide={slide} palette={palette} fs={fs} />
  }
}

function CoverBody({ slide, palette, fs }: { slide: Slide; palette: Palette; fs: number }) {
  return (
    <>
      {slide.eyebrow ? <Eyebrow palette={palette} fs={fs}>{slide.eyebrow}</Eyebrow> : null}
      <h1
        style={{
          fontFamily: FONT_SERIF,
          fontSize: 112 * fs,
          lineHeight: 1.0,
          fontWeight: 600,
          margin: "22px 0 0",
          letterSpacing: -1.5,
        }}
      >
        {slide.title}
      </h1>
      {slide.subtitle ? (
        <p
          style={{
            fontFamily: FONT_SERIF,
            fontStyle: "italic",
            fontSize: 46 * fs,
            lineHeight: 1.34,
            color: palette.muted,
            margin: "40px 0 0",
            maxWidth: 760,
          }}
        >
          {slide.subtitle}
        </p>
      ) : null}
      <Swipe palette={palette} fs={fs} />
    </>
  )
}

function PlantBody({
  slide,
  palette,
  fs,
  align,
  sLabels,
}: {
  slide: Slide
  palette: Palette
  fs: number
  align: "left" | "center"
  sLabels: SpeciesLabels
}) {
  return (
    <>
      {slide.status ? <SpecimenTag palette={palette} fs={fs} align={align}>{slide.status}</SpecimenTag> : null}
      <h2 style={{ fontFamily: FONT_SERIF, fontSize: 94 * fs, lineHeight: 1.02, fontWeight: 600, margin: "28px 0 0" }}>
        {slide.name}
      </h2>
      {slide.latin ? (
        <p style={{ fontFamily: FONT_SERIF, fontStyle: "italic", fontSize: 42 * fs, color: palette.muted, margin: "10px 0 0" }}>
          {slide.latin}
        </p>
      ) : null}

      {slide.fact ? (
        <Block palette={palette} fs={fs} label={sLabels.cardFact}>
          {slide.fact}
        </Block>
      ) : null}
      {slide.use ? (
        <Block palette={palette} fs={fs} label={sLabels.cardUse} accentLabel>
          {slide.use}
        </Block>
      ) : null}
      {slide.warning ? <Warning palette={palette} fs={fs}>{slide.warning}</Warning> : null}
    </>
  )
}

function FactBody({
  slide,
  palette,
  fs,
  tip,
}: {
  slide: Slide
  palette: Palette
  fs: number
  tip?: boolean
}) {
  return (
    <>
      {tip ? (
        <Eyebrow palette={palette} fs={fs}>{slide.eyebrow || "Tip"}</Eyebrow>
      ) : slide.eyebrow ? (
        <Eyebrow palette={palette} fs={fs}>{slide.eyebrow}</Eyebrow>
      ) : null}
      {slide.title ? (
        <h2 style={{ fontFamily: FONT_SERIF, fontSize: 86 * fs, lineHeight: 1.06, fontWeight: 600, margin: "22px 0 0", letterSpacing: -0.5 }}>
          {slide.title}
        </h2>
      ) : null}
      {slide.body ? (
        <p style={{ fontSize: 44 * fs, lineHeight: 1.42, color: palette.text, margin: "36px 0 0", maxWidth: 820 }}>
          {slide.body}
        </p>
      ) : null}
    </>
  )
}

function OutroBody({
  slide,
  palette,
  fs,
  align,
}: {
  slide: Slide
  palette: Palette
  fs: number
  align: "left" | "center"
}) {
  return (
    <>
      {slide.eyebrow ? <Eyebrow palette={palette} fs={fs}>{slide.eyebrow}</Eyebrow> : null}
      <h2 style={{ fontFamily: FONT_SERIF, fontSize: 90 * fs, lineHeight: 1.04, fontWeight: 600, margin: "22px 0 0", letterSpacing: -1 }}>
        {slide.title}
      </h2>
      {slide.body ? (
        <p
          style={{
            fontFamily: FONT_SERIF,
            fontStyle: "italic",
            fontSize: 42 * fs,
            lineHeight: 1.38,
            color: palette.muted,
            margin: "32px 0 0",
            maxWidth: 800,
          }}
        >
          {slide.body}
        </p>
      ) : null}
      {slide.cta ? (
        <span
          style={{
            display: "inline-block",
            alignSelf: align === "center" ? "center" : "flex-start",
            marginTop: 52,
            background: palette.accent,
            color: palette.onAccent,
            fontFamily: FONT_SANS,
            fontSize: 36 * fs,
            fontWeight: 700,
            padding: "20px 42px",
            borderRadius: 4,
          }}
        >
          {slide.cta}
        </span>
      ) : null}
    </>
  )
}

/** Fotografie v herbářové kartičce (světlá karta, okraj v akcentu, popisek). */
function PhotoBody({ slide, palette, fs }: { slide: Slide; palette: Palette; fs: number }) {
  const card = "#faf7f0" // --color-surface-alt
  const ink = "#2a3530" // --color-text
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 880,
        alignSelf: "center",
        background: card,
        borderRadius: 10,
        padding: 26,
        boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 880,
          borderRadius: 4,
          overflow: "hidden",
          border: `3px solid ${palette.accent}`,
          background: slide.imageData ? "transparent" : "rgba(39,55,42,0.06)",
        }}
      >
        {slide.imageData ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slide.imageData}
            alt={slide.imageCaption || "Fotografie"}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 16,
              border: `3px dashed ${palette.accent}`,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: ink,
              fontFamily: FONT_SANS,
              fontSize: 34 * fs,
              fontWeight: 700,
              textAlign: "center",
              opacity: 0.7,
            }}
          >
            Nahrajte fotografii
          </div>
        )}
      </div>
      {slide.imageCaption ? (
        <p
          style={{
            fontFamily: FONT_SERIF,
            fontStyle: "italic",
            fontSize: 40 * fs,
            lineHeight: 1.3,
            color: ink,
            margin: "22px 4px 4px",
            textAlign: "center",
          }}
        >
          {slide.imageCaption}
        </p>
      ) : null}
    </div>
  )
}

/* ----------------------------- stavební prvky ----------------------------- */

function Eyebrow({ children, palette, fs }: { children: React.ReactNode; palette: Palette; fs: number }) {
  return (
    <span
      style={{
        color: palette.accent,
        fontSize: 28 * fs,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.22em",
      }}
    >
      {children}
    </span>
  )
}

/** Herbářový „specimen" štítek pro stav druhu (rámeček, ne výplň). */
function SpecimenTag({
  children,
  palette,
  fs,
  align,
}: {
  children: React.ReactNode
  palette: Palette
  fs: number
  align: "left" | "center"
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        alignSelf: align === "center" ? "center" : "flex-start",
        border: `2px solid ${palette.accent}`,
        color: palette.accent,
        fontSize: 25 * fs,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        padding: "12px 22px",
        borderRadius: 4,
      }}
    >
      <LeafMark palette={palette} size={22 * fs} />
      {children}
    </span>
  )
}

function Block({
  children,
  label,
  palette,
  fs,
  accentLabel,
}: {
  children: React.ReactNode
  label: string
  palette: Palette
  fs: number
  accentLabel?: boolean
}) {
  return (
    <div style={{ marginTop: 44, maxWidth: 880, borderTop: `1px solid ${palette.line}`, paddingTop: 28 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: accentLabel ? palette.accent : palette.muted,
          fontSize: 24 * fs,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          marginBottom: 14,
        }}
      >
        <LeafMark palette={palette} color={accentLabel ? palette.accent : palette.muted} size={22 * fs} />
        {label}
      </div>
      <p style={{ fontSize: 40 * fs, lineHeight: 1.4, color: palette.text, margin: 0 }}>{children}</p>
    </div>
  )
}

function Warning({ children, palette, fs }: { children: React.ReactNode; palette: Palette; fs: number }) {
  return (
    <div
      style={{
        marginTop: 40,
        maxWidth: 880,
        display: "flex",
        gap: 22,
        alignItems: "flex-start",
        borderLeft: "5px solid #a4422c",
        background: "rgba(164,66,44,0.12)",
        borderRadius: "0 12px 12px 0",
        padding: "24px 30px",
      }}
    >
      <span style={{ fontSize: 38 * fs, lineHeight: 1.1 }}>⚠</span>
      <div>
        <div
          style={{
            color: "#d98b6f",
            fontSize: 23 * fs,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            marginBottom: 8,
          }}
        >
          Pozor — nebezpečné
        </div>
        <p style={{ fontSize: 33 * fs, lineHeight: 1.36, color: palette.text, margin: 0 }}>{children}</p>
      </div>
    </div>
  )
}

function Swipe({ palette, fs }: { palette: Palette; fs: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        marginTop: 64,
        color: palette.accent,
        fontWeight: 700,
        fontFamily: FONT_SANS,
        fontSize: 28 * fs,
      }}
    >
      <span style={{ width: 56, height: 2, background: palette.accent }} />
      <LeafMark palette={palette} size={28 * fs} />
      <span style={{ textTransform: "uppercase", letterSpacing: "0.22em" }}>Listujte →</span>
    </div>
  )
}

/* ----------------------------- atmosféra / dekorace ----------------------------- */

/** Jemné papírové zrno (tečky) přes celou plochu. */
function PaperGrain({ palette }: { palette: Palette }) {
  const dot = palette.dark ? "rgba(255,255,255,0.05)" : "rgba(40,55,42,0.05)"
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `radial-gradient(${dot} 1px, transparent 1.4px)`,
        backgroundSize: "7px 7px",
        pointerEvents: "none",
      }}
    />
  )
}

/** Vinětace okrajů – dodává dojem lisované tabule. */
function Vignette({ palette }: { palette: Palette }) {
  const edge = palette.dark ? "rgba(0,0,0,0.32)" : "rgba(60,50,30,0.12)"
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(120% 90% at 50% 38%, transparent 55%, ${edge} 100%)`,
        pointerEvents: "none",
      }}
    />
  )
}

/**
 * Jeden herbářový lístek s obrysem a žilnatinou.
 * Základna v počátku (0,0), špička míří nahoru (0,−L); umísťuje se přes
 * `transform: translate(x y) rotate(rot)`. Volitelná jemná výplň dodává
 * dojem lisované rostliny, žilky zůstávají vždy jen obrysové.
 */
function Leaf({
  x,
  y,
  rot,
  L = 70,
  stroke,
  fill = "none",
  sw = 2.6,
  fillOpacity = 1,
}: {
  x: number
  y: number
  rot: number
  L?: number
  stroke: string
  fill?: string
  sw?: number
  fillOpacity?: number
}) {
  const w = L * 0.36
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path
        d={`M0 0 C ${w} ${-L * 0.26} ${w * 0.62} ${-L * 0.82} 0 ${-L} C ${-w * 0.62} ${-L * 0.82} ${-w} ${-L * 0.26} 0 0 Z`}
        fill={fill}
        fillOpacity={fillOpacity}
        strokeWidth={sw}
      />
      {/* středová žilka + boční žilky */}
      <path d={`M0 ${-L * 0.08} L0 ${-L * 0.9}`} fill="none" strokeWidth={sw * 0.7} />
      <path d={`M0 ${-L * 0.34} L ${w * 0.48} ${-L * 0.5}`} fill="none" strokeWidth={sw * 0.5} />
      <path d={`M0 ${-L * 0.34} L ${-w * 0.48} ${-L * 0.5}`} fill="none" strokeWidth={sw * 0.5} />
      <path d={`M0 ${-L * 0.56} L ${w * 0.4} ${-L * 0.69}`} fill="none" strokeWidth={sw * 0.5} />
      <path d={`M0 ${-L * 0.56} L ${-w * 0.4} ${-L * 0.69}`} fill="none" strokeWidth={sw * 0.5} />
    </g>
  )
}

/**
 * Botanická snítka v rohu — zakřivený stonek s pravidelně střídanými listy
 * (obrys + žilnatina) a poupětem na špičce. Přetéká okraj jako lisovaná
 * rostlina. Vykresluje se v obou protilehlých rozích pro vyvážení plochy.
 */
function CornerSprig({ palette, corner }: { palette: Palette; corner: "top-right" | "bottom-left" }) {
  const isBottom = corner === "bottom-left"
  const pos: CSSProperties = isBottom
    ? { left: -64, bottom: -84, transform: "scaleX(-1) rotate(176deg)" }
    : { right: -58, top: -72 }
  const tint = palette.decor
  const leafFill = palette.dark ? "rgba(255,255,255,0.05)" : "rgba(42,53,48,0.05)"
  return (
    <svg
      width="320"
      height="420"
      viewBox="0 0 300 400"
      style={{ position: "absolute", opacity: isBottom ? 0.13 : 0.2, pointerEvents: "none", ...pos }}
      aria-hidden
      fill="none"
    >
      {/* hlavní stonek */}
      <path
        d="M256 22 C 214 60 184 112 168 168 C 152 226 150 292 160 384"
        stroke={tint}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* listy střídavě po obou stranách stonku */}
      <Leaf x={232} y={58} rot={58} L={86} stroke={tint} fill={leafFill} />
      <Leaf x={206} y={104} rot={-52} L={78} stroke={tint} />
      <Leaf x={184} y={150} rot={64} L={94} stroke={tint} fill={leafFill} />
      <Leaf x={170} y={202} rot={-58} L={86} stroke={tint} />
      <Leaf x={162} y={256} rot={70} L={80} stroke={tint} fill={leafFill} />
      <Leaf x={159} y={312} rot={-62} L={70} stroke={tint} />
    </svg>
  )
}

/**
 * Herbářový rámeček (obrys) — tenká dvojlinka okolo desky s drobnými
 * lístkovými ozdobníky ve dvou protilehlých rozích. Sjednocuje slajdy
 * do dojmu sady lisovaných tabulí.
 */
function PlateFrame({ palette }: { palette: Palette }) {
  const inset = 44
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset,
          border: `1px solid ${palette.line}`,
          borderRadius: 6,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: inset + 7,
          border: `1px solid ${palette.line}`,
          borderRadius: 3,
          opacity: 0.6,
        }}
      />
      {/* lístkové ozdobníky v rozích rámečku */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        style={{ position: "absolute", left: inset - 10, top: inset - 10, opacity: 0.5 }}
        fill="none"
      >
        <Leaf x={20} y={20} rot={-45} L={40} stroke={palette.accent} sw={2.4} />
        <Leaf x={20} y={20} rot={-105} L={28} stroke={palette.accent} sw={2.2} />
      </svg>
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        style={{ position: "absolute", right: inset - 10, bottom: inset - 10, opacity: 0.5, transform: "rotate(180deg)" }}
        fill="none"
      >
        <Leaf x={20} y={20} rot={-45} L={40} stroke={palette.accent} sw={2.4} />
        <Leaf x={20} y={20} rot={-105} L={28} stroke={palette.accent} sw={2.2} />
      </svg>
    </div>
  )
}

/** Drobný lístkový ozdobník pro inline použití (oddělovače, štítky). */
function LeafMark({ palette, color, size = 26 }: { palette: Palette; color?: string; size?: number }) {
  const stroke = color ?? palette.accent
  return (
    <svg
      width={size}
      height={size}
      viewBox="-22 -46 44 50"
      aria-hidden
      style={{ display: "block", flex: "none" }}
      fill="none"
    >
      <Leaf x={0} y={0} rot={0} L={40} stroke={stroke} sw={3} />
    </svg>
  )
}

/** Index slajdu (skutečná sekvence karuselu) v herbářovém stylu nahoře. */
function TopMarker({ palette, index, total, fs }: { palette: Palette; index: number; total: number; fs: number }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: `${PAD - 28}px ${PAD}px 0`,
        color: palette.muted,
        fontFamily: FONT_SANS,
        fontSize: 26 * fs,
        fontWeight: 700,
        letterSpacing: "0.16em",
      }}
    >
      <span style={{ color: palette.accent }}>{String(index + 1).padStart(2, "0")}</span>
      <span style={{ width: 44, height: 1, background: palette.line }} />
      <span>{String(total).padStart(2, "0")}</span>
    </div>
  )
}

/* ----------------------------- patička / branding ----------------------------- */

function Footer({ palette, branding }: { palette: Palette; branding: Branding }) {
  return (
    <div style={{ position: "relative", padding: `0 ${PAD}px 60px` }}>
      {branding.publicita ? (
        <div
          style={{
            background: "#ffffff",
            borderRadius: 12,
            padding: "16px 26px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 34,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-mzp.png" alt="Ministerstvo životního prostředí" style={{ height: 58, objectFit: "contain" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-sfzp.png" alt="Státní fond životního prostředí" style={{ height: 58, objectFit: "contain" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-aopk.png" alt="Agentura ochrany přírody a krajiny" style={{ height: 58, objectFit: "contain" }} />
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${palette.line}`,
          paddingTop: 28,
        }}
      >
        {branding.csopLogo ? (
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* Logo „Nech mě růst" (PNG má průhledné pozadí) — bez bílého kruhu. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="Nech mě růst" style={{ height: 84, objectFit: "contain" }} />
            <span style={{ fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 32, color: palette.text }}>Nech mě růst</span>
          </div>
        ) : (
          <span />
        )}

        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: palette.muted,
          }}
        >
          nechmerust.org
        </span>
      </div>
    </div>
  )
}
