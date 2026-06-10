"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CertificateInput {
  name: string;
  issuer: string;
  image_url: string | null;
  verify_url: string | null;
  display_order: number;
}

function revalidate() {
  revalidatePath("/admin/certificates");
  revalidatePath("/certificates");
}

export async function createCertificate(input: CertificateInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("certificates").insert(input);
  if (error) return { error: error.message };
  revalidate();
  return { error: null };
}

export async function updateCertificate(id: string, input: CertificateInput) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("certificates")
    .update(input)
    .eq("id", id);
  if (error) return { error: error.message };
  revalidate();
  return { error: null };
}

export async function deleteCertificate(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("certificates").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidate();
  return { error: null };
}
