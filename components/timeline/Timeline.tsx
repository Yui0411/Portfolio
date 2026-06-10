"use client";

import { useState, type ReactNode } from "react";
import TimelineDot from "./TimelineDot";
import DetailPanel from "./DetailPanel";

// Generic, reusable timeline. Works for experience, projects, and certificates —
// each caller passes its own items plus two small functions describing how to
// label a dot and how to render the detail panel for the selected item.
//
// <T extends { id: string }> just means "any item type, as long as it has an id".
interface TimelineProps<T extends { id: string }> {
  items: T[];
  getLabel: (item: T) => { title: string; subtitle?: string };
  renderPanel: (item: T) => ReactNode;
  showLine?: boolean; // false for certificates (dots only, no connecting line)
  emptyMessage?: string;
}

export default function Timeline<T extends { id: string }>({
  items,
  getLabel,
  renderPanel,
  showLine = true,
  emptyMessage = "Nothing here yet.",
}: TimelineProps<T>) {
  // First item is selected by default.
  const [selectedId, setSelectedId] = useState<string | null>(
    items[0]?.id ?? null,
  );

  if (items.length === 0) {
    return <p className="text-sm text-foreground/50">{emptyMessage}</p>;
  }

  // Fall back to the first item if the selected id ever goes missing.
  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(180px,260px)_1fr]">
      {/* Left column: the timeline */}
      <ol className="relative">
        {showLine && (
          <span
            aria-hidden
            className="absolute bottom-3 left-[7px] top-3 w-px bg-foreground/15"
          />
        )}
        {items.map((item) => {
          const { title, subtitle } = getLabel(item);
          return (
            <TimelineDot
              key={item.id}
              title={title}
              subtitle={subtitle}
              active={item.id === selected.id}
              onSelect={() => setSelectedId(item.id)}
            />
          );
        })}
      </ol>

      {/* Right column: the detail panel for the selected item */}
      <DetailPanel>{renderPanel(selected)}</DetailPanel>
    </div>
  );
}
