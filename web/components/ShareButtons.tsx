"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Link as LinkIcon, Mail, Share2 } from "lucide-react";
import { FacebookIcon, WhatsAppIcon, XIcon } from "@/components/BrandIcons";

const SHARE_URL = "https://nechmerust.org/seno";
const SHARE_TEXT =
  "Pomozte azylu Nech mě růst pořídit seno na zimu — sbírka Seno pro Louku 🌾";

const encodedUrl = encodeURIComponent(SHARE_URL);
const encodedText = encodeURIComponent(SHARE_TEXT);

const networks = [
  {
    label: "Facebook",
    icon: FacebookIcon,
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  },
  {
    label: "WhatsApp",
    icon: WhatsAppIcon,
    href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
  },
  {
    label: "X",
    icon: XIcon,
    href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
  },
  {
    label: "E-mail",
    icon: Mail,
    href: `mailto:?subject=${encodeURIComponent("Sbírka Seno pro Louku")}&body=${encodedText}%0A%0A${encodedUrl}`,
  },
];

const pillCls =
  "inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-4 py-2 text-sm font-medium text-moss-deep transition-colors hover:bg-surface-alt";

/** Tlačítka pro sdílení sbírky — nativní sdílení (na mobilech), nejběžnější
 *  sítě a zkopírování odkazu. */
const noopSubscribe = () => () => {};

export function ShareButtons() {
  // navigator.share existuje až v prohlížeči — na serveru rendrujeme false,
  // po hydrataci React hodnotu sám srovná bez rizika mismatch.
  const canShare = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator.share === "function",
    () => false,
  );
  const [copied, setCopied] = useState(false);

  async function nativeShare() {
    try {
      await navigator.share({ title: "Seno pro Louku", text: SHARE_TEXT, url: SHARE_URL });
    } catch {
      /* uživatel sdílení zavřel — nic se neděje */
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard nedostupný — no-op */
    }
  }

  return (
    <div className="mt-auto flex flex-wrap gap-2">
      {canShare ? (
        <button
          type="button"
          onClick={nativeShare}
          className="inline-flex items-center gap-2 rounded-pill bg-moss px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-moss-deep"
        >
          <Share2 size={16} aria-hidden /> Sdílet
        </button>
      ) : null}
      {networks.map((n) => (
        <a
          key={n.label}
          href={n.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Sdílet na ${n.label}`}
          className={pillCls}
        >
          <n.icon size={16} /> {n.label}
        </a>
      ))}
      <button type="button" onClick={copyLink} className={pillCls}>
        {copied ? <Check size={16} aria-hidden /> : <LinkIcon size={16} aria-hidden />}
        {copied ? "Zkopírováno" : "Kopírovat odkaz"}
      </button>
    </div>
  );
}
