// Visit tracker Lambda.
// Records one row per unique visitor_id into the Supabase `analytics` table.
// Invoked from the browser via API Gateway (HTTP API, CORS-restricted to the site).
//
// Env vars (set on the Lambda, never exposed to the browser):
//   SUPABASE_URL                e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY   service-role key (bypasses RLS to insert)

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const visitorId = body.visitor_id;
    const referrer =
      typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;

    // Light validation: only accept well-formed UUIDs.
    if (!UUID_RE.test(visitorId || "")) {
      return { statusCode: 400, body: "invalid visitor_id" };
    }

    // Insert-or-ignore: on_conflict=visitor_id + ignore-duplicates means a
    // repeat check-in for the same visitor is silently dropped (no double count).
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/analytics?on_conflict=visitor_id`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          Prefer: "resolution=ignore-duplicates,return=minimal",
        },
        body: JSON.stringify({ visitor_id: visitorId, referrer }),
      },
    );

    if (!res.ok && res.status !== 409) {
      console.error("supabase insert failed", res.status, await res.text());
      return { statusCode: 502, body: "insert failed" };
    }

    return { statusCode: 204, body: "" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "error" };
  }
};
