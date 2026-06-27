import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";

/**
 * Impact strip with count-up numbers.
 * Client-confirmed marketing figures — edit here.
 */
const stats: { to: number; suffix?: string; prefix?: string; label: string }[] = [
  { to: 100, suffix: "+", label: "zvířecích lučních obyvatel" },
  { to: 5, suffix: "", label: "let na Louce" },
  { to: 60, suffix: "+", label: "společných procházek, festivalů a Loukád" },
  { to: 100, suffix: " %", label: "transparentní financování" },
];

export function StatsBand() {
  return (
    <section className="grain-overlay grain-strong relative isolate overflow-hidden bg-moss-deep py-16 sm:py-20">
      <div
        aria-hidden
        className="bg-aurora absolute inset-0 -z-10 opacity-25"
      />
      <div
        aria-hidden
        className="blob blob-soft blob-morph -right-24 top-1/2 h-72 w-72 -translate-y-1/2"
      />
      <Container>
        <Reveal>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 text-center lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <CountUp
                    to={s.to}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    className="block font-serif text-5xl font-semibold text-accent sm:text-6xl"
                  />
                  <span className="mt-2 block text-sm font-medium uppercase tracking-[0.12em] text-cream/80">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
