import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExperienceForm from "@/components/admin/ExperienceForm";
import type { Experience } from "@/types";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("experience")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit experience</h1>
      <ExperienceForm initial={data as Experience} />
    </div>
  );
}
