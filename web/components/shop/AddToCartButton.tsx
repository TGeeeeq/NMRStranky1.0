"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "./CartProvider";

export function AddToCartButton({ productId, disabled }: { productId: number; disabled?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  if (disabled) {
    return (
      <button type="button" disabled className="inline-flex items-center gap-2 rounded-pill bg-surface-alt px-6 py-3 font-medium text-text-muted">
        Vyprodáno
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
          <Check size={18} aria-hidden /> Přidáno
        </>
      ) : (
        <>
          <ShoppingBag size={18} aria-hidden /> Do košíku
        </>
      )}
    </button>
  );
}
