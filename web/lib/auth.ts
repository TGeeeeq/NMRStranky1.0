import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "./env";

export interface SessionData {
  adminId?: number;
  username?: string;
}

const SESSION_TTL = 60 * 60 * 12; // 12 hodin

export const sessionOptions: SessionOptions = {
  password: env.sessionSecret(),
  cookieName: "nmr_admin",
  ttl: SESSION_TTL,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_TTL,
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function requireAdmin(): Promise<SessionData> {
  const session = await getSession();
  if (!session.adminId) redirect("/admin/login");
  return session;
}
