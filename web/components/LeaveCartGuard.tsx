"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/shop/CartProvider";

/**
 * Hlídá odchod z obchodu s rozpracovaným košíkem. Když má návštěvník něco
 * v košíku a klikne na odkaz mířící MIMO obchod (/obchod), navigaci pozdrží
 * a ukáže modál. Odkazy v rámci obchodu i externí odkazy nechá projít.
 *
 * Interceptace běží v capture fázi na document, takže zachytí i klik na
 * <Link> dřív, než stačí proběhnout klientská navigace Next.js.
 */
function itemsWord(n: number): string {
  if (n === 1) return "položku";
  if (n >= 2 && n <= 4) return "položky";
  return "položek";
}

export function LeaveCartGuard() {
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  // Vždy aktuální hodnoty pro document listener (bez stale closure).
  const stateRef = useRef({ count, pathname });
  useEffect(() => {
    stateRef.current = { count, pathname };
  }, [count, pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const { count, pathname } = stateRef.current;
      if (count <= 0) return;
      if (!pathname.startsWith("/obchod")) return;

      const target = e.target as Element | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return; // externí odkaz
      if (url.pathname === pathname) return; // stejná stránka / kotva
      if (url.pathname.startsWith("/obchod")) return; // pohyb v rámci obchodu

      // Odchod z obchodu s neprázdným košíkem → pozdržet a zeptat se.
      e.preventDefault();
      e.stopPropagation();
      setPending(url.pathname + url.search + url.hash);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!pending) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPending(null);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [pending]);

  if (!pending) return null;

  const leave = () => {
    const to = pending;
    setPending(null);
    router.push(to);
  };
  const toCart = () => {
    setPending(null);
    router.push("/obchod/kosik");
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-moss-deep/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-cart-title"
      onClick={() => setPending(null)}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-surface p-6 shadow-lift sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Zavřít"
          onClick={() => setPending(null)}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
        >
          <X size={20} />
        </button>

        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-pill bg-terracotta/10 text-terracotta">
          <ShoppingBag size={24} aria-hidden />
        </div>

        <h2 id="leave-cart-title" className="font-serif text-2xl font-semibold text-moss-deep">
          Máte rozpracovaný nákup
        </h2>
        <p className="mt-2 leading-relaxed text-text-muted">
          V košíku máte {count} {itemsWord(count)}. Když teď odejdete z obchodu, nákup
          nedokončíte. Chcete se vrátit do košíku?
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            onClick={toCart}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-pill bg-moss px-5 py-3 font-medium text-cream shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <ShoppingBag size={18} aria-hidden /> Zpět do košíku
          </button>
          <button
            type="button"
            onClick={leave}
            className="inline-flex flex-1 items-center justify-center rounded-pill border border-border px-5 py-3 font-medium text-text transition-colors hover:bg-surface-alt"
          >
            Přesto odejít
          </button>
        </div>
      </div>
    </div>
  );
}
