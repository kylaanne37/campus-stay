import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ListingCard from "@/components/listings/ListingCard";
import FilterBar from "@/components/listings/FilterBar";
import ListingsMap from "@/components/listings/ListingsMap";
import { Plus, Loader2, Home as HomeIcon, Map as MapIcon, List as ListIcon } from "lucide-react";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: "", term: "", gender: "", year: "", minRent: "", maxRent: "" });
  const [view, setView] = useState("list");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const now = new Date().toISOString();
        const items = await base44.entities.Listing.filter({ status: "active" }, "-created_date", 200);
        if (!active) return;
        const live = items.filter((l) => !l.expires_at || new Date(l.expires_at) > new Date(now));
        setListings(live);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const filtered = listings.filter((l) => {
    if (filters.q) {
      const q = filters.q.toLowerCase();
      const hay = `${l.title} ${l.location} ${l.apartment_complex || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.term && l.term !== filters.term) return false;
    if (filters.gender && l.gender_makeup !== filters.gender) return false;
    if (filters.year && String(l.year) !== filters.year) return false;
    if (filters.minRent && l.base_rent < Number(filters.minRent)) return false;
    if (filters.maxRent && l.base_rent > Number(filters.maxRent)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HomeIcon className="h-4 w-4" />
            </div>
            <span className="font-heading text-lg font-semibold">CampusLease</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/about" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline">About</Link>
            <Link to="/contact" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline">Contact</Link>
            <Link to="/my-listings" className="text-sm font-medium text-muted-foreground hover:text-foreground">My listings</Link>
            <Link to="/create" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4" /> Post a room
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">Find your next sublease</h1>
          <p className="mt-1 text-sm text-muted-foreground">Verified students only. Real listings that auto-expire — no dead posts.</p>
        </div>

        <div className="mb-4">
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        <div className="mb-6 flex items-center gap-2">
          <button onClick={() => setView("list")} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${view === "list" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground"}`}>
            <ListIcon className="h-4 w-4" /> List
          </button>
          <button onClick={() => setView("map")} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${view === "map" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground"}`}>
            <MapIcon className="h-4 w-4" /> Map
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
            <p className="text-muted-foreground">No rooms match your filters yet.</p>
            <Link to="/create" className="mt-3 text-sm font-medium text-primary underline">Be the first to post one</Link>
          </div>
        ) : view === "map" ? (
          <div className="space-y-3">
            <ListingsMap listings={filtered} />
            <p className="text-xs text-muted-foreground">Only listings with a pinned location appear on the map. Switch to List to see all.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}