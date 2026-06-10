// Supabase client for use on the SERVER (Server Components, Route Handlers).
// Reads the logged-in session from cookies so server-rendered pages know who
// the user is. Used for server-side data reads and the /admin auth check.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll was called from a Server Component, which can't set cookies.
            // Safe to ignore when session refresh is handled in middleware.
          }
        },
      },
    },
  );
}
