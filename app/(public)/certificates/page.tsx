import { createClient } from "@/lib/supabase/server";
import CertificateTimeline from "@/components/timeline/CertificateTimeline";
import type { Certificate } from "@/types";

export default async function CertificatesPage() {
  const supabase = await createClient();

  const { data: certificates, error } = await supabase
    .from("certificates")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">Certificates</h1>
        <p className="text-sm text-red-500">
          Failed to load certificates: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Certificates</h1>
      <CertificateTimeline
        certificates={(certificates ?? []) as Certificate[]}
      />
    </div>
  );
}
