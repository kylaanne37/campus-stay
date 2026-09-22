import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Bed, Users, PawPrint, Car, Sparkles, MapPin, DollarSign } from "lucide-react";
import { formatTerm } from "./formatTerm";

export default function ListingCard({ listing }) {
  const total = (listing.base_rent || 0) + (listing.utility_estimate || 0);
  const photo = listing.photos?.[0];

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {photo ? (
          <Image src={photo} fittingType="fill" className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Bed className="h-8 w-8" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
            {formatTerm(listing.term, listing.year)}
          </span>
          {listing.gender_makeup && listing.gender_makeup !== "Mixed" && (
            <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
              {listing.gender_makeup}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-1 font-heading text-base font-semibold text-foreground">{listing.title}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{listing.location}</span>
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="font-heading text-xl font-semibold text-foreground">${listing.base_rent}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
            {listing.utility_estimate ? (
              <div className="text-xs text-muted-foreground">+${listing.utility_estimate} est. utils · ${total} total</div>
            ) : (
              <div className="text-xs text-muted-foreground">utils {listing.utilities_subsidized ? "subsidized" : "not incl."}</div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {listing.roommate_count} rm</span>
            {listing.pets && <span className="flex items-center gap-1"><PawPrint className="h-3.5 w-3.5" /> pets ok</span>}
            {listing.parking_included && <span className="flex items-center gap-1"><Car className="h-3.5 w-3.5" /> parking</span>}
          </div>
        </div>

        {listing.cleanliness_vibe && (
          <div className="flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{listing.cleanliness_vibe}</span>
          </div>
        )}
      </div>
    </Link>
  );
}