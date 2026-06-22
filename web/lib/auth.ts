import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "./env";

export interface SessionData {
  adminId?: number;
  username?: string;
}

export const sessionOptions: SessionOptions = {
  password: env.sessionSecret(),
  cookieName: "nmr_admin",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
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
