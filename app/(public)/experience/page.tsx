import { createClient } from "@/lib/supabase/server";
import ExperienceTimeline from "@/components/timeline/ExperienceTimeline";
import type { Experience } from "@/types";

export default async function ExperiencePage() {
  const supabase = await createClient();

  const { data: experience, error } = await supabase
    .from("experience")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">Experience</h1>
        <p className="text-sm text-red-500">
          Failed to load experience: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Experience</h1>
      <ExperienceTimeline experience={(experience ?? []) as Experience[]} />
    </div>
  );
}
