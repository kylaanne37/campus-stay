import React from "react";
import { Search } from "lucide-react";
import SelectorSheet from "@/components/SelectorSheet";

const TERM_OPTIONS = [
  { value: "", label: "All terms" },
  { value: "Spring Only", label: "Spring" },
  { value: "Fall Only", label: "Fall" },
  { value: "Summer", label: "Summer" },
];
const GENDER_OPTIONS = [
  { value: "", label: "Any" },
  { value: "All-Female", label: "All-Female" },
  { value: "All-Male", label: "All-Male" },
  { value: "Mixed", label: "Mixed" },
];
const YEAR_OPTIONS = [
  { value: "", label: "Any" },
  ...Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map((y) => ({
    value: String(y),
    label: String(y),
  })),
];

export default function FilterBar({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={filters.q}
              onChange={(e) => update("q", e.target.value)}
              placeholder="Complex or neighborhood"
              className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Term</label>
          <SelectorSheet label="Term" value={filters.term} onChange={(v) => update("term", v)} options={TERM_OPTIONS} placeholder="All terms" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Living dynamic</label>
          <SelectorSheet label="Living dynamic" value={filters.gender} onChange={(v) => update("gender", v)} options={GENDER_OPTIONS} placeholder="Any" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Year</label>
          <SelectorSheet label="Year" value={filters.year} onChange={(v) => update("year", v)} options={YEAR_OPTIONS} placeholder="Any" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Price range ($/mo)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={filters.minRent}
              onChange={(e) => update("minRent", e.target.value)}
              placeholder="Min"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="text-muted-foreground">–</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={filters.maxRent}
              onChange={(e) => update("maxRent", e.target.value)}
              placeholder="Max"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>
    </div>
  );
}