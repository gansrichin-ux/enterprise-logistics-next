import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

export type LatLng = { lat: number; lng: number; label: string };

type Props = {
  pickup?: LatLng;
  dropoff?: LatLng;
  className?: string;
  height?: number;
};

const DEFAULT_PICKUP: LatLng = { lat: 53.5511, lng: 9.9937, label: "Hamburg, DE" };
const DEFAULT_DROPOFF: LatLng = { lat: 40.4168, lng: -3.7038, label: "Madrid, ES" };

/**
 * Real interactive Leaflet map. Uses OpenStreetMap tiles — no API key required.
 * Renders client-side only to avoid SSR window issues.
 * Falls back gracefully to a styled placeholder if loading fails.
 */
export function RouteMap({
  pickup = DEFAULT_PICKUP,
  dropoff = DEFAULT_DROPOFF,
  className,
  height = 360,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [Mod, setMod] = useState<typeof import("react-leaflet") | null>(null);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setMounted(true);
    Promise.all([import("react-leaflet"), import("leaflet")])
      .then(([rl, leaflet]) => {
        setMod(rl);
        setL(leaflet);
      })
      .catch((e) => {
        console.error("Failed to load map", e);
        setFailed(true);
      });
  }, []);

  const center: [number, number] = [
    (pickup.lat + dropoff.lat) / 2,
    (pickup.lng + dropoff.lng) / 2,
  ];

  if (!mounted || failed || !Mod || !L) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl border border-border map-bg ${className ?? ""}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto h-6 w-6 text-primary" />
            <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {failed ? "Map unavailable — fallback view" : "Loading map…"}
            </div>
            <div className="mt-1 text-[13px]">
              {pickup.label} → {dropoff.label}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Polyline, Popup } = Mod;

  const pinIcon = (variant: "start" | "end") =>
    L.divIcon({
      className: "",
      html: `<div class="jb-pin ${variant}"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border ${className ?? ""}`}
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={4}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[pickup.lat, pickup.lng]} icon={pinIcon("start")}>
          <Popup>Pickup · {pickup.label}</Popup>
        </Marker>
        <Marker position={[dropoff.lat, dropoff.lng]} icon={pinIcon("end")}>
          <Popup>Dropoff · {dropoff.label}</Popup>
        </Marker>
        <Polyline
          positions={[
            [pickup.lat, pickup.lng],
            [dropoff.lat, dropoff.lng],
          ]}
          pathOptions={{
            color: "oklch(0.74 0.18 158)",
            weight: 2,
            dashArray: "6 6",
            opacity: 0.85,
          }}
        />
      </MapContainer>

      {/* Overlays */}
      <div className="pointer-events-none absolute left-3 top-3 z-[400] rounded-md border border-border bg-background/85 px-2.5 py-1.5 backdrop-blur">
        <div className="font-mono text-[10px] uppercase tracking-wider text-primary">Route preview</div>
        <div className="text-[12px]">{pickup.label} → {dropoff.label}</div>
      </div>
    </div>
  );
}
