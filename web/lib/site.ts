/** Shared site-wide constants — contact, social, bank, association info. */

export const SITE = {
  name: "Nech mě růst z.s.",
  email: "info@nechmerust.org",
  address: "Nová ves u Leštiny 32, 582 82, Česká republika",
  seat: "Dandova 2619/13, Horní Počernice, 193 00 Praha",
  ico: "19602529",
  mapUrl: "https://mapy.com/s/nozazohuta",
} as const;

export const BANK = {
  account: "2002645872 / 2010",
  bank: "Fio banka, a.s.",
  iban: "CZ49 2010 2002 6400 0000 5872",
  swift: "FIOBCZPP",
  transparentUrl: "https://ib.fio.cz/ib/transparent?a=2002645872",
} as const;

export const SOCIAL = {
  instagram: "https://www.instagram.com/nech_me_rust",
  facebook: "https://www.facebook.com/share/1BDFbAxfFf/",
  email: "mailto:info@nechmerust.org",
} as const;

export const LOUKARUN = {
  page: "/loukarun",
  googlePlay:
    "https://play.google.com/store/apps/details?id=org.nechmerust.loukarun",
} as const;
