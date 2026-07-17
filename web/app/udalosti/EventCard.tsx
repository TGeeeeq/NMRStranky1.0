"use client";

import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { EventPhotos, type EventPhoto } from "./EventPhotos";
import { LoukaMap } from "@/components/louka-map/LoukaMap";

export type Event = {
  title: string;
  badge: string;
  kind: string;
  location: string;
  /** Krátká zmínka viditelná ve sbaleném seznamu. */
  teaser: string;
  /** Celý popis (odstavce `<p>`), zobrazí se po rozbalení. */
  description: ReactNode;
  href?: string;
  date?: string;
  motto?: string;
  photos: EventPhoto[];
  showMap?: boolean;
};

/** Karta události: sbalená ukazuje jen krátkou zmínku a první fotku,
 *  po rozbalení celý popis, všechny fotky, mapu a odkazy. */
export function EventCard({ event: e }: { event: Event }) {
  const [open, setOpen] = useState(false);
  // Mapa se poprvé připojí až při rozbalení a pak už zůstává,
  // aby se sbalené karty nevykreslovaly zbytečně.
  const [mapMounted, setMapMounted] = useState(false);
  const detailId = useId();

  return (
    <article className="rounded-lg border border-border bg-surface p-7 shadow-soft sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-pill bg-accent/40 px-3 py-1 text-xs font-semibold text-moss-deep">
          {e.badge}
        </span>
        <span className="text-sm font-medium text-moss-soft">{e.kind}</span>
      </div>
      <h2 className="mt-3 font-serif text-2xl font-semibold text-moss-deep">{e.title}</h2>
      {e.motto ? (
        <p className="mt-1.5 inline-flex items-baseline gap-2 font-serif text-lg italic leading-snug text-terracotta">
          <span aria-hidden className="h-px w-6 self-center bg-terracotta/50" />
          „{e.motto}“
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={16} aria-hidden /> {e.date ?? "Termín bude upřesněn"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={16} aria-hidden /> {e.location}
        </span>
      </div>

      <p className="mt-4 leading-relaxed text-text">{e.teaser}</p>
      <EventPhotos photos={e.photos} title={e.title} />

      <div
        id={detailId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-5 space-y-4 border-t border-border pt-5 leading-relaxed text-text">
            {e.description}
          </div>
          {e.showMap && (mapMounted || open) ? (
            <figure className="mt-6">
              <LoukaMap compact />
              <figcaption className="mt-2 text-xs text-text-muted">
                Kreslená mapa okolí — celou i s popisem cesty najdete na{" "}
                <Link
                  href="/cesta-na-louku"
                  className="font-medium text-moss underline underline-offset-2 hover:text-moss-deep"
                >
                  stránce Cesta na Louku
                </Link>
                .
              </figcaption>
            </figure>
          ) : null}
          {e.href ? (
            <a
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center rounded-pill bg-moss px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-moss-deep"
            >
              Facebook událost
            </a>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setMapMounted(true);
        }}
        aria-expanded={open}
        aria-controls={detailId}
        className="mt-5 inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface-alt px-5 py-2 text-sm font-medium text-moss-deep transition-colors hover:bg-sand/60"
      >
        {open ? "Zobrazit méně" : "Zobrazit více"}
        <ChevronDown size={16} aria-hidden className={cn("transition-transform", open && "rotate-180")} />
      </button>
    </article>
  );
}
