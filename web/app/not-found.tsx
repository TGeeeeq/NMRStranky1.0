import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Karel404 } from "@/components/karel/Karel404";

export const metadata: Metadata = {
  title: "Stránka nenalezena",
  description: "Tato stránka neexistuje nebo byla přesunuta.",
  robots: { index: false, follow: true },
};

const links = [
  { href: "/", label: "Domů" },
  { href: "/o-nas", label: "O nás" },
  { href: "/zvireci-obyvatele", label: "Zvířecí obyvatelé" },
  { href: "/obchod", label: "Obchod" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center bg-cream py-20">
      <Container className="text-center">
        <p className="font-serif text-6xl font-semibold text-moss">404</p>
        <div className="mt-6 flex justify-center">
          <Karel404 />
        </div>
        <h1 className="mt-6 font-serif text-2xl font-semibold text-moss-deep sm:text-3xl">
          Tuhle stránku jsme nenašli
        </h1>
        <p className="mx-auto mt-3 max-w-md text-text-muted">
          Možná byla přesunuta nebo už neexistuje. Hlídání téhle slepé uličky
          mezitím převzal Karel. Zkuste některý z odkazů níže — na Louce se
          vždycky něco děje.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-pill border border-border bg-surface px-5 py-2.5 text-sm font-medium text-moss-deep transition hover:bg-moss hover:text-cream"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
