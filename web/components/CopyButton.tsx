"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

/** Copy a string to the clipboard with brief "Zkopírováno" feedback. */
export function CopyButton({
  value,
  label = "Kopírovat",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label}: ${value}`}
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-4 py-2 text-sm font-medium text-moss-deep transition-colors hover:bg-surface-alt",
        className,
      )}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "Zkopírováno" : label}
    </button>
  );
}
