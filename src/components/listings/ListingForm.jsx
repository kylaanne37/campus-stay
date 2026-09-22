import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import SelectorSheet from "@/components/SelectorSheet";
import LocationPicker from "@/components/listings/LocationPicker";
import { Image as ImageIcon, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const TERMS = ["Spring Only", "Fall Only", "Summer"];
const GENDERS = ["All-Female", "All-Male", "Mixed"];
const CONTACT_METHODS = [
  { value: "instagram", label: "Instagram handle" },
  { value: "phone", label: "Phone / iMessage" },
  { value: "email", label: "University email" },
];

const TERM_OPTIONS = TERMS.map((t) => ({ value: t, label: t }));
const GENDER_OPTIONS = GENDERS.map((g) => ({ value: g, label: g }));
const YEAR_OPTIONS = [2026, 2027, 2028, 2029, 2030].map((y) => ({ value: String(y), label: String(y) }));

export default function ListingForm({ initial, onSubmit, submitting }) {
  const [form, setForm] = useState(
    initial || {
      title: "",
      term: "Spring Only",
      year: 2027,
      location: "",
      apartment_complex: "",
      lat: null,
      lng: null,
      base_rent: "",
      utility_estimate: "",
      utilities_subsidized: false,
      roommate_count: 0,
      gender_makeup: "Mixed",
      roommates_bio: "",
      pets: false,
      parking_included: false,
      cleanliness_vibe: "",
      bio: "",
      photos: [],
      contact_method: "instagram",
      contact_value: "",
    }
  );
  const [uploading, setUploading] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handlePhotos = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files.slice(0, 5 - form.photos.length)) {
        const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
        uploaded.push(file_url);
      }
      set("photos", [...form.photos, ...uploaded]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removePhoto = (idx) => set("photos", form.photos.filter((_, i) => i !== idx));

  const submit = (e) => {
    e.preventDefault();
    if (form.photos.length === 0) {
      toast.error("Please add at least one photo before posting.");
      return;
    }
    onSubmit({
      ...form,
      base_rent: Number(form.base_rent) || 0,
      utility_estimate: Number(form.utility_estimate) || 0,
      roommate_count: Number(form.roommate_count) || 0,
      lat: form.lat ? Number(form.lat) : undefined,
      lng: form.lng ? Number(form.lng) : undefined,
    });
  };

  const contactPlaceholder =
    form.contact_method === "instagram" ? "@username" : form.contact_method === "phone" ? "(555) 123-4567" : "you@unc.edu";
  const contactLabel =
    form.contact_method === "instagram" ? "Instagram handle" : form.contact_method === "phone" ? "Phone number" : "Email";

  return (
    <form onSubmit={submit} className="space-y-8">
      <Section title="The basics">
        <Field label="Listing title" required>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="Private bedroom near campus" className={inputCls} />
        </Field>
        <Field label="Term" required>
          <SelectorSheet label="Term" value={form.term} onChange={(v) => set("term", v)} options={TERM_OPTIONS} />
        </Field>
        <Field label="Year" required>
          <SelectorSheet label="Year" value={String(form.year)} onChange={(v) => set("year", Number(v))} options={YEAR_OPTIONS} />
        </Field>
        <Field label="Location (neighborhood or area)" required>
          <input value={form.location} onChange={(e) => set("location", e.target.value)} required placeholder="Northside / Rams Village" className={inputCls} />
        </Field>
        <Field label="Apartment complex (optional)">
          <input value={form.apartment_complex} onChange={(e) => set("apartment_complex", e.target.value)} placeholder="The Ram Village" className={inputCls} />
        </Field>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Pin your location on campus <span className="text-muted-foreground">(optional)</span></label>
          <LocationPicker
            value={form.lat && form.lng ? { lat: form.lat, lng: form.lng } : null}
            onChange={({ lat, lng }) => { set("lat", lat); set("lng", lng); }}
          />
          {form.lat && form.lng && (
            <button type="button" onClick={() => { set("lat", null); set("lng", null); }} className="mt-2 text-xs text-muted-foreground underline">Clear pin</button>
          )}
        </div>
      </Section>

      <Section title="Price">
        <Field label="Base rent ($/month)" required>
          <input type="number" min="0" value={form.base_rent} onChange={(e) => set("base_rent", e.target.value)} required className={inputCls} />
        </Field>
        <Field label="Utility estimate ($/month)">
          <input type="number" min="0" value={form.utility_estimate} onChange={(e) => set("utility_estimate", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Utilities subsidized?">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.utilities_subsidized} onChange={(e) => set("utilities_subsidized", e.target.checked)} className="h-4 w-4 rounded" />
            Part or all utilities included/subsidized
          </label>
        </Field>
      </Section>

      <Section title="Living dynamic">
        <Field label="Roommate count" required>
          <input type="number" min="0" value={form.roommate_count} onChange={(e) => set("roommate_count", e.target.value)} required className={inputCls} />
        </Field>
        <Field label="Gender makeup" required>
          <SelectorSheet label="Gender makeup" value={form.gender_makeup} onChange={(v) => set("gender_makeup", v)} options={GENDER_OPTIONS} />
        </Field>
        <Field label="Pets allowed?">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.pets} onChange={(e) => set("pets", e.target.checked)} className="h-4 w-4 rounded" />
            Pets OK
          </label>
        </Field>
        <Field label="Parking included?">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.parking_included} onChange={(e) => set("parking_included", e.target.checked)} className="h-4 w-4 rounded" />
            Parking spot included
          </label>
        </Field>
        <Field label="Cleanliness vibe">
          <input value={form.cleanliness_vibe} onChange={(e) => set("cleanliness_vibe", e.target.value)} placeholder="Tidy, quiet study-focused" className={inputCls} />
        </Field>
      </Section>

      <Section title="Current roommates (optional)">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Tell students about the current roommates</label>
          <textarea
            value={form.roommates_bio}
            onChange={(e) => set("roommates_bio", e.target.value.slice(0, 2000))}
            maxLength={2000}
            rows={4}
            placeholder="e.g. 3 juniors, all female, quiet and early risers — we keep the kitchen clean and host friends on weekends."
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-y"
          />
          <div className="mt-1 text-right text-xs text-muted-foreground">{(form.roommates_bio || "").length}/2000</div>
        </div>
      </Section>

      <Section title="Photos (up to 5) — at least 1 required">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {form.photos.map((url, idx) => (
            <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border border-border">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => removePhoto(idx)} className="absolute right-1 top-1 rounded-full bg-background/90 p-1 shadow-sm">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {form.photos.length < 5 && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-input text-muted-foreground hover:bg-muted/50">
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5" />}
              <span className="text-xs">Add</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} disabled={uploading} />
            </label>
          )}
        </div>
      </Section>

      <Section title="About this place">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Bio<span className="text-muted-foreground"> (optional, max 3000 characters)</span></label>
          <textarea
            value={form.bio}
            onChange={(e) => set("bio", e.target.value.slice(0, 3000))}
            maxLength={3000}
            rows={5}
            placeholder="Tell students about the place, the neighborhood, who you're looking for, move-in details, etc."
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-y"
          />
          <div className="mt-1 text-right text-xs text-muted-foreground">{(form.bio || "").length}/3000</div>
        </div>
      </Section>

      <Section title="How students reach you">
        <Field label="Preferred contact method" required>
          <SelectorSheet label="Preferred contact method" value={form.contact_method} onChange={(v) => set("contact_method", v)} options={CONTACT_METHODS} />
        </Field>
        <Field label={contactLabel} required>
          <input
            value={form.contact_value}
            onChange={(e) => set("contact_value", e.target.value)}
            required
            placeholder={contactPlaceholder}
            className={inputCls}
          />
        </Field>
      </Section>

      <button
        type="submit"
        disabled={submitting || uploading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50 md:w-auto"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {initial ? "Save changes" : "Post listing"}
      </button>
    </form>
  );
}

const inputCls = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}{required && <span className="text-destructive"> *</span>}
      </label>
      {children}
    </div>
  );
}