import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { CryptoCard, type Crypto } from "@/components/CryptoCard";
import { getLocale } from "@/lib/i18n.server";
import { pick } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, { cs: "Přispět kryptoměnou", en: "Donate with crypto" }),
    description: pick(locale, {
      cs: "Podpořte nás libovolnou z těchto kryptoměn — Bitcoin, Ethereum, Cardano, BNB nebo Pi.",
      en: "Support us with any of these cryptocurrencies — Bitcoin, Ethereum, Cardano, BNB or Pi.",
    }),
    alternates: { canonical: "/prispet-kryptem" },
  };
}

const cryptos: Crypto[] = [
  {
    name: "Bitcoin (BTC)",
    logo: "/assets/bitcoin-logo.png",
    qr: "/assets/btc-qr.png",
    address: "bc1qe2hae5fq447rw095krcwwmamwrwy0plkkrw8as",
    description: {
      cs: "Bitcoin je první a nejznámější kryptoměna.",
      en: "Bitcoin is the first and best-known cryptocurrency.",
    },
  },
  {
    name: "Ethereum (ETH)",
    logo: "/assets/ethereum-logo.png",
    qr: "/assets/eth-qr.png",
    address: "0x13ACe35dac602401da21F36348Dcf37b7Fef5389",
    description: {
      cs: "Ethereum je druhá nejrozšířenější kryptoměna.",
      en: "Ethereum is the second most widely used cryptocurrency.",
    },
  },
  {
    name: "Cardano (ADA)",
    logo: "/assets/cardano-logo.png",
    qr: "/assets/ada-qr.png",
    address:
      "addr1qx868v7umt2da0td3l7nsa990fwag37lllt82m4espzmnczscqvg9wk7adqdma8zcw60x2ru5uck9t0hr5far84c654sn4jxn4",
    description: {
      cs: "Cardano je moderní proof-of-stake blockchain.",
      en: "Cardano is a modern proof-of-stake blockchain.",
    },
  },
  {
    name: "Binance Coin (BNB)",
    logo: "/assets/bnb-logo.png",
    qr: "/assets/bnb-qr.png",
    address: "0x13ACe35dac602401da21F36348Dcf37b7Fef5389",
    description: {
      cs: "Binance Coin je kryptoměna burzy Binance.",
      en: "Binance Coin is the cryptocurrency of the Binance exchange.",
    },
  },
  {
    name: "Pi Network (Pi)",
    logo: "/assets/pi-logo.png",
    qr: "/assets/pi-qr.png",
    address: "GDFQXJ2VMVH6MAJMZHJG4W57WHEZ26HFC42NHAVV4W7H56SEUVDAZMM6",
    description: {
      cs: "Pi Network je mobilní kryptoměna. Chcete-li těžit Pi, použijte odkaz níže.",
      en: "Pi Network is a mobile cryptocurrency. To mine Pi, use the link below.",
    },
    mineUrl: "https://minepi.com/bhaktidas108",
  },
];

export default async function PrispetKryptem() {
  const locale = await getLocale();
  return (
    <>
      <PageHero
        image="/assets/krypto-hero.webp"
        imageAlt={pick(locale, {
          cs: "Krávy na pastvě pod prosvětlenou oblohou",
          en: "Cows grazing under a bright sky",
        })}
        eyebrow={pick(locale, { cs: "Moderní podpora", en: "Modern support" })}
        title={pick(locale, { cs: "Přispět kryptoměnou", en: "Donate with crypto" })}
        subtitle={pick(locale, {
          cs: "Podpořte nás libovolnou z těchto kryptoměn.",
          en: "Support us with any of these cryptocurrencies.",
        })}
      />

      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cryptos.map((c, i) => (
              <Reveal key={c.name} delay={(i % 3) * 0.06}>
                <CryptoCard crypto={c} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <SocialSection tone="alt" />
    </>
  );
}
