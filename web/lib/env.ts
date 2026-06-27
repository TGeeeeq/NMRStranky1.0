import "server-only";

function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}
function opt(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  databaseUrl: () => req("DATABASE_URL"),
  sessionSecret: () => req("SESSION_SECRET"),
  smtp: () => ({
    host: opt("SMTP_HOST", "smtp.forpsi.com"),
    port: Number(opt("SMTP_PORT", "587")),
    secure: opt("SMTP_SECURE", "tls") === "ssl",
    user: opt("SMTP_USERNAME", "info@nechmerust.org"),
    pass: opt("SMTP_PASSWORD"),
    fromEmail: opt("SMTP_FROM_EMAIL", "info@nechmerust.org"),
    fromName: opt("SMTP_FROM_NAME", "Nech mě růst"),
  }),
  bank: () => ({
    name: opt("BANK_NAME"),
    account: opt("BANK_ACCOUNT"),
    iban: opt("BANK_IBAN"),
    swift: opt("BANK_SWIFT"),
  }),
  orderPrefix: () => (opt("ORDER_PREFIX", "NMR").toUpperCase().replace(/[^A-Z0-9]/g, "") || "NMR"),
  adminNotificationEmail: () => opt("ADMIN_NOTIFICATION_EMAIL", opt("SMTP_FROM_EMAIL", "info@nechmerust.org")),
};
