import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import VisitsChart from "@/components/admin/VisitsChart";

// Admin dashboard: content counts + visitor analytics (Australia-only, to
// filter out overseas datacenter bots).
export default async function AdminDashboard() {
  const supabase = await createClient();

  const now = new Date();
  const twoWeeksAgo = new Date(
    now.getTime() - 14 * 24 * 60 * 60 * 1000,
  ).toISOString();
  // Start of the month five months back → covers 6 calendar months incl. this one.
  const sixMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 5,
    1,
  ).toISOString();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [experience, projects, certificates, recent, sixMonth] =
    await Promise.all([
      supabase.from("experience").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("certificates").select("*", { count: "exact", head: true }),
      // Visits in the last 2 weeks, Australia only.
      supabase
        .from("analytics")
        .select("*", { count: "exact", head: true })
        .eq("country", "Australia")
        .gte("created_at", twoWeeksAgo),
      // Rows for the 6-month chart, Australia only.
      supabase
        .from("analytics")
        .select("created_at")
        .eq("country", "Australia")
        .gte("created_at", sixMonthsAgo),
    ]);

  const cards = [
    { label: "Experience", count: experience.count ?? 0, href: "/admin/experience" },
    { label: "Projects", count: projects.count ?? 0, href: "/admin/projects" },
    { label: "Certificates", count: certificates.count ?? 0, href: "/admin/certificates" },
  ];

  // Bucket the last 6 months (oldest → newest), including empty months.
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString("en-US", { month: "short" }),
      count: 0,
    };
  });
  for (const row of sixMonth.data ?? []) {
    const d = new Date(row.created_at as string);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.count += 1;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Signed in as {user?.email}</p>
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

      <div className="rounded-xl border p-5 sm:w-fit">
        <div className="text-3xl font-semibold tabular-nums">
          {recent.count ?? 0}
        </div>
        <div className="text-sm text-muted-foreground">
          Visits · last 2 weeks (Australia)
        </div>
      </div>

      <VisitsChart data={months.map(({ label, count }) => ({ label, count }))} />
    </div>
  );
}
