import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

// Home page — hero/welcome section, content pulled from the editable
// `profile` singleton in Supabase (managed from the admin CMS).
export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profile")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const profile = data as Profile | null;

  // Fall back to friendly placeholders until the profile is filled in.
  const name = profile?.name?.trim() || "Your Name";
  const title = profile?.title?.trim() || "Full-Stack Developer";
  const bio =
    profile?.bio?.trim() ||
    "A short welcome message goes here — who you are, what you do, and what you're looking for. Edit this from the admin dashboard.";

  return (
    <section className="flex flex-col items-start gap-4 py-12">
      <p className="text-sm font-medium uppercase tracking-widest text-foreground/50">
        Welcome
      </p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Hi, I&apos;m {name}.
      </h1>
      <p className="text-xl text-foreground/60">{title}</p>
      <p className="max-w-prose whitespace-pre-line text-lg text-foreground/70">
        {bio}
      </p>
    </section>
  );
}
