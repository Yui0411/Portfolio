// A single clickable item on the timeline: a dot + a label.
// Presentational only — all state lives in the parent <Timeline>.
interface TimelineDotProps {
  title: string;
  subtitle?: string;
  active: boolean;
  onSelect: () => void;
}

export default function TimelineDot({
  title,
  subtitle,
  active,
  onSelect,
}: TimelineDotProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "true" : undefined}
        className="group flex w-full items-start gap-3 py-3 text-left"
      >
        {/* The dot. bg-background covers the vertical line behind it. */}
        <span
          className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 bg-background transition-colors ${
            active
              ? "border-foreground bg-foreground"
              : "border-foreground/40 group-hover:border-foreground"
          }`}
        />
        <span className="flex flex-col">
          <span
            className={`text-sm font-medium transition-colors ${
              active
                ? "text-foreground"
                : "text-foreground/60 group-hover:text-foreground"
            }`}
          >
            {title}
          </span>
          {subtitle && (
            <span className="text-xs text-foreground/40">{subtitle}</span>
          )}
        </span>
      </button>
    </li>
  );
}
