"use client";

import Timeline from "./Timeline";
import CertificatePanel from "@/components/panels/CertificatePanel";
import type { Certificate } from "@/types";

// Client wrapper for certificates. showLine={false} → dots only, no line.
export default function CertificateTimeline({
  certificates,
}: {
  certificates: Certificate[];
}) {
  return (
    <Timeline
      items={certificates}
      getLabel={(item) => ({ title: item.name, subtitle: item.issuer })}
      renderPanel={(item) => <CertificatePanel certificate={item} />}
      showLine={false}
      emptyMessage="No certificates added yet."
    />
  );
}
