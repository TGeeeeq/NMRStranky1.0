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

export const metadata: Metadata = {
  title: "Putování se zvířaty",
  description:
    "Dvoudenní dobrodružství středočeskou krajinou ve společnosti našich zvířecích spoluputovníků — prostor pro sdílení a plynutí života.",
  alternates: { canonical: "/putovani-se-zviraty" },
};

const info = [
  { icon: CalendarDays, label: "Kdy", value: "24. – 26. dubna" },
  { icon: MapPin, label: "Kde", value: "Nová Ves u Leštiny 32, Středočeský kraj" },
  { icon: Footprints, label: "Náročnost", value: "Střední, jdeme na lehko" },
  { icon: Tent, label: "Ubytování", value: "Pod širým nebem" },
];

const photos = [
  { src: "/assets/toulky1.webp", alt: "Putování 1" },
  { src: "/assets/toulky4.webp", alt: "Putování 2" },
  { src: "/assets/toulky3.webp", alt: "Putování 3" },
];

export default function PutovaniSeZviraty() {
  return (
    <>
      <PageHero
        image="/assets/walk16.webp"
        imageAlt="Stádo oveček putuje lesní cestou spolu s lidmi"
        eyebrow="Dobrodružství"
        title="Putování se zvířaty"
        subtitle="Třídenní dobrodružství, které vám poskytne prostor pro sdílení a plynutí života."
      />

      {/* O čem putování je */}
      <section className="bg-surface py-20 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeader align="left" eyebrow="Pozvánka" title="O čem putování je?" />
          </Reveal>
          <Reveal className="space-y-5 text-lg leading-relaxed text-text">
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
                  <div key={it.label} className="rounded-lg border border-border bg-surface p-5 shadow-soft">
                    <div className="flex items-center gap-2 text-moss">
                      <it.icon size={18} aria-hidden />
                      <span className="text-sm font-semibold uppercase tracking-wide text-moss-soft">{it.label}</span>
                    </div>
                    <p className="mt-1.5 font-medium text-text">{it.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-moss-deep p-6 text-center text-cream shadow-lift">
                <p className="text-sm uppercase tracking-wide text-accent">Doporučený příspěvek</p>
                <p className="mt-1 font-serif text-4xl font-semibold">1 800 Kč</p>
              </div>
            </Reveal>

            {/* Registrace a platba */}
            <Reveal delay={0.1}>
              <div className="rounded-lg border border-border bg-surface p-7 shadow-soft">
                <h2 className="font-serif text-xl font-semibold text-moss-deep">Registrace a platba</h2>
                <p className="mt-3 text-text-muted">
                  Pro dokončení registrace je potřeba uhradit zálohu <strong className="text-moss-deep">500 Kč</strong> předem
                  na náš transparentní účet.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-text">
                  <li>• Záloha 500 Kč se platí dopředu přímo na transparentní účet.</li>
                  <li>• Zbytek částky se platí buď na místě v hotovosti, nebo po domluvě.</li>
                  <li>
                    • Pro individuální domluvu nás kontaktujte na{" "}
                    <a href={`mailto:${SITE.email}`} className="text-moss underline underline-offset-2">{SITE.email}</a>.
                  </li>
                </ul>
                <dl className="mt-5 space-y-1.5 rounded-md bg-surface-alt p-4 text-sm text-text">
                  <div className="flex justify-between gap-2"><dt className="text-text-muted">Účet</dt><dd className="font-medium">{BANK.account}</dd></div>
                  <div className="flex justify-between gap-2"><dt className="text-text-muted">IBAN</dt><dd className="font-medium">{BANK.iban}</dd></div>
                  <div className="flex justify-between gap-2"><dt className="text-text-muted">SWIFT</dt><dd className="font-medium">{BANK.swift}</dd></div>
                </dl>
                <div className="mt-4 flex flex-col items-center gap-3">
                  <Image
                    src="/assets/qr-toulky.webp"
                    alt="QR kód pro platbu zálohy"
                    width={160}
                    height={160}
                    className="h-40 w-40 rounded-md bg-white object-contain p-2"
                  />
                  <CopyButton value="2002645872/2010" label="Kopírovat číslo účtu" />
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
            <SectionHeader eyebrow="Vzpomínky" title="Fotky z našich cest" />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {photos.map((p, i) => (
              <Reveal key={p.src} delay={i * 0.06}>
                <Image
                  src={p.src}
                  alt={p.alt}
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
