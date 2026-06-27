"use client"

import { ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react"
import type { Carousel } from "@/lib/carousel-schema"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ScaledSlide } from "./scaled-slide"

export function SlideThumbnails({
  carousel,
  activeIndex,
  onSelect,
  onAdd,
  onRemove,
  onMove,
}: {
  carousel: Carousel
  activeIndex: number
  onSelect: (i: number) => void
  onAdd: () => void
  onRemove: (i: number) => void
  onMove: (i: number, dir: -1 | 1) => void
}) {
  const total = carousel.slides.length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Slajdy ({total})</h2>
        <Button size="sm" variant="ghost" onClick={onAdd}>
          <Plus className="mr-1 h-4 w-4" /> Přidat
        </Button>
      </div>

      <div className="space-y-3">
        {carousel.slides.map((slide, i) => (
          <div
            key={i}
            className={cn(
              "group flex gap-3 rounded-lg border p-2 transition-colors",
              i === activeIndex ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(i)}
              className="shrink-0 rounded-md ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Slajd ${i + 1}`}
            >
              <ScaledSlide slide={slide} carousel={carousel} index={i} total={total} width={84} />
            </button>

            <div className="flex flex-1 flex-col justify-between py-0.5">
              <button type="button" onClick={() => onSelect(i)} className="text-left">
                <div className="text-xs font-semibold">
                  {i + 1}. {slide.title || slide.name || slide.eyebrow || typeLabel(slide.type)}
                </div>
                <div className="text-[11px] capitalize text-muted-foreground">{typeLabel(slide.type)}</div>
              </button>

              <div className="flex items-center gap-0.5 opacity-60 transition-opacity group-hover:opacity-100">
                <Button size="icon" variant="ghost" className="h-6 w-6" disabled={i === 0} onClick={() => onMove(i, -1)}>
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6" disabled={i === total - 1} onClick={() => onMove(i, 1)}>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  disabled={total <= 1}
                  onClick={() => onRemove(i)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function typeLabel(type: string): string {
  return (
    {
      cover: "Úvodní",
      plant: "Druh / bylina",
      fact: "Zajímavost",
      tip: "Tip",
      outro: "Závěr",
      photo: "Fotografie",
    }[type] ?? type
  )
}
