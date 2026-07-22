import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { getLocale } from "@/lib/i18n.server";
import { pick } from "@/lib/i18n";

/**
 * Impact strip with count-up numbers.
 * Client-confirmed marketing figures — edit here.
 */
const stats: {
  to: number;
  suffix?: string;
  prefix?: string;
  label: { cs: string; en: string };
}[] = [
  { to: 100, suffix: "+", label: { cs: "zvířecích lučních obyvatel", en: "animal residents of the meadow" } },
  { to: 5, suffix: "", label: { cs: "let na Louce", en: "years at the Meadow" } },
  { to: 60, suffix: "+", label: { cs: "společných procházek, festivalů a Loukád", en: "shared walks, festivals and Meadow gatherings" } },
  { to: 100, suffix: " %", label: { cs: "transparentní financování", en: "transparent funding" } },
];

export async function StatsBand() {
  const locale = await getLocale();
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
              <div key={s.label.cs}>
                <dt className="sr-only">{pick(locale, s.label)}</dt>
                <dd>
                  <CountUp
                    to={s.to}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    className="block font-serif text-5xl font-semibold text-accent sm:text-6xl"
                  />
                  <span className="mt-2 block text-sm font-medium uppercase tracking-[0.12em] text-cream/80">
                    {pick(locale, s.label)}
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
