import type { Experience } from "@/types";
import { formatDateRange } from "@/lib/format";

// Content shown in the detail panel when a job dot is selected.
export default function ExperiencePanel({
  experience,
}: {
  experience: Experience;
}) {
  return (
    <article className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {experience.company}
        </h2>
        <p className="text-foreground/70">{experience.role}</p>
        <p className="text-sm text-foreground/40">
          {formatDateRange(experience.start_date, experience.end_date)}
        </p>
      </div>

      <p className="whitespace-pre-line text-foreground/70">
        {experience.description}
      </p>

      {experience.tech_stack.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {experience.tech_stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-black/10 px-3 py-1 text-xs text-foreground/70 dark:border-white/15"
            >
              {tech}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
