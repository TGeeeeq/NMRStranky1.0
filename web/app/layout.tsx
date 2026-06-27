import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { MotionProvider } from "@/components/MotionProvider";
import { CartProvider } from "@/components/shop/CartProvider";
import { LeaveCartGuard } from "@/components/LeaveCartGuard";

export const metadata: Metadata = {
  metadataBase: new URL("https://nechmerust.org"),
  title: {
    default: "Nech mě růst",
    template: "%s — Nech mě růst",
  },
  description:
    "Nezisková organizace s vizí tvorby rodového statku, kde žijeme v harmonii s přírodou, zvířaty i sebou navzájem.",
  openGraph: {
    type: "website",
    siteName: "Nech mě růst z.s.",
    locale: "cs_CZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" data-scroll-behavior="smooth" className="h-full">
      <head>
        {/* Preload the latin-ext subsets — Czech diacritics render without FOUT */}
        <link
          rel="preload"
          href="/fonts/plus-jakarta-sans-var-latin-ext.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/fraunces-var-latin-ext.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <MotionProvider>
          <CartProvider>
            <SmoothScroll />
            <Cursor />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-moss focus:px-4 focus:py-2 focus:text-cream"
            >
              Přeskočit na obsah
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <LeaveCartGuard />
          </CartProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
