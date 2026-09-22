import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const UNC = [35.9121, -79.0512];

const pinIcon = L.divIcon({
  className: "campus-pin",
  html: `<div style="display:flex;align-items:flex-start;justify-content:center;">
    <svg width="26" height="34" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="#4B9CD3" stroke="#13294B" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="#fff"/>
    </svg>
  </div>`,
  iconSize: [26, 34],
  iconAnchor: [13, 34],
});

export default function ListingsMap({ listings }) {
  const withCoords = listings.filter((l) => l.lat && l.lng);
  const center = withCoords[0] ? [withCoords[0].lat, withCoords[0].lng] : UNC;
  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom
      className="relative z-0 h-[600px] w-full rounded-2xl border border-border"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {withCoords.map((l) => (
        <Marker key={l.id} position={[l.lat, l.lng]} icon={pinIcon}>
          <Popup>
            <div className="space-y-1">
              <div className="font-semibold">{l.title}</div>
              <div className="text-xs text-muted-foreground">{l.location}</div>
              <div className="font-medium">${l.base_rent}/mo</div>
              <Link to={`/listings/${l.id}`} className="text-xs font-medium text-primary underline">View details</Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}