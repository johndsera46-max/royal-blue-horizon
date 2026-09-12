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

// Shown on the hero/track page as clickable examples — kept as a small
// static list since the real data now lives in the database (seeded via
// scripts/seed-shipments.mjs) rather than hardcoded here.
export const EXAMPLE_TRACKING_NUMBERS = ["RBH4821903", "RBH1029447", "RBH7734215", "RBH5560098"];
