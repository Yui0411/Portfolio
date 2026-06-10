import type { ReactNode } from "react";

// Shared shell for the right-hand detail panel. The actual content
// (ExperiencePanel / ProjectPanel / CertificatePanel) is rendered as children.
export default function DetailPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-black/10 p-6 dark:border-white/15">
      {children}
    </div>
  );
}
