import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { AVAILABILITY_SECRET, availabilityToken } from "../../shared/availabilitySecret.ts";

const APP_URL = "https://campus-stay-a08fe8cd.base44.app";

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    // Only the platform-scheduled workflow may trigger this send.
    if (body?.secret !== AVAILABILITY_SECRET) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const listing_id = body?.listing_id;
    if (!listing_id) return Response.json({ error: "listing_id required" }, { status: 400 });

    const listing = await base44.asServiceRole.entities.Listing.get(listing_id);
    if (!listing) return Response.json({ error: "Listing not found" }, { status: 404 });
    if (listing.status !== "active") return Response.json({ skipped: true });

    const owner = await base44.asServiceRole.entities.User.get(listing.created_by_id);
    if (!owner?.email) return Response.json({ error: "Owner email not found" }, { status: 404 });

    const sentAt = new Date().toISOString();
    const token = await availabilityToken(listing_id);
    const listingUrl = `${APP_URL}/listings/${listing_id}`;
    const confirmUrl = `${APP_URL}/functions/confirmListingAvailable?listing_id=${listing_id}&token=${token}`;
    const subject = "Is your sublease still available?";
    const body_text =
      `Hi ${owner.full_name || "there"},\n\n` +
      `You posted a sublease listing "${listing.title}" on CampusLease about 30 days ago. ` +
      `Is the room still available?\n\n` +
      `If yes, confirm it's still available here (one click):\n${confirmUrl}\n\n` +
      `If it's been filled, you can archive it from My Listings:\n${APP_URL}/my-listings\n\n` +
      `View your listing: ${listingUrl}\n\n` +
      `Thanks,\nThe CampusLease Team`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: owner.email,
      subject,
      body: body_text,
    });

    // Persist the sent timestamp on the listing so the reminder step derives it from
    // stored state rather than trusting a caller-supplied value.
    await base44.asServiceRole.entities.Listing.update(listing_id, {
      last_availability_check_sent_at: sentAt,
    });

    return Response.json({ sent_at: sentAt });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}