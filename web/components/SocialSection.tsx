import { Mail } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { InstagramIcon, FacebookIcon } from "@/components/BrandIcons";
import { SOCIAL } from "@/lib/site";

const links = [
  { icon: InstagramIcon, label: "Instagram", href: SOCIAL.instagram, external: true },
  { icon: FacebookIcon, label: "Facebook", href: SOCIAL.facebook, external: true },
  { icon: Mail, label: "Email", href: SOCIAL.email, external: false },
];

/** Reusable "Sledujte nás" block used at the bottom of every page. */
export function SocialSection({ tone = "light" }: { tone?: "light" | "alt" }) {
  return (
    <section className={tone === "alt" ? "bg-surface-alt py-20 sm:py-24" : "bg-surface py-20 sm:py-24"}>
      <Container>
        <Reveal>
          <SectionHeader eyebrow="Buďte v kontaktu" title="Sledujte nás" />
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
