import type { CSSProperties } from "react"
import { FORMATS, type InviteFormat, type InviteTexts } from "./formats"

// Stejně jako studio: mapováno na self-hostované fonty webu (app/globals.css).
const FONT_SERIF = 'var(--font-serif), Georgia, "Times New Roman", serif'
const FONT_SANS = 'var(--font-sans), system-ui, -apple-system, sans-serif'

// Barvy sladěné s referenčními plakáty (pergamen / tmavá tabule / hnědé rámy).
const PARCHMENT = "rgba(243, 231, 201, 0.94)"
const PARCHMENT_SOLID = "#f3e7c9"
const FRAME = "#7a5a36"
const INK = "#3d2b1f"
const BOARD = "rgba(38, 49, 40, 0.93)"
const BOARD_TEXT = "#f3e7c9"

type Props = {
  format: InviteFormat
  /** Data URL vygenerovaného pozadí; null = sépiový fallback. */
  background: string | null
  texts: InviteTexts
}

/** Velikost titulku podle délky, aby se vešel do cedule. */
function titleFontSize(title: string): number {
  const len = title.length
  if (len <= 10) return 104
  if (len <= 16) return 86
  if (len <= 24) return 66
  return 50
}

/**
 * Vykreslí pozvánku v plné velikosti (1080×1350 / 1080×1920) — AI pozadí
 * a přes něj české texty. Pro náhled se zmenšuje CSS transformem v rodiči.
 * Záměrně jen inline styly, aby export přes html-to-image byl věrný.
 */
export function InviteCanvas({ format, background, texts }: Props) {
  const { width, height } = FORMATS[format]
  const story = format === "story"

  const root: CSSProperties = {
    position: "relative",
    width,
    height,
    overflow: "hidden",
    background: "linear-gradient(165deg, #e8d9b0, #c9b98a)",
    fontFamily: FONT_SANS,
    color: INK,
  }

  const iconItems = texts.icons
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div style={root}>
      {background ? (
        // eslint-disable-next-line @next/next/no-img-element -- data URL, plný rozměr, export
        <img
          src={background}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : null}

      {/* Jemná vinětace, ať texty nesplývají s okraji ilustrace */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(43,31,17,0.28) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: story ? "96px 64px 72px" : "70px 60px 54px",
          textAlign: "center",
        }}
      >
        {/* Hlavička: dřevěná cedule s názvem + stuha s heslem */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "94%" }}>
          {texts.title ? (
            <div
              style={{
                background: PARCHMENT,
                border: `7px solid ${FRAME}`,
                borderRadius: 30,
                boxShadow: "0 10px 30px rgba(43,31,17,0.35), inset 0 0 0 4px rgba(122,90,54,0.25)",
                padding: "34px 64px",
              }}
            >
              <div
                style={{
                  fontFamily: FONT_SERIF,
                  fontWeight: 800,
                  fontSize: titleFontSize(texts.title),
                  lineHeight: 1.05,
                  letterSpacing: 2,
                  color: INK,
                }}
              >
                {texts.title}
              </div>
            </div>
          ) : null}

          {texts.tagline ? (
            <div
              style={{
                marginTop: 26,
                background: PARCHMENT_SOLID,
                border: `3px solid ${FRAME}`,
                borderRadius: 999,
                padding: "16px 44px",
                fontSize: 34,
                fontWeight: 600,
                color: INK,
                boxShadow: "0 6px 18px rgba(43,31,17,0.3)",
              }}
            >
              {texts.tagline}
            </div>
          ) : null}
        </div>

        {/* Střed: tmavá tabule s datem + oválek s místem */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {texts.dateText ? (
            <div
              style={{
                background: BOARD,
                border: "6px solid #caa96a",
                borderRadius: 24,
                padding: "30px 62px",
                boxShadow: "0 10px 30px rgba(20,26,20,0.45)",
              }}
            >
              <div
                style={{
                  fontFamily: FONT_SERIF,
                  fontWeight: 700,
                  fontSize: story ? 84 : 76,
                  lineHeight: 1.15,
                  color: BOARD_TEXT,
                  whiteSpace: "pre-line",
                }}
              >
                {texts.dateText}
              </div>
            </div>
          ) : null}

          {texts.placeText ? (
            <div
              style={{
                marginTop: 20,
                background: PARCHMENT_SOLID,
                border: `3px solid ${FRAME}`,
                borderRadius: 999,
                padding: "12px 40px",
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: 3,
                color: INK,
                boxShadow: "0 6px 18px rgba(43,31,17,0.3)",
              }}
            >
              {texts.placeText}
            </div>
          ) : null}
        </div>

        {/* Pata: řádek ikonek + web */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          {iconItems.length > 0 ? (
            <div
              style={{
                background: PARCHMENT,
                border: `5px solid ${FRAME}`,
                borderRadius: 34,
                padding: "22px 26px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "center",
                columnGap: 6,
                rowGap: 18,
                maxWidth: "100%",
                boxShadow: "0 8px 24px rgba(43,31,17,0.3)",
              }}
            >
              {iconItems.map((item, i) => {
                // „🔥 oheň" → emoji nahoře, popisek pod ním
                const [first, ...rest] = item.split(" ")
                const label = rest.join(" ")
                return (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 118 }}>
                      <div style={{ fontSize: 42, lineHeight: 1.2 }}>{label ? first : "•"}</div>
                      <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.25, color: INK, marginTop: 6 }}>
                        {label || first}
                      </div>
                    </div>
                    {i < iconItems.length - 1 ? (
                      <div style={{ fontSize: 30, color: FRAME, alignSelf: "center" }}>+</div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ) : null}

          {texts.footer ? (
            <div
              style={{
                marginTop: 26,
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: 4,
                color: PARCHMENT_SOLID,
                textShadow: "0 2px 12px rgba(20,15,8,0.75)",
              }}
            >
              {texts.footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
