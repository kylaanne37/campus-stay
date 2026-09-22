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

    // Derive the check-sent timestamp from stored state — never trust caller input.
    const checkSentAt = listing.last_availability_check_sent_at;
    if (!checkSentAt) return Response.json({ skipped: true });

    const confirmedAt = listing.still_available_confirmed_at ? new Date(listing.still_available_confirmed_at).getTime() : 0;
    const sentAt = new Date(checkSentAt).getTime();
    if (confirmedAt > sentAt) {
      return Response.json({ confirmed: true });
    }

    const owner = await base44.asServiceRole.entities.User.get(listing.created_by_id);
    if (!owner?.email) return Response.json({ error: "Owner email not found" }, { status: 404 });

    const listingUrl = `${APP_URL}/listings/${listing_id}`;
    const confirmUrl = `${APP_URL}/functions/confirmListingAvailable?listing_id=${listing_id}&token=${await availabilityToken(listing_id)}`;
    const subject = "Reminder: is your sublease still available?";
    const body_text =
      `Hi ${owner.full_name || "there"},\n\n` +
      `We haven't heard back about your listing "${listing.title}". ` +
      `Please confirm whether the room is still available.\n\n` +
      `Confirm it's still available (one click):\n${confirmUrl}\n\n` +
      `If it's been filled, archive it from My Listings:\n${APP_URL}/my-listings\n\n` +
      `View your listing: ${listingUrl}\n\n` +
      `Thanks,\nThe CampusLease Team`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: owner.email,
      subject,
      body: body_text,
    });

    return Response.json({ sent_reminder: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}