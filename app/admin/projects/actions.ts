"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ProjectInput {
  title: string;
  summary: string;
  description: string;
  image_url: string | null;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  display_order: number;
  is_visible: boolean;
}

function revalidate() {
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

export async function createProject(input: ProjectInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").insert(input);
  if (error) return { error: error.message };
  revalidate();
  return { error: null };
}

export async function updateProject(id: string, input: ProjectInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").update(input).eq("id", id);
  if (error) return { error: error.message };
  revalidate();
  return { error: null };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidate();
  return { error: null };
}
