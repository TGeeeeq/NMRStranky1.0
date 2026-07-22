import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Prose } from "@/components/Prose";
import { getLocale } from "@/lib/i18n.server";
import { pick, type Locale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, {
      cs: "Ochrana osobních údajů",
      en: "Privacy policy",
    }),
    description: pick(locale, {
      cs: "Zásady zpracování a ochrany osobních údajů spolku Nech mě růst, z.s. (GDPR).",
      en: "Principles of the processing and protection of personal data of the Nech mě růst, z.s. association (GDPR).",
    }),
    alternates: { canonical: "/gdpr" },
  };
}

type Bi = Record<Locale, string>;

const purposes: { h: Bi; purpose: Bi; basis: Bi; data: Bi }[] = [
  {
    h: { cs: "E-shop a prodej produktů", en: "E-shop and sale of products" },
    purpose: {
      cs: "Vyřízení objednávky, doručení zboží, komunikace se zákazníkem a plnění zákonných povinností (účetnictví, daně)",
      en: "Processing the order, delivering goods, communicating with the customer and fulfilling legal obligations (accounting, taxes)",
    },
    basis: {
      cs: "Plnění smlouvy – čl. 6 odst. 1 písm. b) GDPR a plnění právní povinnosti – čl. 6 odst. 1 písm. c) GDPR",
      en: "Performance of a contract – Art. 6(1)(b) GDPR and compliance with a legal obligation – Art. 6(1)(c) GDPR",
    },
    data: {
      cs: "Jméno, příjmení, doručovací adresa, fakturační adresa, e-mail, telefon, údaje o objednaném zboží",
      en: "First name, surname, delivery address, billing address, e-mail, phone, details of the ordered goods",
    },
  },
  {
    h: { cs: "Členská evidence", en: "Membership records" },
    purpose: {
      cs: "Vedení evidence členů spolku, plnění práv a povinností vyplývajících z členství",
      en: "Keeping records of the association’s members, fulfilling the rights and obligations arising from membership",
    },
    basis: {
      cs: "Plnění smlouvy (členství ve spolku) – čl. 6 odst. 1 písm. b) GDPR",
      en: "Performance of a contract (membership in the association) – Art. 6(1)(b) GDPR",
    },
    data: {
      cs: "Jméno, příjmení, datum narození, adresa, e-mail, telefon",
      en: "First name, surname, date of birth, address, e-mail, phone",
    },
  },
  {
    h: { cs: "Dárci a podporovatelé", en: "Donors and supporters" },
    purpose: {
      cs: "Zpracování darů, vystavení potvrzení o daru pro daňové účely, komunikace s dárci",
      en: "Processing donations, issuing donation confirmations for tax purposes, communicating with donors",
    },
    basis: {
      cs: "Plnění právní povinnosti (daňové předpisy) – čl. 6 odst. 1 písm. c) GDPR a oprávněný zájem – čl. 6 odst. 1 písm. f) GDPR",
      en: "Compliance with a legal obligation (tax regulations) – Art. 6(1)(c) GDPR and legitimate interest – Art. 6(1)(f) GDPR",
    },
    data: {
      cs: "Jméno, příjmení, adresa, e-mail, výše daru, datum daru",
      en: "First name, surname, address, e-mail, donation amount, donation date",
    },
  },
  {
    h: { cs: "Dobrovolníci", en: "Volunteers" },
    purpose: {
      cs: "Organizace dobrovolnické činnosti, komunikace s dobrovolníky",
      en: "Organising volunteer activities, communicating with volunteers",
    },
    basis: {
      cs: "Oprávněný zájem – čl. 6 odst. 1 písm. f) GDPR (organizace činnosti spolku)",
      en: "Legitimate interest – Art. 6(1)(f) GDPR (organising the association’s activities)",
    },
    data: {
      cs: "Jméno, příjmení, e-mail, telefon",
      en: "First name, surname, e-mail, phone",
    },
  },
  {
    h: { cs: "Účastníci akcí a událostí", en: "Participants of events" },
    purpose: {
      cs: "Registrace na akce, komunikace o akcích, organizace akcí",
      en: "Registering for events, communicating about events, organising events",
    },
    basis: {
      cs: "Souhlas – čl. 6 odst. 1 písm. a) GDPR",
      en: "Consent – Art. 6(1)(a) GDPR",
    },
    data: {
      cs: "Jméno, příjmení, e-mail, telefon",
      en: "First name, surname, e-mail, phone",
    },
  },
  {
    h: { cs: "Virtuální adopce", en: "Virtual adoption" },
    purpose: {
      cs: "Zpracování virtuálních adopcí zvířat, zasílání informací o adoptovaných zvířatech",
      en: "Processing virtual adoptions of animals, sending information about adopted animals",
    },
    basis: {
      cs: "Plnění smlouvy – čl. 6 odst. 1 písm. b) GDPR",
      en: "Performance of a contract – Art. 6(1)(b) GDPR",
    },
    data: {
      cs: "Jméno, příjmení, e-mail, adresa (pro zasílání potvrzení)",
      en: "First name, surname, e-mail, address (for sending confirmations)",
    },
  },
  {
    h: { cs: "Kontaktní formuláře a dotazy", en: "Contact forms and enquiries" },
    purpose: {
      cs: "Zodpovězení dotazů, komunikace se zájemci",
      en: "Answering enquiries, communicating with interested parties",
    },
    basis: {
      cs: "Oprávněný zájem – čl. 6 odst. 1 písm. f) GDPR (komunikace se zájemci)",
      en: "Legitimate interest – Art. 6(1)(f) GDPR (communication with interested parties)",
    },
    data: {
      cs: "Jméno, příjmení, e-mail, obsah dotazu",
      en: "First name, surname, e-mail, content of the enquiry",
    },
  },
];

const retention: { k: Bi; v: Bi }[] = [
  {
    k: { cs: "Členové spolku", en: "Association members" },
    v: {
      cs: "Po dobu trvání členství a 10 let po jeho ukončení (archivační povinnost)",
      en: "For the duration of membership and 10 years after its termination (archiving obligation)",
    },
  },
  {
    k: { cs: "Dárci", en: "Donors" },
    v: {
      cs: "10 let od poskytnutí daru (daňové předpisy)",
      en: "10 years from the date of the donation (tax regulations)",
    },
  },
  {
    k: { cs: "Dobrovolníci", en: "Volunteers" },
    v: {
      cs: "Po dobu spolupráce a 3 roky po jejím ukončení",
      en: "For the duration of the cooperation and 3 years after its end",
    },
  },
  {
    k: { cs: "Účastníci akcí", en: "Event participants" },
    v: {
      cs: "1 rok od konání akce (pokud není udělen souhlas s delším zpracováním)",
      en: "1 year from the event (unless consent to longer processing is given)",
    },
  },
  {
    k: { cs: "Virtuální adopce", en: "Virtual adoption" },
    v: {
      cs: "Po dobu trvání adopce a 3 roky po jejím ukončení",
      en: "For the duration of the adoption and 3 years after its end",
    },
  },
  {
    k: { cs: "Kontaktní formuláře", en: "Contact forms" },
    v: {
      cs: "2 roky od posledního kontaktu",
      en: "2 years from the last contact",
    },
  },
  {
    k: { cs: "E-shop (zákazníci)", en: "E-shop (customers)" },
    v: {
      cs: "Po dobu vyřízení objednávky a 10 let od konce účetního období (zákon o účetnictví)",
      en: "For the time it takes to process the order and 10 years from the end of the accounting period (Accounting Act)",
    },
  },
];

const rights: { h: Bi; t: Bi }[] = [
  {
    h: { cs: "Právo na přístup k osobním údajům", en: "Right of access to personal data" },
    t: {
      cs: "Máte právo získat od nás potvrzení, zda vaše osobní údaje zpracováváme, a pokud ano, máte právo získat přístup k těmto údajům a informacím o způsobu jejich zpracování.",
      en: "You have the right to obtain confirmation from us as to whether we process your personal data, and if so, you have the right to access that data and to information about how it is processed.",
    },
  },
  {
    h: { cs: "Právo na opravu", en: "Right to rectification" },
    t: {
      cs: "Máte právo na opravu nepřesných osobních údajů, které se vás týkají. Máte také právo na doplnění neúplných osobních údajů.",
      en: "You have the right to have inaccurate personal data concerning you corrected. You also have the right to have incomplete personal data completed.",
    },
  },
  {
    h: {
      cs: "Právo na výmaz („právo být zapomenut“)",
      en: "Right to erasure (“the right to be forgotten”)",
    },
    t: {
      cs: "Za určitých okolností máte právo požadovat výmaz vašich osobních údajů. Toto právo není absolutní a můžeme mít zákonné důvody pro zachování údajů.",
      en: "Under certain circumstances you have the right to request the erasure of your personal data. This right is not absolute and we may have legal grounds for retaining the data.",
    },
  },
  {
    h: { cs: "Právo na omezení zpracování", en: "Right to restriction of processing" },
    t: {
      cs: "Za určitých okolností máte právo požadovat omezení zpracování vašich osobních údajů.",
      en: "Under certain circumstances you have the right to request the restriction of the processing of your personal data.",
    },
  },
  {
    h: { cs: "Právo na přenositelnost údajů", en: "Right to data portability" },
    t: {
      cs: "Máte právo získat osobní údaje, které jste nám poskytli, ve strukturovaném, běžně používaném a strojově čitelném formátu.",
      en: "You have the right to receive the personal data you have provided to us in a structured, commonly used and machine-readable format.",
    },
  },
  {
    h: { cs: "Právo vznést námitku", en: "Right to object" },
    t: {
      cs: "Máte právo vznést námitku proti zpracování vašich osobních údajů, které je prováděno na základě oprávněného zájmu.",
      en: "You have the right to object to the processing of your personal data that is carried out on the basis of legitimate interest.",
    },
  },
  {
    h: { cs: "Právo odvolat souhlas", en: "Right to withdraw consent" },
    t: {
      cs: "Pokud je zpracování založeno na souhlasu, máte právo tento souhlas kdykoli odvolat. Odvolání souhlasu nemá vliv na zákonnost zpracování založeného na souhlasu uděleném před jeho odvoláním.",
      en: "Where processing is based on consent, you have the right to withdraw that consent at any time. The withdrawal of consent does not affect the lawfulness of processing based on consent given before its withdrawal.",
    },
  },
  {
    h: {
      cs: "Právo podat stížnost u dozorového úřadu",
      en: "Right to lodge a complaint with a supervisory authority",
    },
    t: {
      cs: "Máte právo podat stížnost u Úřadu pro ochranu osobních údajů, pokud se domníváte, že zpracování vašich osobních údajů porušuje právní předpisy.",
      en: "You have the right to lodge a complaint with the Office for Personal Data Protection if you believe that the processing of your personal data breaches legal regulations.",
    },
  },
];

export default async function Gdpr() {
  const locale = await getLocale();
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss-soft">
          {pick(locale, { cs: "Právní informace", en: "Legal information" })}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-moss-deep sm:text-4xl">
          {pick(locale, { cs: "Ochrana osobních údajů", en: "Privacy policy" })}
        </h1>

        <Prose className="mt-10">
          <h2>{pick(locale, { cs: "Úvod", en: "Introduction" })}</h2>
          <p>
            {pick(locale, {
              cs: "Spolek Nech mě růst z.s. respektuje vaše soukromí a zavazuje se chránit vaše osobní údaje. Tento dokument vás informuje o tom, jak zpracováváme vaše osobní údaje v souladu s nařízením Evropského parlamentu a Rady (EU) 2016/679 o ochraně fyzických osob v souvislosti se zpracováním osobních údajů (GDPR) a zákonem č. 110/2019 Sb., o zpracování osobních údajů.",
              en: "The Nech mě růst z.s. association respects your privacy and is committed to protecting your personal data. This document informs you about how we process your personal data in accordance with Regulation (EU) 2016/679 of the European Parliament and of the Council on the protection of natural persons with regard to the processing of personal data (GDPR) and Act No. 110/2019 Coll., on the processing of personal data.",
            })}
          </p>

          <h2>{pick(locale, { cs: "1. Správce osobních údajů", en: "1. Data controller" })}</h2>
          <p>
            <strong>{pick(locale, { cs: "Název:", en: "Name:" })}</strong> Nech mě růst, z.s.<br />
            <strong>{pick(locale, { cs: "Sídlo:", en: "Registered office:" })}</strong> Dandova 2619/13, Horní Počernice, 193 00 Praha<br />
            <strong>IČ:</strong> 19602529<br />
            <strong>{pick(locale, { cs: "E-mail:", en: "E-mail:" })}</strong> info@nechmerust.org<br />
            <strong>{pick(locale, { cs: "Zápis:", en: "Registration:" })}</strong>{" "}
            {pick(locale, {
              cs: "Spolek je zapsán ve spolkovém rejstříku vedeném Městským soudem v Praze",
              en: "The association is registered in the register of associations maintained by the Municipal Court in Prague",
            })}
          </p>

          <h2>
            {pick(locale, {
              cs: "2. Účely a právní základ zpracování osobních údajů",
              en: "2. Purposes and legal basis for processing personal data",
            })}
          </h2>
          <p>
            {pick(locale, {
              cs: "Vaše osobní údaje zpracováváme pro následující účely a na základě těchto právních důvodů:",
              en: "We process your personal data for the following purposes and on the following legal grounds:",
            })}
          </p>
          {purposes.map((p) => (
            <div key={p.h.cs}>
              <h3>{pick(locale, p.h)}</h3>
              <p><strong>{pick(locale, { cs: "Účel:", en: "Purpose:" })}</strong> {pick(locale, p.purpose)}</p>
              <p><strong>{pick(locale, { cs: "Právní základ:", en: "Legal basis:" })}</strong> {pick(locale, p.basis)}</p>
              <p><strong>{pick(locale, { cs: "Zpracovávané údaje:", en: "Data processed:" })}</strong> {pick(locale, p.data)}</p>
            </div>
          ))}

          <h2>
            {pick(locale, {
              cs: "3. Doba uložení osobních údajů",
              en: "3. Retention period of personal data",
            })}
          </h2>
          <p>
            {pick(locale, {
              cs: "Osobní údaje uchováváme pouze po dobu nezbytně nutnou k naplnění účelu, pro který byly shromážděny:",
              en: "We keep personal data only for the time strictly necessary to fulfil the purpose for which it was collected:",
            })}
          </p>
          <ul>
            {retention.map((r) => (
              <li key={r.k.cs}><strong>{pick(locale, r.k)}:</strong> {pick(locale, r.v)}</li>
            ))}
          </ul>

          <h2>{pick(locale, { cs: "4. Příjemci osobních údajů", en: "4. Recipients of personal data" })}</h2>
          <p>
            {pick(locale, {
              cs: "Vaše osobní údaje můžeme předávat následujícím kategoriím příjemců:",
              en: "We may pass your personal data on to the following categories of recipients:",
            })}
          </p>
          <ul>
            <li>
              <strong>{pick(locale, { cs: "Orgány veřejné moci:", en: "Public authorities:" })}</strong>{" "}
              {pick(locale, {
                cs: "Finanční úřad, soudy, policie (v případě zákonné povinnosti)",
                en: "the tax office, courts, the police (where there is a legal obligation)",
              })}
            </li>
            <li>
              <strong>{pick(locale, { cs: "Poskytovatelé IT služeb:", en: "IT service providers:" })}</strong>{" "}
              {pick(locale, {
                cs: "Hosting webových stránek, e-mailové služby",
                en: "website hosting, e-mail services",
              })}
            </li>
            <li>
              <strong>{pick(locale, { cs: "Účetní a daňoví poradci:", en: "Accounting and tax advisers:" })}</strong>{" "}
              {pick(locale, {
                cs: "Pro zpracování účetnictví a daňových povinností",
                en: "for the processing of accounting and tax obligations",
              })}
            </li>
            <li>
              <strong>{pick(locale, { cs: "Platební brány:", en: "Payment gateways:" })}</strong>{" "}
              {pick(locale, {
                cs: "Pro zpracování darů a plateb (pokud platíte online)",
                en: "for the processing of donations and payments (if you pay online)",
              })}
            </li>
          </ul>
          <p>
            {pick(locale, {
              cs: "Všichni zpracovatelé jsou pečlivě vybráni a zavázáni smlouvou k ochraně vašich osobních údajů.",
              en: "All processors are carefully selected and bound by contract to protect your personal data.",
            })}
          </p>

          <h2>
            {pick(locale, {
              cs: "5. Vaše práva jako subjektu údajů",
              en: "5. Your rights as a data subject",
            })}
          </h2>
          <p>
            {pick(locale, {
              cs: "V souvislosti se zpracováním vašich osobních údajů máte následující práva:",
              en: "In connection with the processing of your personal data you have the following rights:",
            })}
          </p>
          {rights.map((r) => (
            <div key={r.h.cs}>
              <h3>{pick(locale, r.h)}</h3>
              <p>{pick(locale, r.t)}</p>
            </div>
          ))}
          <p>
            <strong>{pick(locale, { cs: "Úřad pro ochranu osobních údajů", en: "Office for Personal Data Protection" })}</strong><br />
            Pplk. Sochora 27, 170 00 Praha 7<br />
            {pick(locale, { cs: "Web:", en: "Website:" })} www.uoou.cz<br />
            {pick(locale, { cs: "E-mail:", en: "E-mail:" })} posta@uoou.cz
          </p>
          <p>
            {pick(locale, {
              cs: "Pro uplatnění vašich práv nás kontaktujte na e-mailu info@nechmerust.org. Vaši žádost vyřídíme bez zbytečného odkladu, nejpozději do 1 měsíce od jejího obdržení.",
              en: "To exercise your rights, contact us at info@nechmerust.org. We will handle your request without undue delay, no later than 1 month from its receipt.",
            })}
          </p>

          <h2>{pick(locale, { cs: "6. Cookies a analytické nástroje", en: "6. Cookies and analytics tools" })}</h2>
          <h3>{pick(locale, { cs: "Co jsou cookies?", en: "What are cookies?" })}</h3>
          <p>
            {pick(locale, {
              cs: "Cookies jsou malé textové soubory, které se ukládají do vašeho zařízení při návštěvě webových stránek. Analytické cookies spouštíme výhradně s vaším souhlasem.",
              en: "Cookies are small text files that are stored on your device when you visit a website. We activate analytics cookies solely with your consent.",
            })}
          </p>
          <h3>{pick(locale, { cs: "Přehled cookies", en: "Overview of cookies" })}</h3>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>{pick(locale, { cs: "Účel", en: "Purpose" })}</th>
                <th>{pick(locale, { cs: "Platnost", en: "Validity" })}</th>
                <th>{pick(locale, { cs: "Vydavatel", en: "Issuer" })}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>cookieConsent</td><td>{pick(locale, { cs: "Uložení vašeho rozhodnutí o cookies", en: "Storing your decision about cookies" })}</td><td>{pick(locale, { cs: "1 rok", en: "1 year" })}</td><td>nechmerust.org</td></tr>
              <tr><td>language</td><td>{pick(locale, { cs: "Uložení jazykového nastavení", en: "Storing the language setting" })}</td><td>{pick(locale, { cs: "1 rok", en: "1 year" })}</td><td>nechmerust.org</td></tr>
              <tr><td>_ga</td><td>{pick(locale, { cs: "Statistika návštěvnosti (Google Analytics) – pouze se souhlasem", en: "Traffic statistics (Google Analytics) – only with consent" })}</td><td>{pick(locale, { cs: "2 roky", en: "2 years" })}</td><td>Google LLC (USA)*</td></tr>
              <tr><td>_gid</td><td>{pick(locale, { cs: "Statistika relací (Google Analytics) – pouze se souhlasem", en: "Session statistics (Google Analytics) – only with consent" })}</td><td>{pick(locale, { cs: "24 hodin", en: "24 hours" })}</td><td>Google LLC (USA)*</td></tr>
              <tr><td>_ga_*</td><td>{pick(locale, { cs: "Statistika relací (Google Analytics) – pouze se souhlasem", en: "Session statistics (Google Analytics) – only with consent" })}</td><td>{pick(locale, { cs: "2 roky", en: "2 years" })}</td><td>Google LLC (USA)*</td></tr>
            </tbody>
          </table>
          <p className="text-sm text-text-muted">
            {pick(locale, {
              cs: "* Google LLC sídlí v USA. Přenos osobních údajů je zajištěn prostřednictvím standardních smluvních doložek (SCC) dle čl. 46 odst. 2 písm. c) GDPR. Více informací: policies.google.com/privacy.",
              en: "* Google LLC is based in the USA. The transfer of personal data is ensured through standard contractual clauses (SCC) pursuant to Art. 46(2)(c) GDPR. More information: policies.google.com/privacy.",
            })}
          </p>
          <h3>{pick(locale, { cs: "Správa souhlasu", en: "Managing consent" })}</h3>
          <p>
            {pick(locale, {
              cs: "Souhlas s analytickými cookies lze kdykoli změnit.",
              en: "Consent to analytics cookies can be changed at any time.",
            })}
          </p>
          <h3>{pick(locale, { cs: "Jak spravovat cookies v prohlížeči?", en: "How to manage cookies in your browser?" })}</h3>
          <p>
            {pick(locale, {
              cs: "Cookies lze spravovat nebo blokovat také v nastavení vašeho webového prohlížeče. Upozorňujeme, že zablokování některých cookies může ovlivnit funkčnost stránek.",
              en: "Cookies can also be managed or blocked in your web browser’s settings. Please note that blocking some cookies may affect the functionality of the website.",
            })}
          </p>

          <h2>{pick(locale, { cs: "7. Zabezpečení osobních údajů", en: "7. Security of personal data" })}</h2>
          <p>
            {pick(locale, {
              cs: "Přijali jsme vhodná technická a organizační opatření k ochraně vašich osobních údajů před neoprávněným nebo protiprávním zpracováním a před náhodnou ztrátou, zničením nebo poškozením. Přístup k osobním údajům mají pouze oprávněné osoby, které jsou vázány povinností mlčenlivosti.",
              en: "We have adopted appropriate technical and organisational measures to protect your personal data against unauthorised or unlawful processing and against accidental loss, destruction or damage. Only authorised persons bound by an obligation of confidentiality have access to personal data.",
            })}
          </p>

          <h2>
            {pick(locale, {
              cs: "8. Změny zásad ochrany osobních údajů",
              en: "8. Changes to the privacy policy",
            })}
          </h2>
          <p>
            {pick(locale, {
              cs: "Tyto zásady ochrany osobních údajů můžeme čas od času aktualizovat. O jakýchkoli změnách vás budeme informovat zveřejněním nových zásad na této stránce. Doporučujeme pravidelně kontrolovat tuto stránku, abyste byli informováni o tom, jak chráníme vaše osobní údaje.",
              en: "We may update this privacy policy from time to time. We will inform you of any changes by publishing the new policy on this page. We recommend that you check this page regularly to stay informed about how we protect your personal data.",
            })}
          </p>
          <p className="text-sm text-text-muted">
            {pick(locale, {
              cs: "Datum poslední aktualizace: 29. ledna 2026",
              en: "Last updated: 29 January 2026",
            })}
          </p>

          <h2>{pick(locale, { cs: "9. Kontakt", en: "9. Contact" })}</h2>
          <p>
            {pick(locale, {
              cs: "Máte-li jakékoli dotazy ohledně zpracování vašich osobních údajů nebo chcete-li uplatnit svá práva, kontaktujte nás prosím:",
              en: "If you have any questions about the processing of your personal data or wish to exercise your rights, please contact us:",
            })}
          </p>
          <p>
            <strong>Nech mě růst, z.s.</strong><br />
            Dandova 2619/13, Horní Počernice, 193 00 Praha<br />
            info@nechmerust.org<br />
            IČ: 19602529
          </p>
        </Prose>
      </Container>
    </section>
  );
}
