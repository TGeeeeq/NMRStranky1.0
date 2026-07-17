import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import PozvankyView from "@/components/pozvanky/pozvanky-view"

// Skrytý interní nástroj — jen pro přihlášené adminy, mimo navigaci i index.
export const metadata: Metadata = {
  title: "Generátor pozvánek",
  description: "Interní nástroj pro tvorbu pozvánek na události Nech mě růst.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/pozvanky" },
}

// Generování pozadí přes Gemini může trvat i desítky sekund — zvedá limit
// server actions vyvolaných z této stránky (Vercel).
export const maxDuration = 60

export default async function PozvankyPage() {
  await requireAdmin()
  return <PozvankyView />
}
