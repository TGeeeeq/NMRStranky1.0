import { SLIDE_H, SLIDE_W, type Carousel, type Slide } from "@/lib/carousel-schema"
import { SlideCanvas } from "./slide-canvas"

/**
 * Zobrazí slajd zmenšený na zadanou šířku (zachová poměr 4:5).
 * Plné vykreslení 1080×1350 se škáluje přes CSS transform.
 */
export function ScaledSlide({
  slide,
  carousel,
  index,
  total,
  width,
  className,
}: {
  slide: Slide
  carousel: Carousel
  index: number
  total: number
  width: number
  className?: string
}) {
  const scale = width / SLIDE_W
  return (
    <div
      className={className}
      style={{
        width,
        height: SLIDE_H * scale,
        overflow: "hidden",
        borderRadius: 8,
      }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: SLIDE_W, height: SLIDE_H }}>
        <SlideCanvas slide={slide} carousel={carousel} index={index} total={total} />
      </div>
    </div>
  )
}
