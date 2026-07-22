"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "./CartProvider";
import { useLocale } from "@/components/LocaleProvider";
import { pick } from "@/lib/i18n";

export function AddToCartButton({ productId, disabled }: { productId: number; disabled?: boolean }) {
  const { add } = useCart();
  const { locale } = useLocale();
  const [added, setAdded] = useState(false);

  if (disabled) {
    return (
      <button type="button" disabled className="inline-flex items-center gap-2 rounded-pill bg-surface-alt px-6 py-3 font-medium text-text-muted">
        {pick(locale, { cs: "Vyprodáno", en: "Sold out" })}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        add(productId, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      }}
      className="inline-flex items-center gap-2 rounded-pill bg-moss px-6 py-3 font-medium text-cream transition-colors hover:bg-moss-deep"
    >
      {added ? (
        <>
          <Check size={18} aria-hidden /> {pick(locale, { cs: "Přidáno", en: "Added" })}
        </>
      ) : (
        <>
          <ShoppingBag size={18} aria-hidden /> {pick(locale, { cs: "Do košíku", en: "Add to cart" })}
        </>
      )}
    </button>
  );
}
