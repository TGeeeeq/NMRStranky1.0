import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export function AdminNav({ username }: { username?: string }) {
  const link = "rounded-md px-3 py-2 text-sm font-medium text-moss-deep hover:bg-surface-alt";
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-1 px-5 py-3">
        <span className="mr-4 font-serif font-semibold text-moss-deep">Administrace</span>
        <Link href="/admin" className={link}>Přehled</Link>
        <Link href="/admin/products" className={link}>Produkty</Link>
        <Link href="/admin/categories" className={link}>Kategorie</Link>
        <Link href="/admin/orders" className={link}>Objednávky</Link>
        <form action={logoutAction} className="ml-auto flex items-center gap-3">
          {username ? <span className="text-sm text-text-muted">{username}</span> : null}
          <button type="submit" className="rounded-md px-3 py-2 text-sm font-medium text-terracotta hover:bg-surface-alt">Odhlásit</button>
        </form>
      </div>
    </div>
  );
}
