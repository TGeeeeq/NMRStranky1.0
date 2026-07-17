import { ExternalLink } from "lucide-react";

export type EventMapData = {
  /** URL mapy pro vložení do iframe (Mapy.com s parametrem frame=1). */
  embedUrl: string;
  /** Odkaz na plnou mapu na Mapy.com. */
  linkUrl: string;
  caption?: string;
};

/** Vložená mapa Mapy.com s vyznačenou trasou/místem u události. */
export function EventMap({ map, title }: { map: EventMapData; title: string }) {
  return (
    <figure className="mt-6">
      <div className="overflow-hidden rounded-lg border border-border shadow-soft">
        <iframe
          src={map.embedUrl}
          title={`Mapa: ${title}`}
          loading="lazy"
          allowFullScreen
          className="aspect-[16/10] w-full"
        />
      </div>
      {map.caption ? (
        <figcaption className="mt-2 text-sm text-text-muted">{map.caption}</figcaption>
      ) : null}
      <a
        href={map.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-moss transition-colors hover:text-moss-deep"
      >
        Otevřít mapu na Mapy.com <ExternalLink size={14} aria-hidden />
      </a>
    </figure>
  );
}
