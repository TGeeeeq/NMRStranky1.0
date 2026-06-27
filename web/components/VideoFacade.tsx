"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

/**
 * Lazy video facade: shows the poster + play button, mounts the YouTube iframe
 * only on click. Pass `youtubeId` once the video is uploaded; until then the
 * poster is shown as a static frame.
 */
export function VideoFacade({
  youtubeId,
  poster,
  title,
  width = 600,
  height = 800,
}: {
  youtubeId?: string;
  poster: string;
  title: string;
  width?: number;
  height?: number;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing && youtubeId) {
    return (
      <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-lg shadow-lift">
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
      aria-label={youtubeId ? `Přehrát: ${title}` : title}
      className="group relative mx-auto block w-full max-w-md overflow-hidden rounded-lg shadow-lift"
    >
      <Image
        src={poster}
        alt={title}
        width={width}
        height={height}
        className="h-auto w-full object-cover"
        sizes="(min-width: 768px) 28rem, 100vw"
      />
      <span className="absolute inset-0 bg-moss-deep/25 transition-colors group-hover:bg-moss-deep/15" />
      <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pill bg-cream/95 text-moss shadow-lift transition-transform group-hover:scale-105">
        <Play size={30} className="ml-1" fill="currentColor" />
      </span>
    </button>
  );
}
