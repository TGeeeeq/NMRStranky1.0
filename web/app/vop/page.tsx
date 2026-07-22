import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Prose } from "@/components/Prose";
import { getLocale } from "@/lib/i18n.server";
import { pick } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, {
      cs: "Všeobecné obchodní podmínky",
      en: "Terms & conditions",
    }),
    description: pick(locale, {
      cs: "Všeobecné obchodní podmínky spolku Nech mě růst, z.s.",
      en: "Terms & conditions of the Nech mě růst, z.s. association.",
    }),
    alternates: { canonical: "/vop" },
  };
}

export default async function Vop() {
  const locale = await getLocale();
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss-soft">
          {pick(locale, { cs: "Právní informace", en: "Legal information" })}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-moss-deep sm:text-4xl">
          {pick(locale, { cs: "Všeobecné obchodní podmínky", en: "Terms & conditions" })}
        </h1>

        <Prose className="mt-10">
          {locale === "en" ? (
            <>
              <h2>1. Introductory provisions</h2>
              <p>
                These terms &amp; conditions (hereinafter the “terms &amp; conditions”) of the
                association{" "}
                <strong>Nech mě růst, z.s.</strong>, with its registered office at Dandova 2619/13,
                Horní Počernice, 193 00 Praha, IČ: 19602529 (hereinafter the “seller”), govern the
                mutual rights and obligations arising in connection with or on the basis of a purchase
                contract concluded between the seller and another natural or legal person (hereinafter
                the “buyer”) through the seller’s online shop.
              </p>

              <h2>2. Information about goods and prices</h2>
              <p>
                Information about the goods, including the prices of individual goods and their main
                characteristics, is listed with each item in the shop’s catalogue. The prices of goods
                are inclusive of all taxes and fees. The prices of goods remain valid for as long as
                they are displayed in the online shop. This provision does not preclude the conclusion
                of a purchase contract on individually agreed terms.
              </p>

              <h2>3. Order and conclusion of the purchase contract</h2>
              <p>The buyer places an order for goods in the following ways:</p>
              <ul>
                <li>through their customer account, if they have previously registered in the online shop,</li>
                <li>by filling in the order form without registration.</li>
              </ul>
              <p>
                When placing an order, the buyer selects the goods, the number of items, and the method
                of payment and delivery. Before submitting the order, the buyer is able to check and
                change the data they have entered into the order.
              </p>

              <h2>4. Payment terms and delivery of goods</h2>
              <p>
                The buyer may pay the price of the goods and any costs associated with the delivery of
                the goods under the purchase contract in the following ways:
              </p>
              <ul>
                <li>by cashless transfer to the seller’s bank account no. <strong>2002645872 / 2010</strong>, held with Fio banka, a.s.</li>
              </ul>
              <p>
                The seller does not require the buyer to make any advance payment or other similar
                payment in advance. Payment of the purchase price before dispatch of the goods is not a
                deposit.
              </p>
              <h3>Delivery of goods</h3>
              <p>
                The seller dispatches the goods to the buyer within <strong>10 business days</strong> of
                receiving payment to the bank account. The delivery methods and their prices are listed
                in the order form. The risk of damage to the goods passes to the buyer at the moment the
                buyer takes over the goods from the carrier.
              </p>

              <h2>5. Withdrawal from the contract</h2>
              <p>
                A buyer who concluded the purchase contract outside their business activity as a
                consumer has the right to withdraw from the purchase contract without giving a reason
                within 14 days of taking over the goods.
              </p>
              <p>The buyer may not withdraw from the purchase contract, in particular, in the cases of:</p>
              <ul>
                <li>the supply of goods that were modified according to the buyer’s wishes or for their person,</li>
                <li>the supply of goods that are perishable, as well as goods that were irreversibly mixed with other goods after delivery,</li>
                <li>the supply of goods in sealed packaging that the buyer removed from the packaging and that cannot be returned for hygiene reasons.</li>
              </ul>

              <h2>6. Rights arising from defective performance and complaints procedure</h2>
              <p>
                The rights and obligations of the contracting parties regarding rights arising from
                defective performance are governed by the relevant generally binding legal regulations
                (in particular the provisions of §§ 1914 to 1925, §§ 2099 to 2117 and §§ 2161 to 2174 of
                the Civil Code and Act No. 634/1992 Coll., on consumer protection).
              </p>
              <h3>Complaints procedure</h3>
              <p>
                The buyer is obliged to assert a defect with the seller without undue delay, no later
                than within 24 months of taking over the goods. The buyer asserts a complaint by sending
                an e-mail to{" "}
                <strong>info@nechmerust.org</strong> with a description of the defect and a photograph of
                the defective goods.
              </p>
              <p>
                The seller decides on the complaint no later than within <strong>30 days</strong> of the
                day it is asserted (§ 19 of Act No. 634/1992 Coll.). A complaint may be resolved by
                repair, replacement of the goods, a reasonable discount, or a refund of the purchase
                price.
              </p>

              <h2>7. Out-of-court resolution of disputes</h2>
              <p>
                The Czech Trade Inspection Authority, with its registered office at Štěpánská 567/15,
                120 00 Praha 2, IČ: 000 20 869, website:{" "}
                <a href="https://www.coi.cz" target="_blank" rel="noopener noreferrer">www.coi.cz</a>, is
                competent for the out-of-court resolution of consumer disputes arising from the purchase
                contract.
              </p>
              <p>
                The online dispute resolution platform located at ec.europa.eu/consumers/odr may be used
                to resolve disputes between the seller and the buyer arising from a purchase contract
                concluded online.
              </p>

              <h2>8. Final provisions</h2>
              <p>
                All arrangements between the seller and the buyer are governed by the legal order of the
                Czech Republic. If the relationship established by the purchase contract contains an
                international element, the parties agree that the relationship is governed by the law of
                the Czech Republic. This does not affect the consumer’s rights arising from generally
                binding legal regulations.
              </p>
              <p className="text-sm text-text-muted">Last updated: 29 January 2026</p>
            </>
          ) : (
            <>
              <h2>1. Úvodní ustanovení</h2>
              <p>
                Tyto všeobecné obchodní podmínky (dále jen „obchodní podmínky“) spolku{" "}
                <strong>Nech mě růst, z.s.</strong>, se sídlem Dandova 2619/13, Horní Počernice, 193 00
                Praha, IČ: 19602529 (dále jen „prodávající“), upravují vzájemná práva a povinnosti
                vzniklé v souvislosti nebo na základě kupní smlouvy uzavírané mezi prodávajícím a jinou
                fyzickou či právnickou osobou (dále jen „kupující“) prostřednictvím internetového obchodu
                prodávajícího.
              </p>

              <h2>2. Informace o zboží a ceny</h2>
              <p>
                Informace o zboží, včetně uvedení cen jednotlivého zboží a jeho hlavních vlastností, jsou
                uvedeny u jednotlivého zboží v katalogu obchodu. Ceny zboží jsou uvedeny včetně všech daní
                a poplatků. Ceny zboží zůstávají v platnosti po dobu, po kterou jsou zobrazovány
                v internetovém obchodě. Toto ustanovení nevylučuje sjednání kupní smlouvy za individuálně
                sjednaných podmínek.
              </p>

              <h2>3. Objednávka a uzavření kupní smlouvy</h2>
              <p>Kupující provádí objednávku zboží těmito způsoby:</p>
              <ul>
                <li>prostřednictvím svého zákaznického účtu, provedl-li předchozí registraci v internetovém obchodě,</li>
                <li>vyplněním objednávkového formuláře bez registrace.</li>
              </ul>
              <p>
                Při zadávání objednávky si kupující vybere zboží, počet kusů zboží, způsob platby
                a doručení. Před odesláním objednávky je kupujícímu umožněno kontrolovat a měnit údaje,
                které do objednávky vložil.
              </p>

              <h2>4. Platební podmínky a doručení zboží</h2>
              <p>
                Cenu zboží a případné náklady spojené s dodáním zboží dle kupní smlouvy může kupující
                uhradit následujícími způsoby:
              </p>
              <ul>
                <li>bezhotovostně převodem na bankovní účet prodávajícího č. <strong>2002645872 / 2010</strong>, vedený u společnosti Fio banka, a.s.</li>
              </ul>
              <p>
                Prodávající nepožaduje od kupujícího předem žádnou zálohu či jinou obdobnou platbu. Úhrada
                kupní ceny před odesláním zboží není zálohou.
              </p>
              <h3>Dodání zboží</h3>
              <p>
                Prodávající odešle zboží kupujícímu do <strong>10 pracovních dnů</strong> od přijetí
                platby na bankovní účet. Způsoby doručení a jejich ceny jsou uvedeny v objednávkovém
                formuláři. Nebezpečí škody na zboží přechází na kupujícího okamžikem převzetí zboží od
                dopravce.
              </p>

              <h2>5. Odstoupení od smlouvy</h2>
              <p>
                Kupující, který uzavřel kupní smlouvu mimo svou podnikatelskou činnost jako spotřebitel,
                má právo od kupní smlouvy odstoupit bez udání důvodu ve lhůtě 14 dnů od převzetí zboží.
              </p>
              <p>Kupující nemůže odstoupit od kupní smlouvy zejména v případech:</p>
              <ul>
                <li>dodávky zboží, které bylo upraveno podle přání kupujícího nebo pro jeho osobu,</li>
                <li>dodávky zboží, které podléhá rychlé zkáze, jakož i zboží, které bylo po dodání nenávratně smíseno s jiným zbožím,</li>
                <li>dodávky zboží v uzavřeném obalu, které kupující z obalu vyňal a z hygienických důvodů jej není možné vrátit.</li>
              </ul>

              <h2>6. Práva z vadného plnění a reklamační postup</h2>
              <p>
                Práva a povinnosti smluvních stran ohledně práv z vadného plnění se řídí příslušnými
                obecně závaznými právními předpisy (zejména ustanoveními § 1914 až 1925, § 2099 až 2117
                a § 2161 až 2174 občanského zákoníku a zákonem č. 634/1992 Sb., o ochraně spotřebitele).
              </p>
              <h3>Reklamační postup</h3>
              <p>
                Vadu je kupující povinen uplatnit u prodávajícího bez zbytečného odkladu, nejpozději do
                24 měsíců od převzetí zboží. Reklamaci uplatňuje kupující zasláním e-mailu na adresu{" "}
                <strong>info@nechmerust.org</strong> s popisem vady a fotografií vadného zboží.
              </p>
              <p>
                Prodávající rozhodne o reklamaci nejpozději do <strong>30 dnů</strong> ode dne jejího
                uplatnění (§ 19 zák. č. 634/1992 Sb.). Reklamaci lze vyřídit opravou, výměnou zboží,
                přiměřenou slevou nebo vrácením kupní ceny.
              </p>

              <h2>7. Mimosoudní řešení sporů</h2>
              <p>
                K mimosoudnímu řešení spotřebitelských sporů z kupní smlouvy je příslušná Česká obchodní
                inspekce, se sídlem Štěpánská 567/15, 120 00 Praha 2, IČ: 000 20 869, internetová adresa:{" "}
                <a href="https://www.coi.cz" target="_blank" rel="noopener noreferrer">www.coi.cz</a>.
              </p>
              <p>
                Platformu pro řešení sporů on-line nacházející se na internetové adrese
                ec.europa.eu/consumers/odr je možné využít při řešení sporů mezi prodávajícím a kupujícím
                z kupní smlouvy uzavřené on-line.
              </p>

              <h2>8. Závěrečná ustanovení</h2>
              <p>
                Veškerá ujednání mezi prodávajícím a kupujícím se řídí právním řádem České republiky.
                Pokud vztah založený kupní smlouvou obsahuje mezinárodní prvek, pak strany sjednávají, že
                vztah se řídí právem České republiky. Tímto nejsou dotčena práva spotřebitele vyplývající
                z obecně závazných právních předpisů.
              </p>
              <p className="text-sm text-text-muted">Datum poslední aktualizace: 29. ledna 2026</p>
            </>
          )}
        </Prose>
      </Container>
    </section>
  );
}
