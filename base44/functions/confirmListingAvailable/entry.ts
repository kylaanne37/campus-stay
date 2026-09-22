import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { availabilityToken, safeEqual } from "../../shared/availabilitySecret.ts";

const APP_URL = "https://campus-stay-a08fe8cd.base44.app";

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);
    const listing_id = url.searchParams.get("listing_id");
    const token = url.searchParams.get("token");
    if (!listing_id || !token) return Response.json({ error: "Missing parameters" }, { status: 400 });

    // The link is only valid if its token was issued by this app for this listing.
    const expected = await availabilityToken(listing_id);
    if (!safeEqual(token, expected)) return Response.json({ error: "Invalid or expired link" }, { status: 403 });

    const listing = await base44.asServiceRole.entities.Listing.get(listing_id);
    if (!listing) return Response.json({ error: "Listing not found" }, { status: 404 });

    await base44.asServiceRole.entities.Listing.update(listing_id, {
      still_available_confirmed_at: new Date().toISOString(),
    });

    const html =
      `<!doctype html><html><head><meta charset="utf-8"><title>Listing confirmed</title>` +
      `<style>body{font-family:system-ui,sans-serif;text-align:center;padding:48px 24px;color:#111;}` +
      `a{display:inline-block;margin-top:16px;padding:10px 18px;background:#111;color:#fff;border-radius:8px;text-decoration:none;}</style></head>` +
      `<body><h2>Thanks — your listing is marked as still available.</h2>` +
      `<p>We've updated the confirmation timestamp on "${listing.title}".</p>` +
      `<a href="${APP_URL}/listings/${listing_id}">View your listing</a></body></html>`;
    return new Response(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}