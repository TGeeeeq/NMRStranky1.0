import Image from "next/image";
import { Container } from "@/components/Container";

/** Full-bleed page hero: background photo, moss gradient, title + subtitle. */
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
    <section className="relative isolate overflow-hidden">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-moss-deep/85 via-moss-deep/70 to-moss/55" />
      <Container className="flex min-h-[48vh] flex-col justify-center py-24 text-cream sm:min-h-[52vh]">
        {eyebrow ? (
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-balance font-serif text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-5 max-w-2xl text-lg text-cream/90">{subtitle}</p>
        ) : null}
      </Container>
    </section>
  );
}
