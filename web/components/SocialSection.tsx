import { Mail } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { InstagramIcon, FacebookIcon } from "@/components/BrandIcons";
import { SOCIAL } from "@/lib/site";
import { cn } from "@/lib/cn";
import { getLocale } from "@/lib/i18n.server";
import { dict, pick } from "@/lib/i18n";

const links = [
  { icon: InstagramIcon, label: "Instagram", href: SOCIAL.instagram, external: true },
  { icon: FacebookIcon, label: "Facebook", href: SOCIAL.facebook, external: true },
  { icon: Mail, label: "Email", href: SOCIAL.email, external: false },
];

/** Reusable "Sledujte nás" block used at the bottom of every page. */
export async function SocialSection({ tone = "light" }: { tone?: "light" | "alt" }) {
  const locale = await getLocale();
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden py-20 sm:py-24",
        tone === "alt" ? "bg-surface-alt" : "bg-surface",
      )}
    >
      <div
        aria-hidden
        className="blob blob-accent blob-morph left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 opacity-20"
      />
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={pick(locale, dict.stayInTouch)}
            title={pick(locale, dict.followUs)}
          />
        </Reveal>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {links.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.external ? "_blank" : undefined}
              rel={s.external ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-3 rounded-pill border border-border bg-surface px-6 py-3 font-medium text-moss-deep shadow-soft transition-transform hover:-translate-y-0.5"
            >
              <s.icon size={20} /> {s.label}
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
