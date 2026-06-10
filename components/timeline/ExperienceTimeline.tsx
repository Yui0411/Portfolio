"use client";

import Timeline from "./Timeline";
import ExperiencePanel from "@/components/panels/ExperiencePanel";
import { formatDateRange } from "@/lib/format";
import type { Experience } from "@/types";

// Client wrapper connecting the generic timeline to experience data.
export default function ExperienceTimeline({
  experience,
}: {
  experience: Experience[];
}) {
  return (
    <Timeline
      items={experience}
      getLabel={(item) => ({
        title: item.company,
        subtitle: formatDateRange(item.start_date, item.end_date),
      })}
      renderPanel={(item) => <ExperiencePanel experience={item} />}
      emptyMessage="No experience added yet."
    />
  );
}
