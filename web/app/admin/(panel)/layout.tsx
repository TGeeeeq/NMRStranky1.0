import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="min-h-screen bg-surface-alt/40">
      <AdminNav username={session.username} />
      <div className="mx-auto max-w-[1180px] px-5 py-8">{children}</div>
    </div>
  );
}
