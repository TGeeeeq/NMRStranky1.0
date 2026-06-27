"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"
import type { Caption } from "@/lib/carousel-schema"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

/** Spojí text popisku a hashtagy do jednoho bloku ke zkopírování. */
export function composeCaption(c: Caption): string {
  const tags = c.hashtags.filter(Boolean).join(" ")
  return tags ? `${c.text.trim()}\n\n${tags}` : c.text.trim()
}

export function CaptionsPanel({
  captions,
  onChange,
}: {
  captions: Caption[]
  onChange: (index: number, patch: Partial<Caption>) => void
}) {
  const [copied, setCopied] = useState<number | null>(null)

  const copy = async (i: number) => {
    const text = composeCaption(captions[i])
    try {
      await navigator.clipboard.writeText(text)
      setCopied(i)
      toast.success("Popisek zkopírován do schránky")
      setTimeout(() => setCopied((c) => (c === i ? null : c)), 2000)
    } catch {
      toast.error("Kopírování se nezdařilo")
    }
  }

  if (captions.length === 0) {
    return <p className="text-sm text-muted-foreground">Tento karusel zatím nemá žádné popisky.</p>
  }

  return (
    <div className="space-y-6">
      {captions.map((c, i) => {
        const full = composeCaption(c)
        return (
          <div key={i} className="space-y-3 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <Input
                value={c.label}
                className="h-8 max-w-[60%] border-0 px-0 text-sm font-semibold shadow-none focus-visible:ring-0"
                onChange={(e) => onChange(i, { label: e.target.value })}
              />
              <Button size="sm" variant="secondary" onClick={() => copy(i)}>
                {copied === i ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                Kopírovat
              </Button>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Text popisku</Label>
              <Textarea
                value={c.text}
                rows={5}
                onChange={(e) => onChange(i, { text: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Hashtagy (oddělené mezerou)</Label>
              <Textarea
                value={c.hashtags.join(" ")}
                rows={2}
                placeholder="#csoptrosecnici #ochranaprirody"
                onChange={(e) =>
                  onChange(i, {
                    hashtags: e.target.value.split(/\s+/).map((t) => t.trim()).filter(Boolean),
                  })
                }
              />
            </div>

            <p className="text-right text-xs text-muted-foreground">{full.length} znaků celkem</p>
          </div>
        )
      })}
    </div>
  )
}
