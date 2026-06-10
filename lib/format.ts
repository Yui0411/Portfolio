// Small date-formatting helpers for the timeline.
// Dates from Supabase come as "YYYY-MM-DD" strings.

// Parse a "YYYY-MM-DD" string into a local Date (avoids the UTC-midnight
// timezone shift you get from `new Date("2024-01-15")`).
function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

// e.g. "Jan 2024"
export function formatMonthYear(value: string): string {
  return parseDate(value).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

// Just the year, e.g. "2024"
export function formatYear(value: string): string {
  return String(parseDate(value).getFullYear());
}

// Year-only range for jobs:
//  - current job (no end date) → single start year, e.g. "2025"
//  - same start/end year       → single year, e.g. "2024"
//  - otherwise                 → "2022 - 2024"
export function formatDateRange(start: string, end: string | null): string {
  const startYear = formatYear(start);
  if (!end) return startYear;
  const endYear = formatYear(end);
  if (startYear === endYear) return endYear;
  return `${startYear} - ${endYear}`;
}
