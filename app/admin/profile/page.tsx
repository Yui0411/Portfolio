import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/admin/ProfileForm";
import type { Profile } from "@/types";

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profile")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          This content appears on your home page.
        </p>
      </div>
      <ProfileForm initial={(data as Profile) ?? null} />
    </div>
  );
}
