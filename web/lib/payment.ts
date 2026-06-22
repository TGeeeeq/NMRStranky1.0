import { randomBytes, randomInt } from "node:crypto";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function generateOrderNumber(prefix: string, inject?: { date?: Date; rand?: string }): string {
  const d = inject?.date ?? new Date();
  const ymd = `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}`;
  const rand = (inject?.rand ?? randomBytes(3).toString("hex")).toUpperCase();
  return `${prefix}-${ymd}-${rand}`;
}

export function generateVariableSymbol(orderNumber: string): string {
  const digits = orderNumber.replace(/\D/g, "");
  if (!digits) return String(randomInt(1_000_000_000, 9_999_999_999));
  return digits.slice(0, 10);
}
