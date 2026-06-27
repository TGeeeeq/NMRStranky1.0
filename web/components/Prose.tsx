import { cn } from "@/lib/cn";

/**
 * Typographic wrapper for long-form legal text (VOP, GDPR).
 * Keeps a comfortable ~68ch measure and consistent heading rhythm.
 */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-[68ch] text-text",
        "[&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-moss-deep",
        "[&_h3]:mt-7 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-moss-deep",
        "[&_p]:mt-4 [&_p]:leading-relaxed",
        "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6",
        "[&_a]:text-moss [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-moss-deep",
        "[&_table]:mt-5 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
        "[&_th]:border [&_th]:border-border [&_th]:bg-surface-alt [&_th]:p-2.5 [&_th]:text-left",
        "[&_td]:border [&_td]:border-border [&_td]:p-2.5 [&_td]:align-top",
        "[&_strong]:font-semibold [&_strong]:text-moss-deep",
        className,
      )}
    >
      {children}
    </div>
  );
}
