"use server";

import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { GAME_COOKIE, GAME_COOKIE_TTL, normalizeInviteCode, sealGameAccess } from "@/lib/game-access";

export type RedeemState = { error?: string };

export async function redeemGameCode(_prev: RedeemState, formData: FormData): Promise<RedeemState> {
  const raw = String(formData.get("code") ?? "");
  const code = normalizeInviteCode(raw);
  if (!code) return { error: "Zadej prosím kód." };

  const h = await headers();
  const clientIp = (h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const limit = rateLimit(`game-code:ip:${clientIp}`, 10, 300);
  if (!limit.allowed) {
    return { error: "Příliš mnoho pokusů. Zkus to prosím za pár minut." };
  }

  const rows = await db
    .select()
    .from(schema.gameInvites)
    .where(and(eq(schema.gameInvites.code, code), isNull(schema.gameInvites.revokedAt)));
  const invite = rows[0];
  if (!invite) {
    return { error: "Tenhle kód neznáme. Zkontroluj překlepy, nebo nám napiš na info@nechmerust.org." };
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
