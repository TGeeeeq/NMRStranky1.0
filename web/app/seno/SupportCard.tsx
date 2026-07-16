import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";

export type SupportWay = {
  icon: LucideIcon;
  title: string;
  text: string;
  cta: { label: string; href: string } | null;
  share?: boolean;
  /** Klíč pro Karlovy reakce na kliknutí (data-karel-react). */
  reactKey?: string;
};

/** Karta „další způsob podpory" — sdílená mezi vážnou a Karlovou verzí /seno. */
export function SupportCard({ way, className = "" }: { way: SupportWay; className?: string }) {
  const external = way.cta?.href.startsWith("http");
  const ctaClass =
    "mt-auto inline-flex w-fit items-center rounded-pill bg-moss px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-moss-deep";

  return (
    <article
      data-karel-react={way.reactKey}
      className={`flex h-full flex-col rounded-lg border border-border bg-surface p-7 shadow-soft transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lift ${className}`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-pill bg-moss/10 p-3 text-moss">
        <way.icon size={24} aria-hidden />
      </div>
      <h3 className="font-serif text-xl font-semibold text-moss-deep">{way.title}</h3>
      <p className="mb-5 mt-2 text-text-muted">{way.text}</p>
      {way.cta ? (
        external ? (
          <a href={way.cta.href} target="_blank" rel="noopener noreferrer" className={ctaClass}>
            {way.cta.label}
          </a>
        ) : (
          <Link href={way.cta.href} className={ctaClass}>
            {way.cta.label}
          </Link>
        )
      ) : null}
      {way.share ? <ShareButtons /> : null}
    </article>
  );
}
