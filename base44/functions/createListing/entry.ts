import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const EDU_RE = /^[^@\s]+@[^@\s]+\.edu$/i;

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    if (!user.email || !EDU_RE.test(user.email)) {
      return Response.json(
        { error: "Only verified .edu students can post listings." },
        { status: 403 }
      );
    }

    const data = await req.json();
    if (!data || typeof data !== "object") {
      return Response.json({ error: "Invalid listing data." }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const listing = await base44.entities.Listing.create({
      ...data,
      status: "active",
      expires_at: expiresAt,
      still_available_confirmed_at: new Date().toISOString(),
    });

    return Response.json({ listing });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}