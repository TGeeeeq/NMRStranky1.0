import Image from "next/image";
import { CopyButton } from "@/components/CopyButton";
import { BANK, SITE } from "@/lib/site";
import { SENO_CAMPAIGN } from "@/lib/campaign";

export type PaymentTip = { amount: string; covers: string };

/** QR platba + platební údaje sbírky — sdílené mezi vážnou a Karlovou verzí
 *  stránky /seno, aby čísla účtu a symboly existovala jen na jednom místě.
 *  data-karel-react atributy čte Karlův reakční listener (SenoKarelProvider). */
export function PaymentPanel({ tips, className = "" }: { tips: PaymentTip[]; className?: string }) {
  return (
    <div className={`flex flex-col items-center rounded-lg border border-border bg-surface-alt p-8 shadow-soft ${className}`}>
      <Image
        data-karel-react="qr"
        src="/assets/seno-qr.png"
        alt={`QR platba na transparentní účet ${SITE.name}, variabilní symbol ${SENO_CAMPAIGN.variableSymbol}`}
        width={240}
        height={240}
        className="h-56 w-56 rounded-md bg-white object-contain p-3 shadow-soft"
      />
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {tips.map((t) => (
          <span
            key={t.amount}
            data-karel-react="tip"
            className="rounded-pill border border-border bg-surface px-4 py-1.5 text-sm text-text"
          >
            <strong className="font-semibold text-moss-deep">{t.amount}</strong> = {t.covers}
          </span>
        ))}
      </div>
      <dl className="mt-6 w-full max-w-md space-y-2 text-sm text-text" data-karel-react="ucet">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="text-text-muted">Číslo účtu</dt>
          <dd className="flex items-center gap-3 font-medium">
            {BANK.account} <CopyButton value="2002645872/2010" />
          </dd>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="text-text-muted">IBAN</dt>
          <dd className="flex items-center gap-3 font-medium">
            {BANK.iban} <CopyButton value={BANK.iban.replace(/\s/g, "")} />
          </dd>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="text-text-muted">Variabilní symbol</dt>
          <dd className="flex items-center gap-3 font-medium">
            {SENO_CAMPAIGN.variableSymbol} <CopyButton value={SENO_CAMPAIGN.variableSymbol} />
          </dd>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="text-text-muted">Zpráva pro příjemce</dt>
          <dd className="font-medium">{SENO_CAMPAIGN.message}</dd>
        </div>
      </dl>
    </div>
  );
}
