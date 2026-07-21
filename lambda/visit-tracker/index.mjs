// Visit tracker Lambda.
// Records one row per unique visitor_id into the Supabase `analytics` table,
// enriched with User-Agent + IP + country + ISP for bot-vs-human analysis.
// Invoked from the browser via API Gateway (HTTP API, CORS-restricted to the site).
//
// Env vars (set on the Lambda, never exposed to the browser):
//   SUPABASE_URL                e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY   service-role key (bypasses RLS to insert)

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Look up country + ISP for an IP using ip-api.com (free, no key, HTTP-only).
// Fails soft: if the lookup errors, we still record the visit without geo.
async function lookupGeo(ip) {
  if (!ip) return {};
  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,isp`,
    );
    const data = await res.json();
    if (data.status === "success") {
      return { country: data.country ?? null, isp: data.isp ?? null };
    }
  } catch {
    // geo lookup failed — don't block the insert
  }
  return {};
}

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

    // IP + User-Agent are already provided by API Gateway (payload v2).
    const ip = event.requestContext?.http?.sourceIp ?? null;
    const userAgent =
      (event.headers?.["user-agent"] ?? "").slice(0, 500) || null;

    // The only added network call: IP -> country + ISP.
    const { country = null, isp = null } = await lookupGeo(ip);

    // Insert-or-ignore: a repeat check-in for the same visitor is dropped.
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
        body: JSON.stringify({
          visitor_id: visitorId,
          referrer,
          ip,
          user_agent: userAgent,
          country,
          isp,
        }),
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
