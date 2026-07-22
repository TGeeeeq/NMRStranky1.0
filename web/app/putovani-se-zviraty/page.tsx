import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, MapPin, Footprints, Tent } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { CopyButton } from "@/components/CopyButton";
import { SITE, BANK } from "@/lib/site";
import { getLocale } from "@/lib/i18n.server";
import { pick } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, { cs: "Putování se zvířaty", en: "Wandering with the animals" }),
    description: pick(locale, {
      cs: "Dvoudenní dobrodružství středočeskou krajinou ve společnosti našich zvířecích spoluputovníků — prostor pro sdílení a plynutí života.",
      en: "A two-day adventure through the Central Bohemian countryside in the company of our animal fellow-travellers — space for sharing and letting life flow.",
    }),
    alternates: { canonical: "/putovani-se-zviraty" },
  };
}

const info = [
  {
    icon: CalendarDays,
    label: { cs: "Kdy", en: "When" },
    value: { cs: "24. – 26. dubna", en: "24–26 April" },
  },
  {
    icon: MapPin,
    label: { cs: "Kde", en: "Where" },
    value: {
      cs: "Nová Ves u Leštiny 32, Středočeský kraj",
      en: "Nová Ves u Leštiny 32, Central Bohemia",
    },
  },
  {
    icon: Footprints,
    label: { cs: "Náročnost", en: "Difficulty" },
    value: { cs: "Střední, jdeme na lehko", en: "Moderate, we travel light" },
  },
  {
    icon: Tent,
    label: { cs: "Ubytování", en: "Accommodation" },
    value: { cs: "Pod širým nebem", en: "Under the open sky" },
  },
];

const photos = [
  { src: "/assets/toulky1.webp", alt: { cs: "Putování 1", en: "Wandering 1" } },
  { src: "/assets/toulky4.webp", alt: { cs: "Putování 2", en: "Wandering 2" } },
  { src: "/assets/toulky3.webp", alt: { cs: "Putování 3", en: "Wandering 3" } },
];

export default async function PutovaniSeZviraty() {
  const locale = await getLocale();
  return (
    <>
      <PageHero
        image="/assets/walk16.webp"
        imageAlt={pick(locale, {
          cs: "Stádo oveček putuje lesní cestou spolu s lidmi",
          en: "A flock of sheep wandering a forest path together with people",
        })}
        eyebrow={pick(locale, { cs: "Dobrodružství", en: "Adventure" })}
        title={pick(locale, { cs: "Putování se zvířaty", en: "Wandering with the animals" })}
        subtitle={pick(locale, {
          cs: "Třídenní dobrodružství, které vám poskytne prostor pro sdílení a plynutí života.",
          en: "A three-day adventure offering you space for sharing and letting life flow.",
        })}
      />

      {/* O čem putování je */}
      <section className="bg-surface py-20 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeader
              align="left"
              eyebrow={pick(locale, { cs: "Pozvánka", en: "Invitation" })}
              title={pick(locale, { cs: "O čem putování je?", en: "What the wandering is about" })}
            />
          </Reveal>
          <Reveal className="space-y-5 text-lg leading-relaxed text-text">
            {locale === "en" ? (
              <>
                <p>
                  Hi friends! On this Wandering with the Animals we’ll set out on a two-day journey
                  through the Central Bohemian countryside around our Meadow. Joining us will be
                  dogs, a donkey, a mouflon and maybe even a little gang of sheep? 😂
                </p>
                <p>
                  This lovely adventure will give us a wonderful time and space for sharing and
                  letting life flow. We’ll travel light and sleep under the open sky in the company
                  of our animal fellow-travellers :)
                </p>
                <p>
                  In the evening there’ll be dinner cooked over the fire with live music :) In the
                  morning there’s the chance of a kung-fu-style warm-up. Doesn’t that sound simply
                  wonderful?
                </p>
                <p>
                  If this appeals to you, we’ll be looking forward to seeing you on the 24th at the
                  Meadow for the opening circle to get to know one another, dinner included :) After
                  the opening we’ll spend the night at the Meadow and set off early the next day.
                  We’ll finish our journey on Sunday towards evening. We’ll share something good to
                  say goodbye, form a sharing circle and part ways.
                </p>
              </>
            ) : (
              <>
                <p>
                  Ahoj přátelé, na Toulkách se zvířaty se vydáme na dvoudenní putování středočeskou
                  krajinou kolem naší Louky. Na Toulky se k nám přidají psi, osel, muflon a možná i nějaká
                  ovčí banda? 😂
                </p>
                <p>
                  Tohle krásné dobrodružství nám poskytne nádherný čas a prostor pro sdílení a plynutí
                  života. Půjdeme na lehko a spát budeme pod širým nebem ve společnosti našich zvířecích
                  spoluputovníků :)
                </p>
                <p>
                  Večer bude zajištěna večeře na ohni s hudebním doprovodem :) Ráno možnost rozcvičky
                  v duchu kung-fu. No nezní to opravdu báječně?
                </p>
                <p>
                  Pokud tě to zaujalo, budeme se na tebe těšit 24. na Louce při zahajovacím kruhu
                  seznámení, večeře jasná :) Po zahájení přespíme na Louce a následující den brzy
                  vyrazíme na cestu. Naši pouť zakončíme v neděli k večeru. Dáme si na rozloučenou něco
                  dobrého, uděláme si kruh sdílení a rozloučíme se.
                </p>
              </>
            )}
          </Reveal>
        </Container>
      </section>

      {/* Detaily + registrace */}
      <section className="bg-surface-alt py-20 sm:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <div className="grid gap-4 sm:grid-cols-2">
                {info.map((it) => (
                  <div key={it.label.cs} className="rounded-lg border border-border bg-surface p-5 shadow-soft">
                    <div className="flex items-center gap-2 text-moss">
                      <it.icon size={18} aria-hidden />
                      <span className="text-sm font-semibold uppercase tracking-wide text-moss-soft">{pick(locale, it.label)}</span>
                    </div>
                    <p className="mt-1.5 font-medium text-text">{pick(locale, it.value)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-moss-deep p-6 text-center text-cream shadow-lift">
                <p className="text-sm uppercase tracking-wide text-accent">{pick(locale, { cs: "Doporučený příspěvek", en: "Suggested contribution" })}</p>
                <p className="mt-1 font-serif text-4xl font-semibold">1 800 Kč</p>
              </div>
            </Reveal>

            {/* Registrace a platba */}
            <Reveal delay={0.1}>
              <div className="rounded-lg border border-border bg-surface p-7 shadow-soft">
                <h2 className="font-serif text-xl font-semibold text-moss-deep">{pick(locale, { cs: "Registrace a platba", en: "Registration and payment" })}</h2>
                {locale === "en" ? (
                  <p className="mt-3 text-text-muted">
                    To complete your registration, please pay a deposit of{" "}
                    <strong className="text-moss-deep">500 Kč</strong> in advance to our
                    transparent account.
                  </p>
                ) : (
                  <p className="mt-3 text-text-muted">
                    Pro dokončení registrace je potřeba uhradit zálohu <strong className="text-moss-deep">500 Kč</strong> předem
                    na náš transparentní účet.
                  </p>
                )}
                <ul className="mt-4 space-y-2 text-sm text-text">
                  {locale === "en" ? (
                    <>
                      <li>• The 500 Kč deposit is paid in advance directly to the transparent account.</li>
                      <li>• The rest is paid either in cash on arrival or as arranged.</li>
                      <li>
                        • For individual arrangements, contact us at{" "}
                        <a href={`mailto:${SITE.email}`} className="text-moss underline underline-offset-2">{SITE.email}</a>.
                      </li>
                    </>
                  ) : (
                    <>
                      <li>• Záloha 500 Kč se platí dopředu přímo na transparentní účet.</li>
                      <li>• Zbytek částky se platí buď na místě v hotovosti, nebo po domluvě.</li>
                      <li>
                        • Pro individuální domluvu nás kontaktujte na{" "}
                        <a href={`mailto:${SITE.email}`} className="text-moss underline underline-offset-2">{SITE.email}</a>.
                      </li>
                    </>
                  )}
                </ul>
                <dl className="mt-5 space-y-1.5 rounded-md bg-surface-alt p-4 text-sm text-text">
                  <div className="flex justify-between gap-2"><dt className="text-text-muted">{pick(locale, { cs: "Účet", en: "Account" })}</dt><dd className="font-medium">{BANK.account}</dd></div>
                  <div className="flex justify-between gap-2"><dt className="text-text-muted">IBAN</dt><dd className="font-medium">{BANK.iban}</dd></div>
                  <div className="flex justify-between gap-2"><dt className="text-text-muted">SWIFT</dt><dd className="font-medium">{BANK.swift}</dd></div>
                </dl>
                <div className="mt-4 flex flex-col items-center gap-3">
                  <Image
                    src="/assets/qr-toulky.webp"
                    alt={pick(locale, { cs: "QR kód pro platbu zálohy", en: "QR code for paying the deposit" })}
                    width={160}
                    height={160}
                    className="h-40 w-40 rounded-md bg-white object-contain p-2"
                  />
                  <CopyButton value="2002645872/2010" label={pick(locale, { cs: "Kopírovat číslo účtu", en: "Copy account number" })} />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Fotky */}
      <section className="bg-surface py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeader
              eyebrow={pick(locale, { cs: "Vzpomínky", en: "Memories" })}
              title={pick(locale, { cs: "Fotky z našich cest", en: "Photos from our journeys" })}
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {photos.map((p, i) => (
              <Reveal key={p.src} delay={i * 0.06}>
                <Image
                  src={p.src}
                  alt={pick(locale, p.alt)}
                  width={520}
                  height={400}
                  className="aspect-[4/3] w-full rounded-lg object-cover shadow-soft"
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <SocialSection tone="alt" />
    </>
  );
}
