"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { Menu, X, Heart } from "lucide-react";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/cn";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 8));

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "border-border/70 bg-surface/95 shadow-soft"
          : "border-border/60 bg-surface/85",
      )}
    >
      <nav
        aria-label="Hlavní navigace"
        className={cn(
          "mx-auto flex max-w-[1180px] items-center justify-between px-5 transition-[height] duration-300 sm:px-6 lg:px-8",
          scrolled ? "h-[60px]" : "h-[70px]",
        )}
      >
        <Link href="/" aria-label="Nech mě růst – domů" className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="Nech mě růst"
            width={56}
            height={56}
            priority
            className={cn(
              "w-auto transition-[height] duration-300",
              scrolled ? "h-11" : "h-14",
            )}
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative inline-block text-[15px] font-medium text-text transition-colors hover:text-moss",
                    active && "text-moss",
                  )}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-pill bg-moss"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
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
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border/60 bg-surface lg:hidden"
          >
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
