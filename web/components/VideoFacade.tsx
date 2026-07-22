"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { pick } from "@/lib/i18n";

/**
 * Lazy video facade: shows a 16:9 poster + play button, and mounts the YouTube
 * iframe only on click (fast load, no YouTube cookies until played). The poster
 * matches the played video's aspect ratio so the thumbnail reads as a video.
 */
export function VideoFacade({
  youtubeId,
  poster,
  title,
}: {
  youtubeId?: string;
  poster: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const { locale } = useLocale();

  if (playing && youtubeId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lift">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => youtubeId && setPlaying(true)}
      aria-label={youtubeId ? `${pick(locale, { cs: "Přehrát", en: "Play" })}: ${title}` : title}
      className="group relative block aspect-video w-full overflow-hidden rounded-lg shadow-lift"
    >
      <Image
        src={poster}
        alt={title}
        fill
        loading="lazy"
        sizes="(min-width: 768px) 36rem, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-moss-deep/30 transition-colors group-hover:bg-moss-deep/20" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pill bg-cream/95 text-moss shadow-lift transition-transform group-hover:scale-110">
        <Play size={26} className="ml-0.5" fill="currentColor" />
      </span>
    </button>
  );
}
