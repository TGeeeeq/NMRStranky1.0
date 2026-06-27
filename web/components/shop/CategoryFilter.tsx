import Link from "next/link";
import { cn } from "@/lib/cn";

type Cat = { slug: string; name: string; productCount: number };

export function CategoryFilter({ categories, active }: { categories: Cat[]; active?: string }) {
  const pill = "rounded-pill border px-4 py-2 text-sm font-medium transition-colors";
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/obchod"
        className={cn(pill, !active ? "border-moss bg-moss text-cream" : "border-border text-moss-deep hover:bg-surface-alt")}
      >
        Vše
      </Link>
      {categories.filter((c) => c.productCount > 0).map((c) => (
        <Link
          key={c.slug}
          href={`/obchod?kategorie=${c.slug}`}
          className={cn(pill, active === c.slug ? "border-moss bg-moss text-cream" : "border-border text-moss-deep hover:bg-surface-alt")}
        >
          {c.name} <span className="opacity-60">({c.productCount})</span>
        </Link>
      ))}
    </div>
  );
}
