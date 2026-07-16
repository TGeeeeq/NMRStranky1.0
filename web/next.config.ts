import type { NextConfig } from "next";
import path from "node:path";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // Pin the workspace root to this app (stray lockfiles exist higher up the tree).
  turbopack: {
    root: path.join(__dirname),
  },

  // Default deviceSizes go up to 3840, so retina desktops pull a ~640 kB hero
  // variant. 2048px upscaled is indistinguishable under the hero overlays and
  // roughly halves the LCP payload on those screens.
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // Přesměrování starých adres z původního PHP/HTML webu na nové Next.js routy,
  // aby přestaly vracet 404 (viz Google Search Console). Pořadí je důležité —
  // konkrétní pravidla musí být před obecnými zástupnými.
  async redirects() {
    return [
      // Domovská stránka a landing varianty
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/index", destination: "/", permanent: true },
      { source: "/landing", destination: "/", permanent: true },
      { source: "/landing.html", destination: "/", permanent: true },

      // Zaniklá stránka Mezilesy → nejbližší obsah
      { source: "/mezilesy", destination: "/o-nas", permanent: true },
      { source: "/mezilesy.html", destination: "/o-nas", permanent: true },

      // Obchod – změněná struktura URL
      { source: "/obchod/index.html", destination: "/obchod", permanent: true },
      { source: "/obchod/checkout", destination: "/obchod/pokladna", permanent: true },
      { source: "/obchod/checkout.html", destination: "/obchod/pokladna", permanent: true },
      { source: "/obchod/payment-return.php", destination: "/obchod", permanent: true },

      // Detail produktu: /obchod/product-detail?product=<slug> → /obchod/<slug>
      {
        source: "/obchod/product-detail",
        has: [{ type: "query", key: "product", value: "(?<product>[^&]+)" }],
        destination: "/obchod/:product",
        permanent: true,
      },
      {
        source: "/obchod/product-detail.html",
        has: [{ type: "query", key: "product", value: "(?<product>[^&]+)" }],
        destination: "/obchod/:product",
        permanent: true,
      },
      { source: "/obchod/product-detail", destination: "/obchod", permanent: true },
      { source: "/obchod/product-detail.html", destination: "/obchod", permanent: true },

      // Obecná pravidla pro marketingové stránky: /<slug>.html a /<slug>.php → /<slug>
      // (o-nas, kontakt, galerie, gdpr, jak-se-zapojit, novinky, prispet-kryptem,
      //  putovani-se-zviraty, udalosti, virtualni-adopce, vop, zvireci-obyvatele).
      { source: "/:slug.html", destination: "/:slug", permanent: true },
      { source: "/:slug.php", destination: "/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
