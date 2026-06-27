import type { Metadata } from "next"
import StudioView from "./studio-view"

// Skrytý interní nástroj – není v navigaci ani v indexu vyhledávačů.
export const metadata: Metadata = {
  title: "Karusel studio",
  description: "Interní nástroj pro tvorbu instagramových karuselů Nech mě růst.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/studio" },
}

export default function StudioPage() {
  return <StudioView />
}
