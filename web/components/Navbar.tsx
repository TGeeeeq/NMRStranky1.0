"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Heart } from "lucide-react";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/cn";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-surface/85 backdrop-blur-md">
      <nav
        aria-label="Hlavní navigace"
        className="mx-auto flex h-[70px] max-w-[1180px] items-center justify-between px-5 sm:px-6 lg:px-8"
      >
        <Link href="/" aria-label="Nech mě růst – domů" className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="Nech mě růst"
            width={56}
            height={56}
            priority
            className="h-14 w-auto"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "text-[15px] font-medium text-text transition-colors hover:text-moss",
                  isActive(item.href) && "text-moss",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/virtualni-adopce"
            className="hidden items-center gap-2 rounded-pill bg-moss px-5 py-2 text-sm font-medium text-cream shadow-soft transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <Heart size={16} aria-hidden /> Přispět
          </Link>
          <button
            type="button"
            aria-label="Otevřít menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-moss-deep lg:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open ? (
        <div id="mobile-nav" className="border-t border-border/60 bg-surface lg:hidden">
          <ul className="flex flex-col px-5 py-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block py-2.5 text-base font-medium text-text",
                    isActive(item.href) && "text-moss",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link
                href="/virtualni-adopce"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-pill bg-moss px-5 py-3 font-medium text-cream"
              >
                <Heart size={16} aria-hidden /> Přispět
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
