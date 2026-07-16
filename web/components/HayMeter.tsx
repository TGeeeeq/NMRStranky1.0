import { CountUp } from "@/components/CountUp";
import { campaignProgress } from "@/lib/campaign";

/** Ukazatel průběhu sbírky — vybraná částka vs. cíl. */
export function HayMeter({
  goal,
  raised,
  updatedAt,
}: {
  goal: number;
  raised: number;
  updatedAt: string;
}) {
  const pct = campaignProgress(raised, goal);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <p className="font-serif text-3xl font-semibold text-moss-deep sm:text-4xl">
          <CountUp to={raised} suffix=" Kč" />{" "}
          <span className="font-sans text-base font-normal text-text-muted">
            z {goal.toLocaleString("cs-CZ")} Kč
          </span>
        </p>
        <span className="text-sm font-semibold text-terracotta">{pct} %</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Postup sbírky Seno pro Louku: vybráno ${pct} % cíle`}
        className="h-4 w-full overflow-hidden rounded-pill border border-border bg-surface-alt"
      >
        <div
          className="h-full rounded-pill bg-gradient-to-r from-accent to-terracotta"
          style={{ width: `${Math.max(pct, 1)}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-text-muted">Aktualizováno {updatedAt}</p>
    </div>
  );
}
