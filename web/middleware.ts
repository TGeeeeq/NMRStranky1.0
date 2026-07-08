import { NextResponse, type NextRequest } from "next/server";
import { GAME_COOKIE, unsealGameAccess } from "@/lib/game-access";

// Hra Louka Run (statické soubory v public/loukarun/app/) je jen pro držitele
// pozvánkového kódu — viz /loukarun. Middleware běží i pro public/ soubory.
export const config = {
  matcher: ["/loukarun/app/:path*"],
};

export async function middleware(req: NextRequest) {
  // Zásady soukromí musí zůstat veřejné (URL pro Google Play listing).
  if (req.nextUrl.pathname === "/loukarun/app/soukromi.html") {
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
