"use client";

import Timeline from "./Timeline";
import ProjectPanel from "@/components/panels/ProjectPanel";
import type { Project } from "@/types";

// Client wrapper: receives plain project data from the server page and tells the
// generic <Timeline> how to label each dot and render the detail panel.
export default function ProjectTimeline({ projects }: { projects: Project[] }) {
  return (
    <Timeline
      items={projects}
      getLabel={(project) => ({ title: project.title, subtitle: project.summary })}
      renderPanel={(project) => <ProjectPanel project={project} />}
      emptyMessage="No projects yet."
    />
  );
}
