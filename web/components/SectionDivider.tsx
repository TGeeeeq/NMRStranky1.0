import { cn } from "@/lib/cn";

/**
 * Organic wave that softens the hard edge between two stacked sections.
 * Render it BETWEEN sections. `from` is the upper section's bg (Tailwind bg-*),
 * `to` is the lower section's color as a Tailwind fill-* class.
 * `flip` mirrors the crest direction.
 */
export function SectionDivider({
  from,
  to,
  flip = false,
  className,
}: {
  from: string;
  to: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("relative -my-px overflow-hidden leading-[0]", from, className)}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={cn("block h-10 w-full sm:h-14", to, flip && "rotate-180")}
      >
        <path d="M0,40 C240,82 480,2 720,34 C960,66 1200,14 1440,46 L1440,80 L0,80 Z" />
      </svg>
    </div>
  );
}
