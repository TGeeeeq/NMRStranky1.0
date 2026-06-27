import { toBlob } from "html-to-image"
import JSZip from "jszip"
import { SLIDE_H, SLIDE_W } from "@/lib/carousel-schema"

const PNG_OPTS = {
  width: SLIDE_W,
  height: SLIDE_H,
  pixelRatio: 1,
  cacheBust: true,
  // bílé pozadí jen jako pojistka; slajd má vlastní gradient
  backgroundColor: "#ffffff",
}

/** Bezpečný název souboru z tématu karuselu. */
export function slugify(input: string): string {
  return (
    input
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "karusel"
  )
}

/** Jeden uzel slajdu → PNG Blob (přesně 1080×1350). */
export async function nodeToPng(node: HTMLElement): Promise<Blob> {
  const blob = await toBlob(node, PNG_OPTS)
  if (!blob) throw new Error("Nepodařilo se vykreslit slajd do obrázku.")
  return blob
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  // dej prohlížeči čas blob uložit, pak ho uvolni
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

/** Stáhne jeden slajd jako PNG. */
export async function downloadSlide(node: HTMLElement, topic: string, index: number) {
  const blob = await nodeToPng(node)
  triggerDownload(blob, `${slugify(topic)}-${String(index + 1).padStart(2, "0")}.png`)
}

/** Stáhne všechny slajdy jako jeden ZIP. */
export async function downloadZip(nodes: HTMLElement[], topic: string) {
  const zip = new JSZip()
  const slug = slugify(topic)
  for (let i = 0; i < nodes.length; i++) {
    const blob = await nodeToPng(nodes[i])
    zip.file(`${slug}-${String(i + 1).padStart(2, "0")}.png`, blob)
  }
  const out = await zip.generateAsync({ type: "blob" })
  triggerDownload(out, `${slug}.zip`)
}

/** Všechny slajdy → datové URL (base64) pro odeslání na backend (publikace). */
export async function nodesToDataUrls(nodes: HTMLElement[]): Promise<string[]> {
  const urls: string[] = []
  for (const node of nodes) {
    const blob = await nodeToPng(node)
    urls.push(await blobToDataUrl(blob))
  }
  return urls
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Chyba převodu obrázku."))
    reader.readAsDataURL(blob)
  })
}
