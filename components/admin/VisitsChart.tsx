// Simple dependency-free bar chart for monthly visits.
// Pure presentational — safe as a server component.
export default function VisitsChart({
  data,
}: {
  data: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="rounded-xl border p-5">
      <div className="mb-4 text-sm text-muted-foreground">
        Visits — last 6 months (Australia)
      </div>

      {/* Bars */}
      <div className="flex h-40 items-end gap-3">
        {data.map((d) => (
          <div
            key={d.label}
            className="min-h-[2px] flex-1 rounded-t bg-foreground/80"
            style={{ height: `${(d.count / max) * 100}%` }}
            title={`${d.label}: ${d.count} visits`}
          />
        ))}
      </div>

      {/* Labels + counts */}
      <div className="mt-2 flex gap-3">
        {data.map((d) => (
          <div key={d.label} className="flex-1 text-center text-xs">
            <div className="tabular-nums text-foreground">{d.count}</div>
            <div className="text-muted-foreground">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
