"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-foreground/5 dark:border-white/20"
    >
      Sign out
    </button>
  );
}
