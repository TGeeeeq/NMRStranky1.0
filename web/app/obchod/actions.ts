"use server";

import { headers } from "next/headers";
import { placeOrder } from "@/lib/orders";
import { sendOrderEmails } from "@/lib/email";
import { countRecentOrdersFromIp } from "@/lib/db/queries";
import { getLocale } from "@/lib/i18n.server";
import { pick } from "@/lib/i18n";

export async function createOrder(raw: unknown): Promise<{ ok: true; orderNumber: string } | { ok: false; error: string }> {
  const h = await headers();
  // Netlify nastavuje x-nf-client-connection-ip z reálného spojení; x-forwarded-for
  // je klientem podvrhnutelný (útočník by tak obešel rate limit novou „přihrádkou").
  const ip = (h.get("x-nf-client-connection-ip") ?? "").trim()
    || (h.get("x-forwarded-for") ?? "").split(",")[0].trim()
    || "0.0.0.0";

  if ((await countRecentOrdersFromIp(ip, 60)) >= 5) {
    const locale = await getLocale();
    return { ok: false, error: pick(locale, { cs: "Příliš mnoho požadavků. Zkuste to prosím za chvíli.", en: "Too many requests. Please try again in a moment." }) };
  }

  const res = await placeOrder(raw, ip);
  if (!res.ok) return res;

  try {
    await sendOrderEmails({
      orderNumber: res.order.orderNumber, variableSymbol: res.order.variableSymbol,
      customerName: res.order.customerName, customerEmail: res.order.customerEmail,
      customerPhone: res.order.customerPhone, shippingAddress: res.order.shippingAddress,
      notes: res.order.notes, items: res.order.items, total: res.order.total,
    });
  } catch (e) {
    console.error("[createOrder email]", e); // order already saved; don't fail
  }
  return { ok: true, orderNumber: res.order.orderNumber };
}
