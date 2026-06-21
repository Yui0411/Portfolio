"use client";

import { useEffect } from "react";

// Records one visit per browser session. Lives in the root layout (which
// persists across in-app navigation), and gates on sessionStorage so a refresh
// or moving between pages within the same session doesn't recount.
//
// To exclude your own visits: open the site once with ?notrack in the URL
// (e.g. https://lloydshin.dev/?notrack) on each browser/device you use. That
// sets a persistent opt-out flag in localStorage, so you're never counted
// again on that browser (until you clear its storage).
export default function VisitTracker() {
  useEffect(() => {
    // Never track during local development.
    if (process.env.NODE_ENV !== "production") return;

    const url = process.env.NEXT_PUBLIC_TRACK_URL;
    if (!url) return;

    try {
      // Opt-out: ?notrack permanently excludes this browser.
      if (new URLSearchParams(window.location.search).has("notrack")) {
        localStorage.setItem("pf_notrack", "1");
      }
      if (localStorage.getItem("pf_notrack")) return;

      // Already counted this session — do nothing.
      if (sessionStorage.getItem("visitor_id")) return;

      const visitorId = crypto.randomUUID();
      sessionStorage.setItem("visitor_id", visitorId);

      // Fire-and-forget; never block or surface errors to the visitor.
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitor_id: visitorId,
          referrer: document.referrer || null,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // sessionStorage / localStorage / crypto unavailable — skip silently.
    }
  }, []);

  return null;
}
