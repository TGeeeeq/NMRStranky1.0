import Link from "next/link";
import { Container } from "./Container";
import AFLogo from "./AFLogo";
import { CookieSettingsButton } from "./CookieSettingsButton";
import { GooglePlayIcon } from "./BrandIcons";
import { LOUKARUN } from "@/lib/site";
import { getLocale } from "@/lib/i18n.server";
import { dict, pick } from "@/lib/i18n";

export async function Footer() {
  const locale = await getLocale();
  return (
    <footer className="bg-moss-deep text-cream">
      <Container className="py-10 text-center">
        <p className="text-sm text-cream/80">{pick(locale, dict.rightsReserved)}</p>
        <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
          <Link
            href="/gdpr"
            className="text-cream/90 underline-offset-4 hover:underline"
          >
            {pick(locale, dict.privacyPolicy)}
          </Link>
          <span aria-hidden="true" className="text-cream/40">
            •
          </span>
          <Link
            href="/vop"
            className="text-cream/90 underline-offset-4 hover:underline"
          >
            {pick(locale, dict.terms)}
          </Link>
          <span aria-hidden="true" className="text-cream/40">
            •
          </span>
          <CookieSettingsButton />
        </p>
        <p className="mt-6">
          <a
            href={LOUKARUN.googlePlay}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-pill border border-cream/20 px-4 py-2 text-sm text-cream/70 transition-colors hover:border-cream/40 hover:text-cream"
          >
            <GooglePlayIcon
              size={16}
              className="text-cream/70 transition-colors group-hover:text-cream"
            />
            <span>
              {pick(locale, dict.playPrefix)}{" "}
              <span className="font-serif tracking-wide">Louka&nbsp;Run</span>{" "}
              {pick(locale, dict.playSuffix)}
            </span>
          </a>
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
              {pick(locale, dict.madeBy)}{" "}
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
