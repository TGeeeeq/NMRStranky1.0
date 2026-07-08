export type NavItem = { href: string; label: string };

/** Primary navigation — mirrors the legacy site's navbar order. */
export const navItems: NavItem[] = [
  { href: "/", label: "Domů" },
  { href: "/o-nas", label: "O nás" },
  { href: "/jak-se-zapojit", label: "Jak se zapojit" },
  { href: "/novinky", label: "Novinky" },
  { href: "/zvireci-obyvatele", label: "Zvířecí obyvatelé" },
  { href: "/udalosti", label: "Události" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/galerie", label: "Galerie" },
  { href: "/loukarun", label: "Hra" },
  { href: "/obchod", label: "Obchod" },
];
