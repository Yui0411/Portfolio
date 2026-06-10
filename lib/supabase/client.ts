// Supabase client for use in the BROWSER (Client Components: "use client").
// Used by interactive pages like /login and the /admin CMS forms.
// Safe to expose: it uses the public anon/publishable key, and the database's
// Row Level Security rules decide what this client is actually allowed to do.
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
