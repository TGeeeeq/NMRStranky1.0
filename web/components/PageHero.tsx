import { Container } from "@/components/Container";
import { HeroMotion, HeroItem } from "@/components/HeroMotion";

/** Full-bleed page hero: parallax photo, aurora + moss gradient, grain,
 *  staggered title + subtitle. Shared by every inner page. */
export function PageHero({
  image,
  imageAlt,
  eyebrow,
  title,
  subtitle,
}: {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <HeroMotion
      image={image}
      imageAlt={imageAlt}
      parallax={64}
      className="min-h-[48vh] sm:min-h-[52vh]"
      innerClassName="flex min-h-[48vh] flex-col justify-center sm:min-h-[52vh]"
    >
      <Container className="py-24 text-cream">
        {eyebrow ? (
          <HeroItem>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              {eyebrow}
            </p>
          </HeroItem>
        ) : null}
        <HeroItem>
          <h1 className="max-w-3xl text-balance font-serif text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </HeroItem>
        {subtitle ? (
          <HeroItem>
            <p className="mt-5 max-w-2xl text-lg text-cream/90">{subtitle}</p>
          </HeroItem>
        ) : null}
      </Container>
    </HeroMotion>
  );
}
