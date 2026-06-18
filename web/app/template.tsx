import { PageTransition } from "@/components/PageTransition";

/** Remounts on each navigation (unique key per route), so PageTransition's
 *  enter animation replays. Chrome (Navbar/Footer) stays in layout.tsx. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
