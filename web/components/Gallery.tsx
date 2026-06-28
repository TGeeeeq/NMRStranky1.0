"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { galleryAnimals, galleryImages } from "@/lib/animals";
import { Container } from "@/components/Container";
import { cn } from "@/lib/cn";

export function Gallery() {
  const [filter, setFilter] = useState<string>("Vše");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<number | null>(null);
  // Fotky, které se nepodařilo načíst (chybějící soubor), z galerie vyřadíme.
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Deep link from an animal card: /galerie?zvire=Karel pre-selects the filter.
  useEffect(() => {
    const zvire = new URLSearchParams(window.location.search).get("zvire");
    if (zvire && galleryAnimals.some((a) => a.name === zvire)) setFilter(zvire);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return galleryImages.filter(
      (img) =>
        !broken.has(img.src) &&
        (filter === "Vše" || img.animal === filter) &&
        (q === "" || img.animal.toLowerCase().includes(q)),
    );
  }, [filter, query, broken]);

  const next = () =>
    setActive((i) => (i === null ? i : (i + 1) % filtered.length));
  const prev = () =>
    setActive((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (active === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i === null ? i : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft")
        setActive((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, filtered.length]);

  const current = active === null ? null : filtered[active];

  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        {/* Search */}
        <div className="mx-auto mb-5 max-w-md sm:mb-6">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat zvíře..."
            aria-label="Hledat zvíře"
            className="w-full rounded-pill border border-border bg-surface px-4 py-2.5 text-sm text-text shadow-soft outline-none focus:border-moss focus:ring-2 focus:ring-moss/30 sm:px-5 sm:py-3 sm:text-base"
          />
        </div>

        {/* Filters — vodorovně rolovatelné na mobilu, zalomené a vycentrované na větších displejích */}
        <div className="mb-8 -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-2 sm:overflow-visible sm:px-0 sm:pb-0">
          {["Vše", ...galleryAnimals.map((a) => a.name)].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setFilter(name)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-pill border px-3 py-1 text-xs font-medium transition-colors sm:px-4 sm:py-1.5 sm:text-sm",
                filter === name
                  ? "border-moss bg-moss text-cream"
                  : "border-border bg-surface text-text hover:bg-surface-alt",
              )}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-text-muted">Nic nenalezeno.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setActive(i)}
                className="group relative aspect-square overflow-hidden rounded-lg shadow-soft"
                aria-label={`Otevřít fotku: ${img.animal}`}
              >
                <Image
                  src={img.src}
                  alt={img.animal}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() =>
                    setBroken((b) => new Set(b).add(img.src))
                  }
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-moss-deep/70 to-transparent p-2 text-left text-xs font-medium text-cream opacity-0 transition-opacity group-hover:opacity-100">
                  {img.animal}
                </span>
              </button>
            ))}
          </div>
        )}
      </Container>

      {/* Lightbox */}
      {current ? (
        <div
          className="fixed inset-0 z-[100] flex touch-pan-y items-center justify-center bg-moss-deep/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Fotka: ${current.animal}`}
          onClick={() => setActive(null)}
          onTouchStart={(e) => {
            const t = e.touches[0];
            touchStart.current = { x: t.clientX, y: t.clientY };
          }}
          onTouchEnd={(e) => {
            if (!touchStart.current) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - touchStart.current.x;
            const dy = t.clientY - touchStart.current.y;
            touchStart.current = null;
            // Horizontal swipe (and clearly not a vertical scroll) → navigate.
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
              if (dx < 0) next();
              else prev();
            }
          }}
        >
          <button
            type="button"
            aria-label="Zavřít"
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-pill bg-cream/15 text-cream hover:bg-cream/25"
          >
            <X size={24} />
          </button>
          <button
            type="button"
            aria-label="Předchozí"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-pill bg-cream/15 text-cream hover:bg-cream/25 sm:left-6"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="relative max-h-[85vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={current.src}
              alt={current.animal}
              width={1400}
              height={1000}
              className="mx-auto max-h-[85vh] w-auto rounded-lg object-contain"
            />
            <p className="mt-3 text-center font-medium text-cream">{current.animal}</p>
          </div>
          <button
            type="button"
            aria-label="Další"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-pill bg-cream/15 text-cream hover:bg-cream/25 sm:right-6"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      ) : null}
    </section>
  );
}
