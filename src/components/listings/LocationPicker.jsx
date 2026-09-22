import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({ value, onChange }) {
  const center = value ? [value.lat, value.lng] : UNC;
  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom={false}
      className="relative z-0 h-64 w-full rounded-lg border border-border"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {value && <Marker position={[value.lat, value.lng]} icon={pinIcon} />}
      <ClickHandler onClick={onChange} />
    </MapContainer>
  );
}