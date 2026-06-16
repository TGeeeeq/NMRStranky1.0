import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů",
  description: "Zásady zpracování a ochrany osobních údajů spolku Nech mě růst, z.s. (GDPR).",
  alternates: { canonical: "/gdpr" },
};

const purposes = [
  {
    h: "E-shop a prodej produktů",
    purpose: "Vyřízení objednávky, doručení zboží, komunikace se zákazníkem a plnění zákonných povinností (účetnictví, daně)",
    basis: "Plnění smlouvy – čl. 6 odst. 1 písm. b) GDPR a plnění právní povinnosti – čl. 6 odst. 1 písm. c) GDPR",
    data: "Jméno, příjmení, doručovací adresa, fakturační adresa, e-mail, telefon, údaje o objednaném zboží",
  },
  {
    h: "Členská evidence",
    purpose: "Vedení evidence členů spolku, plnění práv a povinností vyplývajících z členství",
    basis: "Plnění smlouvy (členství ve spolku) – čl. 6 odst. 1 písm. b) GDPR",
    data: "Jméno, příjmení, datum narození, adresa, e-mail, telefon",
  },
  {
    h: "Dárci a podporovatelé",
    purpose: "Zpracování darů, vystavení potvrzení o daru pro daňové účely, komunikace s dárci",
    basis: "Plnění právní povinnosti (daňové předpisy) – čl. 6 odst. 1 písm. c) GDPR a oprávněný zájem – čl. 6 odst. 1 písm. f) GDPR",
    data: "Jméno, příjmení, adresa, e-mail, výše daru, datum daru",
  },
  {
    h: "Dobrovolníci",
    purpose: "Organizace dobrovolnické činnosti, komunikace s dobrovolníky",
    basis: "Oprávněný zájem – čl. 6 odst. 1 písm. f) GDPR (organizace činnosti spolku)",
    data: "Jméno, příjmení, e-mail, telefon",
  },
  {
    h: "Účastníci akcí a událostí",
    purpose: "Registrace na akce, komunikace o akcích, organizace akcí",
    basis: "Souhlas – čl. 6 odst. 1 písm. a) GDPR",
    data: "Jméno, příjmení, e-mail, telefon",
  },
  {
    h: "Virtuální adopce",
    purpose: "Zpracování virtuálních adopcí zvířat, zasílání informací o adoptovaných zvířatech",
    basis: "Plnění smlouvy – čl. 6 odst. 1 písm. b) GDPR",
    data: "Jméno, příjmení, e-mail, adresa (pro zasílání potvrzení)",
  },
  {
    h: "Kontaktní formuláře a dotazy",
    purpose: "Zodpovězení dotazů, komunikace se zájemci",
    basis: "Oprávněný zájem – čl. 6 odst. 1 písm. f) GDPR (komunikace se zájemci)",
    data: "Jméno, příjmení, e-mail, obsah dotazu",
  },
];

const retention = [
  ["Členové spolku", "Po dobu trvání členství a 10 let po jeho ukončení (archivační povinnost)"],
  ["Dárci", "10 let od poskytnutí daru (daňové předpisy)"],
  ["Dobrovolníci", "Po dobu spolupráce a 3 roky po jejím ukončení"],
  ["Účastníci akcí", "1 rok od konání akce (pokud není udělen souhlas s delším zpracováním)"],
  ["Virtuální adopce", "Po dobu trvání adopce a 3 roky po jejím ukončení"],
  ["Kontaktní formuláře", "2 roky od posledního kontaktu"],
  ["E-shop (zákazníci)", "Po dobu vyřízení objednávky a 10 let od konce účetního období (zákon o účetnictví)"],
];

const rights = [
  ["Právo na přístup k osobním údajům", "Máte právo získat od nás potvrzení, zda vaše osobní údaje zpracováváme, a pokud ano, máte právo získat přístup k těmto údajům a informacím o způsobu jejich zpracování."],
  ["Právo na opravu", "Máte právo na opravu nepřesných osobních údajů, které se vás týkají. Máte také právo na doplnění neúplných osobních údajů."],
  ["Právo na výmaz („právo být zapomenut“)", "Za určitých okolností máte právo požadovat výmaz vašich osobních údajů. Toto právo není absolutní a můžeme mít zákonné důvody pro zachování údajů."],
  ["Právo na omezení zpracování", "Za určitých okolností máte právo požadovat omezení zpracování vašich osobních údajů."],
  ["Právo na přenositelnost údajů", "Máte právo získat osobní údaje, které jste nám poskytli, ve strukturovaném, běžně používaném a strojově čitelném formátu."],
  ["Právo vznést námitku", "Máte právo vznést námitku proti zpracování vašich osobních údajů, které je prováděno na základě oprávněného zájmu."],
  ["Právo odvolat souhlas", "Pokud je zpracování založeno na souhlasu, máte právo tento souhlas kdykoli odvolat. Odvolání souhlasu nemá vliv na zákonnost zpracování založeného na souhlasu uděleném před jeho odvoláním."],
  ["Právo podat stížnost u dozorového úřadu", "Máte právo podat stížnost u Úřadu pro ochranu osobních údajů, pokud se domníváte, že zpracování vašich osobních údajů porušuje právní předpisy."],
];

export default function Gdpr() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss-soft">
          Právní informace
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-moss-deep sm:text-4xl">
          Ochrana osobních údajů
        </h1>

        <Prose className="mt-10">
          <h2>Úvod</h2>
          <p>
            Spolek Nech mě růst z.s. respektuje vaše soukromí a zavazuje se chránit vaše osobní
            údaje. Tento dokument vás informuje o tom, jak zpracováváme vaše osobní údaje v souladu
            s nařízením Evropského parlamentu a Rady (EU) 2016/679 o ochraně fyzických osob
            v souvislosti se zpracováním osobních údajů (GDPR) a zákonem č. 110/2019 Sb., o zpracování
            osobních údajů.
          </p>

          <h2>1. Správce osobních údajů</h2>
          <p>
            <strong>Název:</strong> Nech mě růst, z.s.<br />
            <strong>Sídlo:</strong> Dandova 2619/13, Horní Počernice, 193 00 Praha<br />
            <strong>IČ:</strong> 19602529<br />
            <strong>E-mail:</strong> info@nechmerust.org<br />
            <strong>Zápis:</strong> Spolek je zapsán ve spolkovém rejstříku vedeném Městským soudem
            v Praze
          </p>

          <h2>2. Účely a právní základ zpracování osobních údajů</h2>
          <p>Vaše osobní údaje zpracováváme pro následující účely a na základě těchto právních důvodů:</p>
          {purposes.map((p) => (
            <div key={p.h}>
              <h3>{p.h}</h3>
              <p><strong>Účel:</strong> {p.purpose}</p>
              <p><strong>Právní základ:</strong> {p.basis}</p>
              <p><strong>Zpracovávané údaje:</strong> {p.data}</p>
            </div>
          ))}

          <h2>3. Doba uložení osobních údajů</h2>
          <p>
            Osobní údaje uchováváme pouze po dobu nezbytně nutnou k naplnění účelu, pro který byly
            shromážděny:
          </p>
          <ul>
            {retention.map(([k, v]) => (
              <li key={k}><strong>{k}:</strong> {v}</li>
            ))}
          </ul>

          <h2>4. Příjemci osobních údajů</h2>
          <p>Vaše osobní údaje můžeme předávat následujícím kategoriím příjemců:</p>
          <ul>
            <li><strong>Orgány veřejné moci:</strong> Finanční úřad, soudy, policie (v případě zákonné povinnosti)</li>
            <li><strong>Poskytovatelé IT služeb:</strong> Hosting webových stránek, e-mailové služby</li>
            <li><strong>Účetní a daňoví poradci:</strong> Pro zpracování účetnictví a daňových povinností</li>
            <li><strong>Platební brány:</strong> Pro zpracování darů a plateb (pokud platíte online)</li>
          </ul>
          <p>
            Všichni zpracovatelé jsou pečlivě vybráni a zavázáni smlouvou k ochraně vašich osobních
            údajů.
          </p>

          <h2>5. Vaše práva jako subjektu údajů</h2>
          <p>V souvislosti se zpracováním vašich osobních údajů máte následující práva:</p>
          {rights.map(([h, t]) => (
            <div key={h}>
              <h3>{h}</h3>
              <p>{t}</p>
            </div>
          ))}
          <p>
            <strong>Úřad pro ochranu osobních údajů</strong><br />
            Pplk. Sochora 27, 170 00 Praha 7<br />
            Web: www.uoou.cz<br />
            E-mail: posta@uoou.cz
          </p>
          <p>
            Pro uplatnění vašich práv nás kontaktujte na e-mailu info@nechmerust.org. Vaši žádost
            vyřídíme bez zbytečného odkladu, nejpozději do 1 měsíce od jejího obdržení.
          </p>

          <h2>6. Cookies a analytické nástroje</h2>
          <h3>Co jsou cookies?</h3>
          <p>
            Cookies jsou malé textové soubory, které se ukládají do vašeho zařízení při návštěvě
            webových stránek. Analytické cookies spouštíme výhradně s vaším souhlasem.
          </p>
          <h3>Přehled cookies</h3>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Účel</th>
                <th>Platnost</th>
                <th>Vydavatel</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>cookieConsent</td><td>Uložení vašeho rozhodnutí o cookies</td><td>1 rok</td><td>nechmerust.org</td></tr>
              <tr><td>language</td><td>Uložení jazykového nastavení</td><td>1 rok</td><td>nechmerust.org</td></tr>
              <tr><td>_ga</td><td>Statistika návštěvnosti (Google Analytics) – pouze se souhlasem</td><td>2 roky</td><td>Google LLC (USA)*</td></tr>
              <tr><td>_gid</td><td>Statistika relací (Google Analytics) – pouze se souhlasem</td><td>24 hodin</td><td>Google LLC (USA)*</td></tr>
              <tr><td>_ga_*</td><td>Statistika relací (Google Analytics) – pouze se souhlasem</td><td>2 roky</td><td>Google LLC (USA)*</td></tr>
            </tbody>
          </table>
          <p className="text-sm text-text-muted">
            * Google LLC sídlí v USA. Přenos osobních údajů je zajištěn prostřednictvím standardních
            smluvních doložek (SCC) dle čl. 46 odst. 2 písm. c) GDPR. Více informací:
            policies.google.com/privacy.
          </p>
          <h3>Správa souhlasu</h3>
          <p>Souhlas s analytickými cookies lze kdykoli změnit.</p>
          <h3>Jak spravovat cookies v prohlížeči?</h3>
          <p>
            Cookies lze spravovat nebo blokovat také v nastavení vašeho webového prohlížeče.
            Upozorňujeme, že zablokování některých cookies může ovlivnit funkčnost stránek.
          </p>

          <h2>7. Zabezpečení osobních údajů</h2>
          <p>
            Přijali jsme vhodná technická a organizační opatření k ochraně vašich osobních údajů před
            neoprávněným nebo protiprávním zpracováním a před náhodnou ztrátou, zničením nebo
            poškozením. Přístup k osobním údajům mají pouze oprávněné osoby, které jsou vázány
            povinností mlčenlivosti.
          </p>

          <h2>8. Změny zásad ochrany osobních údajů</h2>
          <p>
            Tyto zásady ochrany osobních údajů můžeme čas od času aktualizovat. O jakýchkoli změnách
            vás budeme informovat zveřejněním nových zásad na této stránce. Doporučujeme pravidelně
            kontrolovat tuto stránku, abyste byli informováni o tom, jak chráníme vaše osobní údaje.
          </p>
          <p className="text-sm text-text-muted">Datum poslední aktualizace: 29. ledna 2026</p>

          <h2>9. Kontakt</h2>
          <p>
            Máte-li jakékoli dotazy ohledně zpracování vašich osobních údajů nebo chcete-li uplatnit
            svá práva, kontaktujte nás prosím:
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
