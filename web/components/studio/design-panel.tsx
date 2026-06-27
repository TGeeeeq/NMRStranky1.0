"use client"

import type { Carousel, Theme } from "@/lib/carousel-schema"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { THEME_LABELS } from "./theme"

export function DesignPanel({
  carousel,
  onChange,
}: {
  carousel: Carousel
  onChange: (patch: Partial<Carousel>) => void
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Barevné téma</Label>
        <Select value={carousel.theme} onValueChange={(v) => onChange({ theme: v as Theme })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(THEME_LABELS) as Theme[]).map((t) => (
              <SelectItem key={t} value={t}>
                {THEME_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Akcentní barva</Label>
        <div className="flex items-center gap-3">
          <Input
            type="color"
            className="h-10 w-16 cursor-pointer p-1"
            value={carousel.accent ?? "#e8b04b"}
            onChange={(e) => onChange({ accent: e.target.value })}
          />
          <Input
            value={carousel.accent ?? ""}
            placeholder="výchozí dle tématu"
            onChange={(e) => onChange({ accent: e.target.value || undefined })}
          />
          {carousel.accent ? (
            <button
              type="button"
              className="whitespace-nowrap text-xs text-muted-foreground underline"
              onClick={() => onChange({ accent: undefined })}
            >
              reset
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Velikost písma</Label>
          <span className="text-xs text-muted-foreground">{Math.round(carousel.fontScale * 100)} %</span>
        </div>
        <Slider
          min={0.7}
          max={1.4}
          step={0.05}
          value={[carousel.fontScale]}
          onValueChange={([v]) => onChange({ fontScale: v })}
        />
      </div>

      <div className="space-y-2">
        <Label>Výchozí zarovnání</Label>
        <Select value={carousel.align} onValueChange={(v) => onChange({ align: v as "left" | "center" })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Vlevo</SelectItem>
            <SelectItem value="center">Na střed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 rounded-lg border border-border p-4">
        <div className="text-sm font-semibold">Branding</div>
        <div className="flex items-center justify-between">
          <Label className="font-normal">Logo Nech mě růst</Label>
          <Switch
            checked={carousel.branding.csopLogo}
            onCheckedChange={(on) => onChange({ branding: { ...carousel.branding, csopLogo: on } })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-normal">Publicita (MŽP / SFŽP / AOPK)</Label>
            <p className="text-xs text-muted-foreground">Zapněte u dotovaných výstupů.</p>
          </div>
          <Switch
            checked={carousel.branding.publicita}
            onCheckedChange={(on) => onChange({ branding: { ...carousel.branding, publicita: on } })}
          />
        </div>
      </div>
    </div>
  )
}
