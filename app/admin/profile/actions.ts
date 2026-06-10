"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ProfileInput {
  name: string;
  title: string;
  bio: string;
  email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
}

export async function updateProfile(input: ProfileInput) {
  const supabase = await createClient();
  // Upsert the single row (id = 1) so it works even if it doesn't exist yet.
  const { error } = await supabase.from("profile").upsert({
    id: 1,
    ...input,
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/profile");
  return { error: null };
}
