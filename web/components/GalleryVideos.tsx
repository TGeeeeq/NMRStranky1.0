import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { VideoFacade } from "@/components/VideoFacade";
import { cn } from "@/lib/cn";

type GalleryVideo = { youtubeId: string; poster: string; title: string };

/**
 * Sekce „Videa" v galerii. Videa se nahrávají lazy — dokud na ně uživatel
 * neklikne, zobrazuje se jen plakát (rychlé načtení, žádné cookies YouTube).
 *
 * Přidání dalšího videa: zkopíruj ID z YouTube odkazu (část za "youtu.be/"
 * nebo za "watch?v=") a přidej nový záznam do pole `videos` níže. `poster`
 * je libovolný obrázek z /public (klidně i /assets/video-poster.webp).
 */
const videos: GalleryVideo[] = [
  {
    youtubeId: "1pVDwP4iqWA",
    poster: "/assets/video-poster.webp",
    title: "Hovory ze země",
  },
];

export function GalleryVideos({ embedded = false }: { embedded?: boolean }) {
  if (videos.length === 0) return null;
  const single = videos.length === 1;

  const grid = (
    <div
      className={cn(
        "mx-auto grid gap-8",
        single ? "max-w-xl" : "max-w-5xl sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {videos.map((v) => (
        <Reveal key={v.youtubeId}>
          <figure>
            <VideoFacade youtubeId={v.youtubeId} poster={v.poster} title={v.title} />
            <figcaption className="mt-3 text-center text-sm font-medium text-text">
              {v.title}
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );

  // Embedded in the gallery tabs: no own section/header — the toggle labels it.
  if (embedded) return grid;

  return (
    <section className="bg-surface-alt py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="Ze života Louky"
            title="Videa"
            description="Pusťte si, jak to u nás na Louce žije."
          />
        </Reveal>
        {grid}
      </Container>
    </section>
  );
}
