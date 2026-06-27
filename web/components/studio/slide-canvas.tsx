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
      <BotanicalSprig palette={palette} />

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
  const card = "#f6f1e2"
  const ink = "#27372a"
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
      <span style={{ width: 9, height: 9, borderRadius: 999, background: palette.accent }} />
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
          color: accentLabel ? palette.accent : palette.muted,
          fontSize: 24 * fs,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          marginBottom: 14,
        }}
      >
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
        borderLeft: "5px solid #c0492f",
        background: "rgba(192,73,47,0.12)",
        borderRadius: "0 12px 12px 0",
        padding: "24px 30px",
      }}
    >
      <span style={{ fontSize: 38 * fs, lineHeight: 1.1 }}>⚠</span>
      <div>
        <div
          style={{
            color: "#e08a72",
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
      <span style={{ width: 72, height: 2, background: palette.accent }} />
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

/** Elegantní jednotahová botanická perokresba v rohu (přetéká okraj). */
function BotanicalSprig({ palette }: { palette: Palette }) {
  return (
    <svg
      width="560"
      height="720"
      viewBox="0 0 280 360"
      style={{ position: "absolute", right: -90, top: -70, opacity: 0.16, pointerEvents: "none" }}
      aria-hidden
      fill="none"
      stroke={palette.decor}
      strokeWidth={2.4}
      strokeLinecap="round"
    >
      <path d="M150 360 C 150 280 150 210 168 150 C 182 100 210 60 250 30" />
      {/* listy podél stonku */}
      <path d="M160 300 C 120 296 96 270 92 232 C 132 234 158 260 160 300 Z" />
      <path d="M158 258 C 196 250 222 222 224 184 C 186 190 160 218 158 258 Z" />
      <path d="M166 214 C 128 206 106 178 106 142 C 144 150 168 178 166 214 Z" />
      <path d="M178 168 C 214 158 236 128 234 92 C 200 102 178 132 178 168 Z" />
      <path d="M198 122 C 168 110 152 82 156 50 C 188 64 204 92 198 122 Z" />
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
