import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { X, Loader2, Instagram, MessageSquare, Mail, ShieldCheck } from "lucide-react";

export default function ConnectDialog({ listing, onClose }) {
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const u = await base44.entities.User.get(listing.created_by_id);
        if (active) setHost(u);
      } catch {
        if (active) setHost(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [listing.created_by_id]);

  const contactHref = () => {
    const v = listing.contact_value;
    if (listing.contact_method === "instagram") {
      const handle = v.replace(/^@/, "");
      return `https://instagram.com/${handle}`;
    }
    if (listing.contact_method === "phone") return `sms:${v.replace(/\s/g, "")}`;
    return `mailto:${v}`;
  };

  const contactLabel = () => {
    if (listing.contact_method === "instagram") return "Open Instagram DM";
    if (listing.contact_method === "phone") return "Text host";
    return "Email host";
  };

  const ContactIcon = listing.contact_method === "instagram" ? Instagram : listing.contact_method === "phone" ? MessageSquare : Mail;

  const isEdu = !!host?.email && /@[^@\s]+\.edu$/i.test(host.email);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-2xl bg-card p-6 shadow-xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold">Connect with the host</h3>
          <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-border p-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {(host?.full_name || host?.email || "?").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-medium">{host?.full_name || (isEdu ? "Verified student" : "Host")}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {isEdu && <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />}
                  <span className="truncate">{host?.email}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {revealed
                ? "Here's how they'd like to be reached. Reach out and mention you found their listing on the campus board."
                : isEdu
                  ? "This host is a verified student. Reveal their preferred contact to start a conversation."
                  : "Reveal this host's preferred contact to start a conversation."}
            </p>

            {revealed ? (
              <a
                href={contactHref()}
                target={listing.contact_method === "instagram" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground transition hover:opacity-90"
              >
                <ContactIcon className="h-4 w-4" />
                {contactLabel()}
              </a>
            ) : (
              <button
                onClick={() => setRevealed(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground transition hover:opacity-90"
              >
                <ShieldCheck className="h-4 w-4" />
                Reveal contact
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}