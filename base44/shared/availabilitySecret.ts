// Internal secret shared between the Listing Availability Check workflow and its
// backend functions. Server-side only (base44/ is never bundled into the client).
// Used to (a) authorize workflow-triggered email sends and (b) sign the one-click
// "still available" confirm link embedded in those emails.
export const AVAILABILITY_SECRET = "cs_avail_integrity_4f8b2e6a9c1d7f3e";

// HMAC-SHA256(listingId, secret) as a lowercase hex string. Used to sign/verify the
// confirm link so that only links issued by this app for a specific listing are valid.
export async function availabilityToken(listingId) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(AVAILABILITY_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(listingId));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time string compare to avoid timing leaks on token verification.
export function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < b.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}