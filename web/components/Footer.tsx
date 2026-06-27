import Link from "next/link";
import { Container } from "./Container";
import AFLogo from "./AFLogo";

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
        <p className="mt-6">
          <a
            href="https://www.antoninfigueroa.cz"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-sm text-cream/60 transition-colors hover:text-cream"
          >
            <AFLogo
              size={38}
              className="ring-1 ring-[#d4a45a]/20 transition duration-500 ease-out group-hover:scale-105 group-hover:ring-[#d4a45a]/45 group-hover:shadow-[0_0_22px_rgba(212,164,90,0.28)]"
            />
            <span>
              web vytvořil{" "}
              <span className="font-serif tracking-wide group-hover:text-cream">
                Antonín Figueroa
              </span>
            </span>
          </a>
        </p>
      </Container>
    </footer>
  );
}
