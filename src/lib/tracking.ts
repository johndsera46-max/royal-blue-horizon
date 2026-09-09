export type ShipmentMode = "ocean" | "air" | "multimodal";
export type ShipmentStatus = "in-transit" | "customs" | "delivered" | "delayed";

export interface RoutePoint {
  code: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export interface TimelineStep {
  label: string;
  detail: string;
  timestamp: string;
  location: string;
  complete: boolean;
  current: boolean;
}

export interface Shipment {
  trackingNumber: string;
  mode: ShipmentMode;
  status: ShipmentStatus;
  statusLabel: string;
  origin: RoutePoint;
  destination: RoutePoint;
  progress: number;
  vessel: string;
  eta: string;
  containers: string;
  weight: string;
  timeline: TimelineStep[];
}

const PORTS: Record<string, RoutePoint> = {
  shanghai: { code: "CNSHA", city: "Shanghai", country: "China", lat: 31.2, lng: 121.5 },
  rotterdam: { code: "NLRTM", city: "Rotterdam", country: "Netherlands", lat: 51.9, lng: 4.5 },
  losangeles: { code: "USLAX", city: "Los Angeles", country: "USA", lat: 33.7, lng: -118.3 },
  singapore: { code: "SGSIN", city: "Singapore", country: "Singapore", lat: 1.3, lng: 103.8 },
  lagos: { code: "NGLOS", city: "Lagos", country: "Nigeria", lat: 6.5, lng: 3.4 },
  dubai: { code: "AEJEA", city: "Jebel Ali", country: "UAE", lat: 25.0, lng: 55.1 },
  santos: { code: "BRSSZ", city: "Santos", country: "Brazil", lat: -23.9, lng: -46.3 },
};

const MOCK_SHIPMENTS: Record<string, Shipment> = {
  RBH4821903: {
    trackingNumber: "RBH4821903",
    mode: "ocean",
    status: "in-transit",
    statusLabel: "In transit — ocean leg",
    origin: PORTS.shanghai,
    destination: PORTS.rotterdam,
    progress: 0.62,
    vessel: "MV Horizon Star",
    eta: "Sep 21, 2026 · 06:00 UTC",
    containers: "2 × 40ft High Cube",
    weight: "18,240 kg",
    timeline: [
      { label: "Booking confirmed", detail: "Shipment booked and slot allocated", timestamp: "Sep 02, 09:14", location: "Shanghai, CN", complete: true, current: false },
      { label: "Picked up", detail: "Cargo collected from shipper warehouse", timestamp: "Sep 03, 14:02", location: "Shanghai, CN", complete: true, current: false },
      { label: "Departed origin port", detail: "Loaded on MV Horizon Star", timestamp: "Sep 05, 22:40", location: "Port of Shanghai", complete: true, current: false },
      { label: "In transit", detail: "Vessel on ocean leg, on schedule", timestamp: "Sep 14, 03:10", location: "Indian Ocean", complete: true, current: true },
      { label: "Arrival — destination port", detail: "Expected discharge at Rotterdam", timestamp: "Sep 21, 06:00 (ETA)", location: "Port of Rotterdam", complete: false, current: false },
      { label: "Customs clearance", detail: "Import clearance to begin on arrival", timestamp: "Pending", location: "Rotterdam, NL", complete: false, current: false },
      { label: "Out for delivery", detail: "Final-mile dispatch to consignee", timestamp: "Pending", location: "Rotterdam, NL", complete: false, current: false },
    ],
  },
  RBH1029447: {
    trackingNumber: "RBH1029447",
    mode: "air",
    status: "customs",
    statusLabel: "Held — customs clearance",
    origin: PORTS.dubai,
    destination: PORTS.lagos,
    progress: 0.86,
    vessel: "RBH Cargo Flight 118",
    eta: "Sep 10, 2026 · 15:30 UTC",
    containers: "6 × Pallet (air freight)",
    weight: "2,140 kg",
    timeline: [
      { label: "Booking confirmed", detail: "Shipment booked and slot allocated", timestamp: "Sep 06, 11:20", location: "Jebel Ali, AE", complete: true, current: false },
      { label: "Picked up", detail: "Cargo collected and screened", timestamp: "Sep 06, 18:45", location: "Jebel Ali, AE", complete: true, current: false },
      { label: "Departed origin airport", detail: "Loaded on RBH Cargo Flight 118", timestamp: "Sep 07, 02:15", location: "DWC, Dubai", complete: true, current: false },
      { label: "Arrived destination airport", detail: "Discharged and moved to bonded warehouse", timestamp: "Sep 08, 09:05", location: "Murtala Muhammed Apt, Lagos", complete: true, current: false },
      { label: "Customs clearance", detail: "Additional documentation requested by customs", timestamp: "Sep 09, 12:30", location: "Lagos, NG", complete: false, current: true },
      { label: "Out for delivery", detail: "Final-mile dispatch to consignee", timestamp: "Pending", location: "Lagos, NG", complete: false, current: false },
    ],
  },
  RBH7734215: {
    trackingNumber: "RBH7734215",
    mode: "multimodal",
    status: "delivered",
    statusLabel: "Delivered",
    origin: PORTS.singapore,
    destination: PORTs_LA(),
    progress: 1,
    vessel: "MV Pacific Meridian → RBH Rail 22",
    eta: "Delivered Sep 04, 2026 · 10:12 local",
    containers: "1 × 20ft Standard",
    weight: "6,850 kg",
    timeline: [
      { label: "Booking confirmed", detail: "Shipment booked and slot allocated", timestamp: "Aug 18, 08:00", location: "Singapore, SG", complete: true, current: false },
      { label: "Departed origin port", detail: "Loaded on MV Pacific Meridian", timestamp: "Aug 20, 04:30", location: "Port of Singapore", complete: true, current: false },
      { label: "Arrival — destination port", detail: "Discharged and transferred to rail", timestamp: "Sep 01, 19:50", location: "Port of Los Angeles", complete: true, current: false },
      { label: "Customs clearance", detail: "Cleared without inspection", timestamp: "Sep 02, 08:15", location: "Los Angeles, US", complete: true, current: false },
      { label: "Out for delivery", detail: "Final-mile dispatch via RBH Rail 22", timestamp: "Sep 04, 06:00", location: "Los Angeles, US", complete: true, current: false },
      { label: "Delivered", detail: "Received and signed by consignee", timestamp: "Sep 04, 10:12", location: "Ontario, CA warehouse", complete: true, current: true },
    ],
  },
  RBH5560098: {
    trackingNumber: "RBH5560098",
    mode: "ocean",
    status: "delayed",
    statusLabel: "Delayed — weather routing",
    origin: PORTS.santos,
    destination: PORTS.rotterdam,
    progress: 0.41,
    vessel: "MV Horizon Meridian",
    eta: "Sep 26, 2026 · 18:00 UTC (was Sep 22)",
    containers: "4 × 40ft High Cube",
    weight: "31,600 kg",
    timeline: [
      { label: "Booking confirmed", detail: "Shipment booked and slot allocated", timestamp: "Aug 29, 10:00", location: "Santos, BR", complete: true, current: false },
      { label: "Departed origin port", detail: "Loaded on MV Horizon Meridian", timestamp: "Aug 31, 20:10", location: "Port of Santos", complete: true, current: false },
      { label: "Rerouted", detail: "Course adjusted for Atlantic storm system", timestamp: "Sep 08, 06:45", location: "South Atlantic", complete: true, current: true },
      { label: "In transit", detail: "Resumed course toward destination", timestamp: "Pending", location: "Atlantic Ocean", complete: false, current: false },
      { label: "Arrival — destination port", detail: "Revised ETA in effect", timestamp: "Sep 26, 18:00 (ETA)", location: "Port of Rotterdam", complete: false, current: false },
    ],
  },
};

function PORTs_LA(): RoutePoint {
  return PORTS.losangeles;
}

export const EXAMPLE_TRACKING_NUMBERS = Object.keys(MOCK_SHIPMENTS);

function seededProgress(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

export function lookupShipment(rawInput: string): Shipment | null {
  const input = rawInput.trim().toUpperCase();
  if (!input) return null;
  if (MOCK_SHIPMENTS[input]) return MOCK_SHIPMENTS[input];

  // Any other plausible-looking tracking number resolves to a generated demo shipment,
  // so the interaction never dead-ends during a live pitch.
  if (!/^[A-Z0-9]{6,}$/.test(input)) return null;

  const originKeys = Object.keys(PORTS);
  const seed = seededProgress(input);
  const originKey = originKeys[Math.floor(seed * originKeys.length)];
  const destKey = originKeys[(originKeys.indexOf(originKey) + 3) % originKeys.length];
  const origin = PORTS[originKey];
  const destination = PORTS[destKey];
  const progress = 0.15 + seed * 0.7;

  return {
    trackingNumber: input,
    mode: seed > 0.66 ? "air" : seed > 0.33 ? "multimodal" : "ocean",
    status: "in-transit",
    statusLabel: "In transit",
    origin,
    destination,
    progress,
    vessel: seed > 0.66 ? "RBH Cargo Flight 204" : "MV Horizon Voyager",
    eta: "Sep 24, 2026 · 12:00 UTC",
    containers: "1 × 40ft High Cube",
    weight: "9,120 kg",
    timeline: [
      { label: "Booking confirmed", detail: "Shipment booked and slot allocated", timestamp: "Sep 01, 09:00", location: `${origin.city}, ${origin.country}`, complete: true, current: false },
      { label: "Picked up", detail: "Cargo collected from shipper warehouse", timestamp: "Sep 02, 13:20", location: `${origin.city}, ${origin.country}`, complete: true, current: false },
      { label: "Departed origin", detail: "Underway toward destination", timestamp: "Sep 03, 21:00", location: origin.city, complete: true, current: false },
      { label: "In transit", detail: "On schedule, tracking nominal", timestamp: "Sep 10, 08:00", location: "En route", complete: true, current: true },
      { label: "Arrival — destination", detail: "Expected discharge", timestamp: "Sep 24, 12:00 (ETA)", location: `${destination.city}, ${destination.country}`, complete: false, current: false },
      { label: "Customs clearance", detail: "Import clearance to begin on arrival", timestamp: "Pending", location: destination.city, complete: false, current: false },
      { label: "Out for delivery", detail: "Final-mile dispatch to consignee", timestamp: "Pending", location: destination.city, complete: false, current: false },
    ],
  };
}
