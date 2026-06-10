import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Admin dashboard: a quick summary of how much content exists, linking into
// each management section.
export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // `head: true` + `count: "exact"` fetches only the row count, not the rows.
  const [experience, projects, certificates] = await Promise.all([
    supabase.from("experience").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("certificates").select("*", { count: "exact", head: true }),
  ]);

  const cards = [
    {
      label: "Experience",
      count: experience.count ?? 0,
      href: "/admin/experience",
    },
    { label: "Projects", count: projects.count ?? 0, href: "/admin/projects" },
    {
      label: "Certificates",
      count: certificates.count ?? 0,
      href: "/admin/certificates",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Signed in as {user?.email}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border p-5 transition-colors hover:bg-foreground/5"
          >
            <div className="text-3xl font-semibold tabular-nums">
              {card.count}
            </div>
            <div className="text-sm text-muted-foreground">{card.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
