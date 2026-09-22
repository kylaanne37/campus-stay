import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import ConnectDialog from "@/components/listings/ConnectDialog";
import { ArrowLeft, Loader2, MapPin, Users, PawPrint, Car, Sparkles, DollarSign, Calendar, ShieldCheck, AlertCircle } from "lucide-react";
import { formatTerm } from "@/components/listings/formatTerm";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showConnect, setShowConnect] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const l = await base44.entities.Listing.get(id);
        if (active) setListing(l);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (!listing) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <AlertCircle className="h-8 w-8 text-muted-foreground" />
      <p className="text-muted-foreground">This listing isn't available.</p>
      <Link to="/" className="text-sm font-medium text-primary underline">Back to listings</Link>
    </div>
  );

  const expired = listing.expires_at && new Date(listing.expires_at) < new Date();
  const total = (listing.base_rent || 0) + (listing.utility_estimate || 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="line-clamp-1 font-heading text-lg font-semibold">{listing.title}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative aspect-[16/10] w-full bg-muted">
            {listing.photos?.length ? (
              <Image src={listing.photos[activePhoto]} fittingType="fill" className="h-full w-full" />
            ) : null}
          </div>
          {listing.photos?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3">
              {listing.photos.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhoto(idx)}
                  className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 ${idx === activePhoto ? "border-primary" : "border-transparent"}`}
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div>
              <div className="flex flex-wrap gap-2">
                <Tag>{formatTerm(listing.term, listing.year)}</Tag>
                {listing.gender_makeup && <Tag>{listing.gender_makeup}</Tag>}
                {listing.pets && <Tag>Pets OK</Tag>}
              </div>
              <h2 className="mt-3 font-heading text-2xl font-bold">{listing.title}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4" /> {listing.location}{listing.apartment_complex ? ` · ${listing.apartment_complex}` : ""}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Stat icon={DollarSign} label="Base rent" value={`$${listing.base_rent}/mo`} />
              <Stat icon={DollarSign} label="Est. utilities" value={listing.utility_estimate ? `$${listing.utility_estimate}/mo` : "—"} />
              <Stat icon={DollarSign} label="Total est." value={`$${total}/mo`} />
              <Stat icon={Users} label="Roommates" value={String(listing.roommate_count)} />
              <Stat icon={PawPrint} label="Pets" value={listing.pets ? "Allowed" : "No"} />
              <Stat icon={Car} label="Parking" value={listing.parking_included ? "Included" : "No"} />
              <Stat icon={Sparkles} label="Vibe" value={listing.cleanliness_vibe || "—"} />
            </div>

            {listing.utilities_subsidized && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                Part or all utilities are subsidized/included.
              </div>
            )}

            {listing.bio && (
              <div>
                <h3 className="mb-2 font-heading text-base font-semibold">About this place</h3>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{listing.bio}</p>
              </div>
            )}

            {listing.roommates_bio && (
              <div>
                <h3 className="mb-2 font-heading text-base font-semibold">Current roommates</h3>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{listing.roommates_bio}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-border bg-card p-5">
              <div className="mb-1 font-heading text-3xl font-bold">${listing.base_rent}<span className="text-base font-normal text-muted-foreground">/mo</span></div>
              <p className="mb-4 text-xs text-muted-foreground">+${listing.utility_estimate || 0} est. utilities · ${total} total</p>

              {expired ? (
                <div className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
                  This listing has expired. The host may have already filled the room.
                </div>
              ) : (
                <button
                  onClick={() => setShowConnect(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground transition hover:opacity-90"
                >
                  <ShieldCheck className="h-4 w-4" /> Connect with host
                </button>
              )}

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Auto-expires {new Date(listing.expires_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConnect && <ConnectDialog listing={listing} onClose={() => setShowConnect(false)} />}
    </div>
  );
}

function Tag({ children }) {
  return <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">{children}</span>;
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Icon className="h-3.5 w-3.5" /> {label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}