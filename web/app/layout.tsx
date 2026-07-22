import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { MotionProvider } from "@/components/MotionProvider";
import { CartProvider } from "@/components/shop/CartProvider";
import { LeaveCartGuard } from "@/components/LeaveCartGuard";
import { CookieConsent } from "@/components/CookieConsent";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getLocale } from "@/lib/i18n.server";
import { dict, pick } from "@/lib/i18n";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    metadataBase: new URL("https://nechmerust.org"),
    title: {
      default: "Nech mě růst",
      template: "%s — Nech mě růst",
    },
    description: pick(locale, {
      cs: "Nezisková organizace s vizí tvorby rodového statku, kde žijeme v harmonii s přírodou, zvířaty i sebou navzájem.",
      en: "A non-profit with a vision of a homestead where we live in harmony with nature, animals and one another.",
    }),
    openGraph: {
      type: "website",
      siteName: "Nech mě růst z.s.",
      locale: locale === "en" ? "en_GB" : "cs_CZ",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} data-scroll-behavior="smooth" className="h-full">
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
        <LocaleProvider initialLocale={locale}>
          <MotionProvider>
            <CartProvider>
              <SmoothScroll />
              <Cursor />
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-moss focus:px-4 focus:py-2 focus:text-cream"
              >
                {pick(locale, dict.skipToContent)}
              </a>
              <Navbar />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
              <LeaveCartGuard />
              <CookieConsent />
            </CartProvider>
          </MotionProvider>
        </LocaleProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
