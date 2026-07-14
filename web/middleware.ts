import { NextResponse, type NextRequest } from "next/server";
import { GAME_COOKIE, unsealGameAccess } from "@/lib/game-access";

// Hra Louka Run (statické soubory v public/loukarun/app/) je jen pro držitele
// pozvánkového kódu — viz /loukarun. Middleware běží i pro public/ soubory.
export const config = {
  matcher: ["/loukarun/app/:path*"],
};

// Soubory, které musí zůstat veřejné i bez pozvánkového kódu:
// - soukromi.html: URL pro Google Play listing
// - sw.js / manifest: service worker a manifest se nesmí přesměrovat, jinak
//   prohlížeč odmítne aktualizaci SW a hráč navždy uvízne na staré cache
const PUBLIC_PATHS = new Set([
  "/loukarun/app/soukromi.html",
  "/loukarun/app/sw.js",
  "/loukarun/app/manifest.webmanifest",
]);

export async function middleware(req: NextRequest) {
  if (PUBLIC_PATHS.has(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const seal = req.cookies.get(GAME_COOKIE)?.value;
  if (seal && (await unsealGameAccess(seal))) {
    return NextResponse.next();
  }

  const dest = new URL("/loukarun", req.url);
  dest.searchParams.set("pristup", "kod");
  return NextResponse.redirect(dest);
}
