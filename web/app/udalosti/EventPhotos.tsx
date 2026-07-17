"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

export type EventPhoto = { src: string; alt: string };

/** Dvojice fotek u události: malé náhledy (na telefonu menší, na počítači
 *  větší), po kliknutí se otevřou v lightboxu jako v galerii. */
export function EventPhotos({ photos, title }: { photos: EventPhoto[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const next = () => setActive((i) => (i === null ? i : (i + 1) % photos.length));
  const prev = () => setActive((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));

  useEffect(() => {
    if (active === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setActive((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, photos.length]);

  const current = active === null ? null : photos[active];

  return (
    <>
      <div className="mt-5 flex gap-3">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Otevřít fotku: ${p.alt}`}
            className="group relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg border border-border shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss sm:w-44"
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              loading="lazy"
              sizes="(min-width: 640px) 176px, 112px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-moss-deep/0 transition-colors group-hover:bg-moss-deep/25">
              <ZoomIn
                size={22}
                aria-hidden
                className="text-cream opacity-0 drop-shadow transition-opacity group-hover:opacity-100"
              />
            </span>
          </button>
        ))}
      </div>

      {current ? (
        <div
          className="fixed inset-0 z-[100] flex touch-pan-y items-center justify-center bg-moss-deep/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Fotka: ${current.alt}`}
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
          {photos.length > 1 ? (
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
          ) : null}
          <div className="relative max-h-[85vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={current.src}
              alt={current.alt}
              width={1400}
              height={1000}
              className="mx-auto max-h-[85vh] w-auto rounded-lg object-contain"
            />
            <p className="mt-3 text-center font-medium text-cream">
              {title} — {current.alt}
            </p>
          </div>
          {photos.length > 1 ? (
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
          ) : null}
        </div>
      ) : null}
    </>
  );
}
