import "server-only";
import nodemailer from "nodemailer";
import { env } from "./env";
import { formatCzk } from "./money";

export type OrderEmailData = {
  orderNumber: string; variableSymbol: string;
  customerName: string; customerEmail: string; customerPhone: string;
  shippingAddress: string; notes: string;
  items: { name: string; quantity: number; lineTotal: number }[];
  total: number;
};

function bankBlock(): string {
  const b = env.bank();
  return [
    b.name ? `Banka:           ${b.name}` : "",
    b.account ? `Číslo účtu:      ${b.account}` : "",
    b.iban ? `IBAN:            ${b.iban}` : "",
    b.swift ? `SWIFT:           ${b.swift}` : "",
  ].filter(Boolean).join("\n");
}

function itemsText(items: OrderEmailData["items"]): string {
  return items.map((i) => `- ${i.name} (${i.quantity}×): ${formatCzk(i.lineTotal)}`).join("\n");
}

export async function sendOrderEmails(o: OrderEmailData): Promise<void> {
  const s = env.smtp();
  const transport = nodemailer.createTransport({
    host: s.host, port: s.port, secure: s.port === 465,
    auth: { user: s.user, pass: s.pass },
  });
  const from = `"${s.fromName}" <${s.fromEmail}>`;
  const totalFmt = formatCzk(o.total);

  const customerBody =
`Děkujeme za vaši objednávku!

Číslo objednávky: ${o.orderNumber}

Položky:
${itemsText(o.items)}

Celkem: ${totalFmt}

PLATEBNÍ ÚDAJE (bankovní převod):
${bankBlock()}
Variabilní symbol: ${o.variableSymbol}
Částka:            ${totalFmt}

Jakmile platbu obdržíme, začneme objednávku připravovat.

S úctou,
Tým Nech mě růst`;

  const adminBody =
`NOVÁ OBJEDNÁVKA: ${o.orderNumber}

Zákazník: ${o.customerName} <${o.customerEmail}>
Telefon:  ${o.customerPhone}
Adresa:   ${o.shippingAddress}

Položky:
${itemsText(o.items)}

Celkem: ${totalFmt}
Variabilní symbol: ${o.variableSymbol}

Poznámka:
${o.notes}`;

  await Promise.all([
    transport.sendMail({ from, to: o.customerEmail, subject: `Potvrzení objednávky ${o.orderNumber} – Nech mě růst`, text: customerBody }),
    transport.sendMail({ from, to: env.adminNotificationEmail(), subject: `NOVÁ OBJEDNÁVKA: ${o.orderNumber}`, text: adminBody }),
  ]);
}
