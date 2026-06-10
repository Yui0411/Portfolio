import type { Project } from "@/types";

// Content shown in the detail panel when a project dot is selected.
export default function ProjectPanel({ project }: { project: Project }) {
  return (
    <article className="flex flex-col gap-5">
      {/* Thumbnail (placeholder box until we wire image uploads) */}
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-black/10 bg-foreground/[0.03] dark:border-white/15">
        {project.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-foreground/30">
            No image yet
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          {project.title}
        </h2>
        <p className="whitespace-pre-line text-foreground/70">
          {project.description}
        </p>
      </div>

      {project.tech_stack.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-black/10 px-3 py-1 text-xs text-foreground/70 dark:border-white/15"
            >
              {tech}
            </li>
          ))}
        </ul>
      )}

      {(project.live_url || project.github_url) && (
        <div className="flex flex-wrap gap-3">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Live site
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/5 dark:border-white/20"
            >
              GitHub
            </a>
          )}
        </div>
      )}
    </article>
  );
}
