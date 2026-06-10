import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/admin/ProjectForm";
import type { Project } from "@/types";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit project</h1>
      <ProjectForm initial={data as Project} />
    </div>
  );
}
