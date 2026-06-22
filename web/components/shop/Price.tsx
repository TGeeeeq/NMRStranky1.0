import { formatCzk } from "@/lib/money";

export function Price({ value, className }: { value: string | number; className?: string }) {
  return <span className={className}>{formatCzk(value)}</span>;
}
