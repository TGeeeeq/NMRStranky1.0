"use client"

import type { Slide, SlideType } from "@/lib/carousel-schema"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const TYPE_LABELS: Record<SlideType, string> = {
  cover: "Úvodní (cover)",
  plant: "Druh / bylina",
  fact: "Zajímavost",
  tip: "Tip",
  outro: "Závěr / výzva",
  photo: "Fotografie",
}

/** Která pole se zobrazují pro který typ slajdu. */
const FIELDS: Record<SlideType, (keyof Slide)[]> = {
  cover: ["eyebrow", "title", "subtitle"],
  plant: ["status", "name", "latin", "fact", "use", "warning"],
  fact: ["eyebrow", "title", "body"],
  tip: ["eyebrow", "title", "body"],
  outro: ["eyebrow", "title", "body", "cta"],
  photo: ["imageData", "imageCaption"],
}

const LABELS: Partial<Record<keyof Slide, string>> = {
  eyebrow: "Nadpisek (malý nahoře)",
  title: "Nadpis",
  subtitle: "Podtitulek",
  body: "Text",
  status: "Štítek stavu (např. „Invazní druh“)",
  name: "Název druhu",
  latin: "Latinský název",
  fact: "Zajímavost",
  use: "K čemu je dobrá?",
  warning: "Bezpečnostní varování",
  cta: "Výzva k akci (tlačítko)",
  imageData: "Fotografie",
  imageCaption: "Popisek fotky",
}

const MULTILINE: (keyof Slide)[] = ["subtitle", "body", "fact", "use", "warning"]

export function EditorPanel({
  slide,
  onChange,
}: {
  slide: Slide
  onChange: (patch: Partial<Slide>) => void
}) {
  const fields = FIELDS[slide.type] ?? FIELDS.fact

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Typ slajdu</Label>
        <Select value={slide.type} onValueChange={(v) => onChange({ type: v as SlideType })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(TYPE_LABELS) as SlideType[]).map((t) => (
              <SelectItem key={t} value={t}>
                {TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {fields.map((field) => {
        const value = (slide[field] as string | null) ?? ""
        const isWarning = field === "warning"

        if (field === "imageData") {
          return (
            <div key={field} className="space-y-2">
              <Label>{LABELS[field] ?? field}</Label>
              {value ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={value}
                  alt="Náhled fotky"
                  className="h-40 w-full rounded-md border object-cover"
                />
              ) : (
                <p className="text-xs text-muted-foreground">
                  Nahrajte fotografii (JPG / PNG). Uloží se přímo do karuselu a exportuje se do obrázku.
                </p>
              )}
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () => onChange({ imageData: reader.result as string })
                    reader.readAsDataURL(file)
                    e.target.value = ""
                  }}
                />
                {value ? (
                  <button
                    type="button"
                    className="shrink-0 text-xs text-muted-foreground underline-offset-2 hover:underline"
                    onClick={() => onChange({ imageData: "" })}
                  >
                    Odebrat
                  </button>
                ) : null}
              </div>
            </div>
          )
        }

        return (
          <div key={field} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{LABELS[field] ?? field}</Label>
              {isWarning ? (
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  Zobrazit
                  <Switch
                    checked={slide.warning != null}
                    onCheckedChange={(on) => onChange({ warning: on ? value || "Doplňte varování…" : null })}
                  />
                </span>
              ) : null}
            </div>
            {MULTILINE.includes(field) ? (
              <Textarea
                value={value}
                rows={field === "body" || field === "fact" || field === "use" ? 4 : 2}
                placeholder={LABELS[field]}
                disabled={isWarning && slide.warning == null}
                onChange={(e) => onChange({ [field]: e.target.value } as Partial<Slide>)}
              />
            ) : (
              <Input
                value={value}
                placeholder={LABELS[field]}
                onChange={(e) => onChange({ [field]: e.target.value } as Partial<Slide>)}
              />
            )}
          </div>
        )
      })}

      <div className="space-y-2">
        <Label>Zarovnání tohoto slajdu</Label>
        <Select
          value={slide.align ?? "auto"}
          onValueChange={(v) => onChange({ align: v === "auto" ? undefined : (v as "left" | "center") })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Podle karuselu</SelectItem>
            <SelectItem value="left">Vlevo</SelectItem>
            <SelectItem value="center">Na střed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
