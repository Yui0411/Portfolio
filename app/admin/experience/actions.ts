"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// The shape of the data the form sends us.
export interface ExperienceInput {
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  tech_stack: string[];
  display_order: number;
}

// Re-render the pages that show experience data after a change.
function revalidate() {
  revalidatePath("/admin/experience");
  revalidatePath("/experience");
}

export async function createExperience(input: ExperienceInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("experience").insert(input);
  if (error) return { error: error.message };
  revalidate();
  return { error: null };
}

export async function updateExperience(id: string, input: ExperienceInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("experience").update(input).eq("id", id);
  if (error) return { error: error.message };
  revalidate();
  return { error: null };
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidate();
  return { error: null };
}
