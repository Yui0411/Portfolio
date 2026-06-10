import { createClient } from "@/lib/supabase/server";
import ProjectTimeline from "@/components/timeline/ProjectTimeline";
import type { Project } from "@/types";

export default async function ProjectsPage() {
  const supabase = await createClient();

  // Read visible projects in timeline order. Row Level Security also restricts
  // anonymous visitors to is_visible = true, so this is safe either way.
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-sm text-red-500">
          Failed to load projects: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
      <ProjectTimeline projects={(projects ?? []) as Project[]} />
    </div>
  );
}
