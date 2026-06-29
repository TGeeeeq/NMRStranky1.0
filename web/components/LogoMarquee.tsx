import Image from "next/image";

export type PartnerLogo = { name: string; logo: string; href: string };

/**
 * Infinite, hover-pausable logo marquee (pure CSS, see globals.css `marquee`).
 * The list is repeated to fill the track and doubled for a seamless loop; only
 * each logo's first occurrence is exposed to assistive tech / keyboard, the rest
 * are decorative. Falls back to a static row under prefers-reduced-motion.
 */
export function LogoMarquee({ logos }: { logos: PartnerLogo[] }) {
  const filled = logos.length >= 6 ? logos : [...logos, ...logos, ...logos];
  const loop = [...filled, ...filled];
  const seen = new Set<string>();

  return (
    <div
      className="marquee-track relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
    >
      <ul className="animate-marquee flex w-max items-center gap-10">
        {loop.map((p, i) => {
          const decorative = seen.has(p.name);
          seen.add(p.name);
          return (
            <li key={i} className="shrink-0">
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-hidden={decorative || undefined}
                tabIndex={decorative ? -1 : undefined}
                className="flex h-28 w-48 items-center justify-center rounded-lg border border-border bg-surface p-5 shadow-soft transition-transform hover:-translate-y-1 hover:border-accent hover:shadow-lift"
              >
                <Image
                  src={p.logo}
                  alt={decorative ? "" : `Logo ${p.name}`}
                  width={160}
                  height={80}
                  className="max-h-16 w-auto max-w-[150px] object-contain"
                />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
