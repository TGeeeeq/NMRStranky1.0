"use server";

import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { GAME_COOKIE, GAME_COOKIE_TTL, normalizeInviteCode, sealGameAccess } from "@/lib/game-access";
import { getLocale } from "@/lib/i18n.server";
import { pick } from "@/lib/i18n";

export type RedeemState = { error?: string };

export async function redeemGameCode(_prev: RedeemState, formData: FormData): Promise<RedeemState> {
  const locale = await getLocale();
  const raw = String(formData.get("code") ?? "");
  const code = normalizeInviteCode(raw);
  if (!code) return { error: pick(locale, { cs: "Zadej prosím kód.", en: "Please enter a code." }) };

  const h = await headers();
  const clientIp = (h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const limit = rateLimit(`game-code:ip:${clientIp}`, 10, 300);
  if (!limit.allowed) {
    return {
      error: pick(locale, {
        cs: "Příliš mnoho pokusů. Zkus to prosím za pár minut.",
        en: "Too many attempts. Please try again in a few minutes.",
      }),
    };
  }

  const rows = await db
    .select()
    .from(schema.gameInvites)
    .where(and(eq(schema.gameInvites.code, code), isNull(schema.gameInvites.revokedAt)));
  const invite = rows[0];
  if (!invite) {
    return {
      error: pick(locale, {
        cs: "Tenhle kód neznáme. Zkontroluj překlepy, nebo nám napiš na info@nechmerust.org.",
        en: "We don't recognize this code. Check for typos, or write to us at info@nechmerust.org.",
      }),
    };
  }

  await db
    .update(schema.gameInvites)
    .set({ redeemCount: sql`${schema.gameInvites.redeemCount} + 1`, lastRedeemedAt: new Date() })
    .where(eq(schema.gameInvites.id, invite.id));

  const seal = await sealGameAccess({ inviteId: invite.id });
  (await cookies()).set(GAME_COOKIE, seal, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: GAME_COOKIE_TTL,
    path: "/loukarun",
  });

  redirect("/loukarun/app/index.html");
}
