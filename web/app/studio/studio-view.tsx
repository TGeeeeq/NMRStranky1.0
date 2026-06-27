"use client"

import { useCallback, useRef, useState } from "react"
import { Upload, Download, FileJson, ImageDown, Leaf, Loader2 } from "lucide-react"
import { toast, Toaster } from "sonner"
import {
  emptyCarousel,
  parseCarousel,
  type Carousel,
  type Caption,
  type Slide,
} from "@/lib/carousel-schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SlideCanvas } from "@/components/studio/slide-canvas"
import { ScaledSlide } from "@/components/studio/scaled-slide"
import { SlideThumbnails } from "@/components/studio/slide-thumbnails"
import { EditorPanel } from "@/components/studio/editor-panel"
import { DesignPanel } from "@/components/studio/design-panel"
import { CaptionsPanel } from "@/components/studio/captions-panel"
import { downloadSlide, downloadZip } from "@/components/studio/export"

const PREVIEW_WIDTH = 392

export default function StudioView() {
  const [carousel, setCarousel] = useState<Carousel>(emptyCarousel)
  const [activeIndex, setActiveIndex] = useState(0)
  const [busy, setBusy] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])

  const total = carousel.slides.length
  const active = Math.min(activeIndex, total - 1)
  const activeSlide = carousel.slides[active]

  const getNodes = useCallback(
    () => nodeRefs.current.slice(0, total).filter((n): n is HTMLDivElement => n != null),
    [total],
  )

  /* ----------------------------- nahrání JSON ----------------------------- */

  const loadJsonText = (text: string) => {
    let raw: unknown
    try {
      raw = JSON.parse(text)
    } catch {
      toast.error("Soubor není platný JSON.")
      return
    }
    const result = parseCarousel(raw)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    setCarousel(result.data)
    setActiveIndex(0)
    toast.success(`Načteno: ${result.data.slides.length} slajdů`)
  }

  const onFile = (file?: File) => {
    if (!file) return
    file.text().then(loadJsonText)
  }

  const loadSample = async () => {
    try {
      const res = await fetch("/karusel/nech-me-rust-sablona.json")
      if (!res.ok) throw new Error()
      loadJsonText(await res.text())
    } catch {
      toast.error("Ukázku se nepodařilo načíst.")
    }
  }

  /* ----------------------------- úpravy stavu ----------------------------- */

  const patchCarousel = (patch: Partial<Carousel>) => setCarousel((c) => ({ ...c, ...patch }))

  const patchSlide = (patch: Partial<Slide>) =>
    setCarousel((c) => ({
      ...c,
      slides: c.slides.map((s, i) => (i === active ? { ...s, ...patch } : s)),
    }))

  const patchCaption = (index: number, patch: Partial<Caption>) =>
    setCarousel((c) => ({
      ...c,
      captions: c.captions.map((cap, i) => (i === index ? { ...cap, ...patch } : cap)),
    }))

  const addSlide = () => {
    setCarousel((c) => ({
      ...c,
      slides: [...c.slides, { ...emptyCarousel().slides[0], type: "fact", eyebrow: "", title: "Nový slajd", subtitle: "" }],
    }))
    setActiveIndex(total)
  }

  const removeSlide = (i: number) =>
    setCarousel((c) => ({ ...c, slides: c.slides.filter((_, idx) => idx !== i) }))

  const moveSlide = (i: number, dir: -1 | 1) => {
    const j = i + dir
    setCarousel((c) => {
      if (j < 0 || j >= c.slides.length) return c
      const slides = [...c.slides]
      ;[slides[i], slides[j]] = [slides[j], slides[i]]
      return { ...c, slides }
    })
    setActiveIndex(j)
  }

  /* ----------------------------- export ----------------------------- */

  const withBusy = async (fn: () => Promise<void>) => {
    setBusy(true)
    try {
      await fn()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export selhal.")
    } finally {
      setBusy(false)
    }
  }

  const exportActive = () =>
    withBusy(async () => {
      const node = nodeRefs.current[active]
      if (!node) throw new Error("Slajd není připraven.")
      await downloadSlide(node, carousel.topic, active)
    })

  const exportZip = () => withBusy(() => downloadZip(getNodes(), carousel.topic))

  /* ----------------------------- render ----------------------------- */

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <Toaster richColors position="top-center" />
      {/* Hlavička */}
      <header className="mb-6">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          <Leaf className="h-4 w-4" /> Karusel studio
        </div>
        <h1 className="font-serif text-3xl font-bold">Tvorba instagramového karuselu</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Nahrajte JSON od Clauda, upravte texty i design a stáhněte hotové obrázky (1080×1350)
          pro Instagram.
        </p>
      </header>

      {/* Lišta akcí */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
        <Input
          value={carousel.topic}
          onChange={(e) => patchCarousel({ topic: e.target.value })}
          className="h-9 max-w-xs font-medium"
          aria-label="Téma karuselu"
        />
        <div className="flex-1" />
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" /> Nahrát JSON
        </Button>
        <Button variant="ghost" size="sm" onClick={loadSample}>
          <FileJson className="mr-2 h-4 w-4" /> Ukázka
        </Button>
        <Button variant="secondary" size="sm" onClick={exportActive} disabled={busy || !activeSlide}>
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageDown className="mr-2 h-4 w-4" />}
          Stáhnout slajd
        </Button>
        <Button size="sm" onClick={exportZip} disabled={busy || total === 0}>
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Stáhnout vše (ZIP)
        </Button>
      </div>

      {/* Pracovní plocha */}
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_380px]">
        <aside className="order-2 lg:order-1">
          <SlideThumbnails
            carousel={carousel}
            activeIndex={active}
            onSelect={setActiveIndex}
            onAdd={addSlide}
            onRemove={removeSlide}
            onMove={moveSlide}
          />
        </aside>

        <section className="order-1 flex flex-col items-center lg:order-2">
          {activeSlide ? (
            <div className="rounded-2xl border border-border bg-muted/30 p-5 shadow-sm">
              <ScaledSlide
                slide={activeSlide}
                carousel={carousel}
                index={active}
                total={total}
                width={PREVIEW_WIDTH}
                className="shadow-lg ring-1 ring-black/5"
              />
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Náhled slajdu {active + 1} / {total} — formát 4:5 (1080×1350)
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">Žádné slajdy.</p>
          )}
        </section>

        <aside className="order-3">
          <Tabs defaultValue="obsah">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="obsah">Obsah</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="popisky">Popisky</TabsTrigger>
            </TabsList>

            <TabsContent value="obsah" className="mt-4">
              {activeSlide ? (
                <EditorPanel slide={activeSlide} onChange={patchSlide} />
              ) : (
                <p className="text-sm text-muted-foreground">Vyberte slajd.</p>
              )}
            </TabsContent>
            <TabsContent value="design" className="mt-4">
              <DesignPanel carousel={carousel} onChange={patchCarousel} />
            </TabsContent>
            <TabsContent value="popisky" className="mt-4">
              <CaptionsPanel captions={carousel.captions} onChange={patchCaption} />
            </TabsContent>
          </Tabs>
        </aside>
      </div>

      {/* Offscreen plné vykreslení pro export (1080×1350) */}
      <div aria-hidden style={{ position: "fixed", left: -20000, top: 0, pointerEvents: "none", opacity: 0 }}>
        {carousel.slides.map((slide, i) => (
          <div key={i} ref={(el) => { nodeRefs.current[i] = el }}>
            <SlideCanvas slide={slide} carousel={carousel} index={i} total={total} />
          </div>
        ))}
      </div>
    </div>
  )
}
