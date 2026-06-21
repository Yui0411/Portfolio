// Shared TypeScript types for the portfolio.
// These mirror the database tables defined in supabase/schema.sql.
// Keeping them here means every component gets the same shape + autocomplete.

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;        // ISO date, e.g. "2024-01-15"
  end_date: string | null;   // null = current job
  description: string;
  tech_stack: string[];
  display_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;           // short label shown on the timeline dot
  description: string;       // full text shown in the detail panel
  image_url: string | null;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  display_order: number;
  is_visible: boolean;       // draft/published toggle
  created_at: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issued_date: string | null; // not displayed; kept optional in case it's wanted later
  image_url: string | null;
  verify_url: string | null;
  display_order: number;
  created_at: string;
}

export interface Analytics {
  id: number;
  visitor_id: string | null;
  referrer: string | null;
  created_at: string;
}

// Single-row table holding editable site content (home hero + contact).
export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  updated_at: string;
}
