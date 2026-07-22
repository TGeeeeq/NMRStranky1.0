import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Karel404 } from "@/components/karel/Karel404";
import { getLocale } from "@/lib/i18n.server";
import { pick } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, { cs: "Stránka nenalezena", en: "Page not found" }),
    description: pick(locale, {
      cs: "Tato stránka neexistuje nebo byla přesunuta.",
      en: "This page does not exist or has been moved.",
    }),
    robots: { index: false, follow: true },
  };
}

const links = [
  { href: "/", label: { cs: "Domů", en: "Home" } },
  { href: "/o-nas", label: { cs: "O nás", en: "About us" } },
  { href: "/zvireci-obyvatele", label: { cs: "Zvířecí obyvatelé", en: "Our animals" } },
  { href: "/obchod", label: { cs: "Obchod", en: "Shop" } },
  { href: "/kontakt", label: { cs: "Kontakt", en: "Contact" } },
];

export default async function NotFound() {
  const locale = await getLocale();
  return (
    <section className="flex min-h-[60vh] items-center bg-cream py-20">
      <Container className="text-center">
        <p className="font-serif text-6xl font-semibold text-moss">404</p>
        <div className="mt-6 flex justify-center">
          <Karel404 />
        </div>
        <h1 className="mt-6 font-serif text-2xl font-semibold text-moss-deep sm:text-3xl">
          {pick(locale, {
            cs: "Tuhle stránku jsme nenašli",
            en: "We couldn’t find this page",
          })}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-text-muted">
          {pick(locale, {
            cs: "Možná byla přesunuta nebo už neexistuje. Hlídání téhle slepé uličky mezitím převzal Karel. Zkuste některý z odkazů níže — na Louce se vždycky něco děje.",
            en: "It may have been moved or no longer exists. Karel the donkey has taken over guarding this dead end in the meantime. Try one of the links below — there’s always something happening at the Meadow.",
          })}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-pill border border-border bg-surface px-5 py-2.5 text-sm font-medium text-moss-deep transition hover:bg-moss hover:text-cream"
            >
              {pick(locale, l.label)}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
