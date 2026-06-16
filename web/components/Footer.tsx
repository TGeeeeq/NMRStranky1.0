import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="bg-moss-deep text-cream">
      <Container className="py-10 text-center">
        <p className="text-sm text-cream/80">
          © 2026 Nech mě růst z.s. Všechna práva vyhrazena. • Napsáno s láskou
          k přírodě a zvířatům.
        </p>
        <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
          <Link
            href="/gdpr"
            className="text-cream/90 underline-offset-4 hover:underline"
          >
            Zásady ochrany osobních údajů
          </Link>
          <span aria-hidden="true" className="text-cream/40">
            •
          </span>
          <Link
            href="/vop"
            className="text-cream/90 underline-offset-4 hover:underline"
          >
            Obchodní podmínky
          </Link>
        </p>
      </Container>
    </footer>
  );
}
