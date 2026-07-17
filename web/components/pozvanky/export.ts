import { toBlob } from "html-to-image"
import { slugify } from "@/components/studio/export"
import { FORMATS, type InviteFormat } from "./formats"

/** Uzel pozvánky → PNG Blob v přesné velikosti daného formátu. */
export async function inviteToPng(node: HTMLElement, format: InviteFormat): Promise<Blob> {
  const { width, height } = FORMATS[format]
  const blob = await toBlob(node, {
    width,
    height,
    pixelRatio: 1,
    cacheBust: true,
    backgroundColor: "#e8d9b0",
  })
  if (!blob) throw new Error("Nepodařilo se vykreslit pozvánku do obrázku.")
  return blob
}

/** Stáhne pozvánku jako PNG (např. pozvanka-loukada-post.png). */
export async function downloadInvite(node: HTMLElement, title: string, format: InviteFormat) {
  const blob = await inviteToPng(node, format)
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `pozvanka-${slugify(title)}-${format}.png`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}
