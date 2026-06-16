import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
