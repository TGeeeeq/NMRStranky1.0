import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { SocialSection } from "@/components/SocialSection";
import { CryptoCard, type Crypto } from "@/components/CryptoCard";

export const metadata: Metadata = {
  title: "Přispět kryptoměnou",
  description: "Podpořte nás libovolnou z těchto kryptoměn — Bitcoin, Ethereum, Cardano, BNB nebo Pi.",
  alternates: { canonical: "/prispet-kryptem" },
};

const cryptos: Crypto[] = [
  {
    name: "Bitcoin (BTC)",
    logo: "/assets/bitcoin-logo.png",
    qr: "/assets/btc-qr.png",
    address: "bc1qe2hae5fq447rw095krcwwmamwrwy0plkkrw8as",
    description: "Bitcoin je první a nejznámější kryptoměna.",
  },
  {
    name: "Ethereum (ETH)",
    logo: "/assets/ethereum-logo.png",
    qr: "/assets/eth-qr.png",
    address: "0x13ACe35dac602401da21F36348Dcf37b7Fef5389",
    description: "Ethereum je druhá nejrozšířenější kryptoměna.",
  },
  {
    name: "Cardano (ADA)",
    logo: "/assets/cardano-logo.png",
    qr: "/assets/ada-qr.png",
    address:
      "addr1qx868v7umt2da0td3l7nsa990fwag37lllt82m4espzmnczscqvg9wk7adqdma8zcw60x2ru5uck9t0hr5far84c654sn4jxn4",
    description: "Cardano je moderní proof-of-stake blockchain.",
  },
  {
    name: "Binance Coin (BNB)",
    logo: "/assets/bnb-logo.png",
    qr: "/assets/bnb-qr.png",
    address: "0x13ACe35dac602401da21F36348Dcf37b7Fef5389",
    description: "Binance Coin je kryptoměna burzy Binance.",
  },
  {
    name: "Pi Network (Pi)",
    logo: "/assets/pi-logo.png",
    qr: "/assets/pi-qr.png",
    address: "GDFQXJ2VMVH6MAJMZHJG4W57WHEZ26HFC42NHAVV4W7H56SEUVDAZMM6",
    description: "Pi Network je mobilní kryptoměna. Chcete-li těžit Pi, použijte odkaz níže.",
    mineUrl: "https://minepi.com/bhaktidas108",
  },
];

export default function PrispetKryptem() {
  return (
    <>
      <PageHero
        image="/assets/hero-image.webp"
        imageAlt="Přispět kryptem"
        eyebrow="Moderní podpora"
        title="Přispět kryptoměnou"
        subtitle="Podpořte nás libovolnou z těchto kryptoměn."
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
