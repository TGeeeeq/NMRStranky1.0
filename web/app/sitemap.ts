import type { MetadataRoute } from "next";

const BASE = "https://nechmerust.org";

const routes = [
  "",
  "/o-nas",
  "/vyrocni-zprava-2025",
  "/jak-se-zapojit",
  "/novinky",
  "/zvireci-obyvatele",
  "/udalosti",
  "/kontakt",
  "/galerie",
  "/obchod",
  "/virtualni-adopce",
  "/prispet-kryptem",
  "/putovani-se-zviraty",
  "/vop",
  "/gdpr",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: path === "" || path === "/novinky" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
