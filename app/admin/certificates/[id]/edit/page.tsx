import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CertificateForm from "@/components/admin/CertificateForm";
import type { Certificate } from "@/types";

export default async function EditCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("certificates")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit certificate</h1>
      <CertificateForm initial={data as Certificate} />
    </div>
  );
}
