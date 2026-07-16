import type { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/db/queries";

const BASE = "https://nechmerust.org";

const routes = [
  "",
  "/seno",
  "/o-nas",
  "/vyrocni-zprava-2025",
  "/jak-se-zapojit",
  "/novinky",
  "/zvireci-obyvatele",
  "/udalosti",
  "/kontakt",
  "/galerie",
  "/loukarun",
  "/obchod",
  "/virtualni-adopce",
  "/prispet-kryptem",
  "/putovani-se-zviraty",
  "/vop",
  "/gdpr",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency:
      path === "" || path === "/novinky" || path === "/seno" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/seno" ? 0.9 : 0.7,
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await getActiveProducts({});
    productEntries = products.map((p) => ({
      url: `${BASE}/obchod/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // Bez DB (např. při buildu bez DATABASE_URL) vrátíme aspoň statické stránky.
  }

  return [...staticEntries, ...productEntries];
}
