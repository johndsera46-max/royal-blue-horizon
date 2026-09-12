#!/usr/bin/env node
// Seeds the 4 demo shipments used throughout the pitch (same tracking
// numbers customers/clients have already seen) into the real database.
// Idempotent — ON CONFLICT (tracking_number) DO NOTHING.
//
//   DATABASE_URL=postgres://... node scripts/seed-shipments.mjs

import pg from "pg";

const PORTS = {
  shanghai: { code: "CNSHA", city: "Shanghai", country: "China" },
  rotterdam: { code: "NLRTM", city: "Rotterdam", country: "Netherlands" },
  losangeles: { code: "USLAX", city: "Los Angeles", country: "USA" },
  singapore: { code: "SGSIN", city: "Singapore", country: "Singapore" },
  lagos: { code: "NGLOS", city: "Lagos", country: "Nigeria" },
  dubai: { code: "AEJEA", city: "Jebel Ali", country: "UAE" },
  santos: { code: "BRSSZ", city: "Santos", country: "Brazil" },
};

const SHIPMENTS = [
  {
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
  {
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
  {
    trackingNumber: "RBH7734215",
    mode: "multimodal",
    status: "delivered",
    statusLabel: "Delivered",
    origin: PORTS.singapore,
    destination: PORTS.losangeles,
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
  {
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
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Set DATABASE_URL first.");
    process.exit(1);
  }

  const client = new pg.Client({
    connectionString,
    ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
  });
  await client.connect();
  try {
    let created = 0;
    for (const s of SHIPMENTS) {
      const res = await client.query(
        `INSERT INTO shipments
          (tracking_number, mode, status, status_label, origin_code, origin_city, origin_country,
           destination_code, destination_city, destination_country, progress, vessel, eta, containers, weight, timeline)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
         ON CONFLICT (tracking_number) DO NOTHING`,
        [
          s.trackingNumber,
          s.mode,
          s.status,
          s.statusLabel,
          s.origin.code,
          s.origin.city,
          s.origin.country,
          s.destination.code,
          s.destination.city,
          s.destination.country,
          s.progress,
          s.vessel,
          s.eta,
          s.containers,
          s.weight,
          JSON.stringify(s.timeline),
        ]
      );
      created += res.rowCount;
    }
    console.log(`Seeded ${created} new shipment(s); ${SHIPMENTS.length - created} already existed.`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
