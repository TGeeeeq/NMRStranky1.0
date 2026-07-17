"use client"

import { useRef, useState } from "react"
import { Download, ImageDown, Loader2, Sparkles, Wand2 } from "lucide-react"
import { toast, Toaster } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { generateBackground } from "@/app/pozvanky/actions"
import { InviteCanvas } from "./invite-canvas"
import { downloadInvite } from "./export"
import { DEFAULT_TEXTS, FORMATS, type InviteFormat, type InviteTexts } from "./formats"

const PREVIEW_WIDTH = 392
const MAX_VARIANTS = 8

type Variant = { image: string; format: InviteFormat; theme: string }

export default function PozvankyView() {
  const [theme, setTheme] = useState("")
  const [format, setFormat] = useState<InviteFormat>("post")
  const [texts, setTexts] = useState<InviteTexts>(DEFAULT_TEXTS)
  const [variants, setVariants] = useState<Variant[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [generating, setGenerating] = useState(false)
  const [exporting, setExporting] = useState(false)

  const exportRef = useRef<HTMLDivElement>(null)

  const { width, height } = FORMATS[format]
  const scale = PREVIEW_WIDTH / width
  const background = selected != null ? (variants[selected]?.image ?? null) : null

  const patch = (p: Partial<InviteTexts>) => setTexts((t) => ({ ...t, ...p }))

  const onGenerate = async () => {
    if (generating) return
    setGenerating(true)
    try {
      const res = await generateBackground({ theme, format })
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      setVariants((v) => {
        const next = [{ image: res.image, format, theme }, ...v].slice(0, MAX_VARIANTS)
        return next
      })
      setSelected(0)
      toast.success("Pozadí vygenerováno.")
    } catch {
      toast.error("Generování selhalo — zkus to znovu.")
    } finally {
      setGenerating(false)
    }
  }

  const onDownload = async () => {
    const node = exportRef.current
    if (!node) return
    setExporting(true)
    try {
      await downloadInvite(node, texts.title || "udalost", format)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export selhal.")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <Toaster richColors position="top-center" />

      <header className="mb-6">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          <Sparkles className="h-4 w-4" /> Pozvánky
        </div>
        <h1 className="font-serif text-3xl font-bold">Generátor pozvánek na události</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Popiš téma události, nech AI vygenerovat kreslené pozadí ve stylu plakátů Louky a přes
          něj se položí české texty. Stáhni Post (1080×1350) i Story/Reels (1080×1920).
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        {/* Náhled */}
        <section className="order-2 flex flex-col items-center lg:order-1">
          <div className="rounded-2xl border border-border bg-muted/30 p-5 shadow-sm">
            <div
              className="shadow-lg ring-1 ring-black/5"
              style={{ width: PREVIEW_WIDTH, height: height * scale, overflow: "hidden", borderRadius: 8 }}
            >
              <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width, height }}>
                <InviteCanvas format={format} background={background} texts={texts} />
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Náhled — {FORMATS[format].label}
            </p>
          </div>

          {variants.length > 0 ? (
            <div className="mt-4 w-full max-w-xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Vygenerovaná pozadí (klikni pro výběr)
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelected(i)}
                    className={`overflow-hidden rounded-lg border-2 ${
                      selected === i ? "border-primary" : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                    title={v.theme}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- malý náhled data URL */}
                    <img src={v.image} alt={v.theme} className="h-24 w-auto" />
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {/* Ovládání */}
        <aside className="order-1 space-y-6 lg:order-2">
          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            <Label htmlFor="theme">Téma události (česky)</Label>
            <Textarea
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              rows={3}
              placeholder="Např. podzimní společná procházka krajinou kolem Louky se psy a povídáním u ohně"
            />
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(FORMATS) as InviteFormat[]).map((f) => (
                <Button
                  key={f}
                  type="button"
                  size="sm"
                  variant={format === f ? "default" : "outline"}
                  onClick={() => setFormat(f)}
                >
                  {FORMATS[f].label}
                </Button>
              ))}
            </div>
            <Button type="button" className="w-full" onClick={onGenerate} disabled={generating || theme.trim().length < 3}>
              {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {generating ? "Generuji… (může trvat i půl minuty)" : "Vygenerovat pozadí"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Pozadí se generuje pro zvolený formát — pro Story/Reels vygeneruj zvlášť, ať se
              kompozice neořezává.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-semibold">Texty na pozvánce</p>
            <div className="space-y-2">
              <Label htmlFor="title">Název</Label>
              <Input id="title" value={texts.title} onChange={(e) => patch({ title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Heslo (stuha)</Label>
              <Input id="tagline" value={texts.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Datum (tabule)</Label>
              <Input id="date" value={texts.dateText} onChange={(e) => patch({ dateText: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="place">Místo</Label>
              <Input id="place" value={texts.placeText} onChange={(e) => patch({ placeText: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icons">Ikonky — oddělené čárkou (emoji + popisek)</Label>
              <Textarea id="icons" rows={2} value={texts.icons} onChange={(e) => patch({ icons: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footer">Patička</Label>
              <Input id="footer" value={texts.footer} onChange={(e) => patch({ footer: e.target.value })} />
            </div>
            <p className="text-xs text-muted-foreground">Prázdné pole = prvek se na pozvánce nezobrazí.</p>
          </div>

          <Button type="button" className="w-full" onClick={onDownload} disabled={exporting}>
            {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageDown className="mr-2 h-4 w-4" />}
            Stáhnout PNG ({width}×{height})
          </Button>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Download className="h-3 w-3" /> Stejný obrázek 9:16 použiješ pro Story i jako podklad Reels.
          </p>
        </aside>
      </div>

      {/* Offscreen plné vykreslení pro export */}
      <div aria-hidden style={{ position: "fixed", left: -20000, top: 0, pointerEvents: "none", opacity: 0 }}>
        <div ref={exportRef}>
          <InviteCanvas format={format} background={background} texts={texts} />
        </div>
      </div>
    </div>
  )
}
