import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ListingCard from "@/components/listings/ListingCard";
import { Plus, Loader2, RefreshCw, Archive, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const me = await base44.auth.me();
      const items = await base44.entities.Listing.filter({ created_by_id: me.id }, "-created_date", 100);
      setListings(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const refresh = async (id) => {
    setBusy(id);
    try {
      await base44.entities.Listing.update(id, {
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        still_available_confirmed_at: new Date().toISOString(),
        status: "active",
      });
      toast.success("Marked still available — expires in 14 days.");
      load();
    } finally { setBusy(null); }
  };

  const archive = async (id) => {
    setBusy(id);
    try {
      await base44.entities.Listing.update(id, { status: "archived" });
      load();
    } finally { setBusy(null); }
  };

  const remove = async (id) => {
    if (!confirm("Delete this listing permanently?")) return;
    setBusy(id);
    try {
      await base44.entities.Listing.delete(id);
      load();
    } finally { setBusy(null); }
  };

  const isExpired = (l) => l.expires_at && new Date(l.expires_at) < new Date();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">← Browse</Link>
          <h1 className="font-heading text-lg font-semibold">My listings</h1>
          <Link to="/create" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> Post
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
            <p className="text-muted-foreground">You haven't posted any rooms yet.</p>
            <Link to="/create" className="mt-3 text-sm font-medium text-primary underline">Post your first room</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((l) => (
              <div key={l.id} className="relative">
                <ListingCard listing={l} />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`flex items-center gap-1 text-xs ${l.status === "archived" || isExpired(l) ? "text-destructive" : "text-emerald-600"}`}>
                    <Clock className="h-3.5 w-3.5" />
                    {l.status === "archived" ? "Archived" : isExpired(l) ? "Expired" : `Expires ${new Date(l.expires_at).toLocaleDateString()}`}
                  </span>
                  <div className="ml-auto flex gap-2">
                    <button onClick={() => refresh(l.id)} disabled={busy === l.id} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50">
                      <RefreshCw className={`h-3.5 w-3.5 ${busy === l.id ? "animate-spin" : ""}`} /> Still available
                    </button>
                    {l.status !== "archived" && (
                      <button onClick={() => archive(l.id)} disabled={busy === l.id} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50">
                        <Archive className="h-3.5 w-3.5" /> Archive
                      </button>
                    )}
                    <button onClick={() => remove(l.id)} disabled={busy === l.id} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/5 disabled:opacity-50">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}