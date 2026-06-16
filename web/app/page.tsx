import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nech mě růst — prostor pro růst duše, srdce i přírody",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-surface-alt px-6 py-24">
      <section className="mx-auto max-w-2xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-moss-soft">
          Nech mě růst z.s.
        </p>
        <h1 className="text-balance font-serif text-5xl font-semibold leading-tight text-moss-deep sm:text-6xl">
          Tvoříme prostor pro růst duše,{" "}
          <span className="relative whitespace-nowrap">
            srdce i přírody
            <span className="absolute -bottom-1 left-0 h-2 w-full rounded-pill bg-accent/70" />
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-text-muted">
          Nezisková organizace s vizí tvorby rodového statku, kde žijeme
          v harmonii s přírodou, zvířaty i sebou navzájem.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/jak-se-zapojit"
            className="rounded-pill bg-moss px-7 py-3 font-medium text-cream shadow-soft transition-transform hover:-translate-y-0.5"
          >
            Jak se zapojit
          </a>
          <a
            href="/o-nas"
            className="rounded-pill border border-moss/30 px-7 py-3 font-medium text-moss transition-colors hover:bg-moss/5"
          >
            Více o nás
          </a>
        </div>
        <p className="mt-16 text-sm text-text-muted">
          🌱 Nová verze webu se připravuje — přechod na Next.js / Vercel.
        </p>
      </section>
    </main>
  );
}
