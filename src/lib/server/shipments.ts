import { getPool } from "@/lib/db";
import type { Shipment, TimelineStep } from "@/lib/tracking";

interface ShipmentRow {
  tracking_number: string;
  mode: string;
  status: string;
  status_label: string;
  origin_code: string;
  origin_city: string;
  origin_country: string;
  destination_code: string;
  destination_city: string;
  destination_country: string;
  progress: string;
  vessel: string;
  eta: string;
  containers: string;
  weight: string;
  timeline: TimelineStep[];
}

function toShipment(row: ShipmentRow): Shipment {
  return {
    trackingNumber: row.tracking_number,
    mode: row.mode as Shipment["mode"],
    status: row.status as Shipment["status"],
    statusLabel: row.status_label,
    origin: { code: row.origin_code, city: row.origin_city, country: row.origin_country, lat: 0, lng: 0 },
    destination: { code: row.destination_code, city: row.destination_city, country: row.destination_country, lat: 0, lng: 0 },
    progress: Number(row.progress),
    vessel: row.vessel,
    eta: row.eta,
    containers: row.containers,
    weight: row.weight,
    timeline: row.timeline,
  };
}

export async function getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
  const { rows } = await getPool().query<ShipmentRow>(
    `SELECT * FROM shipments WHERE tracking_number = $1`,
    [trackingNumber.trim().toUpperCase()]
  );
  return rows[0] ? toShipment(rows[0]) : null;
}

export async function listShipments(): Promise<Shipment[]> {
  const { rows } = await getPool().query<ShipmentRow>(`SELECT * FROM shipments ORDER BY created_at DESC`);
  return rows.map(toShipment);
}

export interface ShipmentInput {
  trackingNumber: string;
  mode: Shipment["mode"];
  status: Shipment["status"];
  statusLabel: string;
  origin: { code: string; city: string; country: string };
  destination: { code: string; city: string; country: string };
  progress: number;
  vessel: string;
  eta: string;
  containers: string;
  weight: string;
  timeline: TimelineStep[];
}

export async function createShipment(input: ShipmentInput): Promise<Shipment> {
  const { rows } = await getPool().query<ShipmentRow>(
    `INSERT INTO shipments
      (tracking_number, mode, status, status_label, origin_code, origin_city, origin_country,
       destination_code, destination_city, destination_country, progress, vessel, eta, containers, weight, timeline)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
     RETURNING *`,
    [
      input.trackingNumber.trim().toUpperCase(),
      input.mode,
      input.status,
      input.statusLabel,
      input.origin.code,
      input.origin.city,
      input.origin.country,
      input.destination.code,
      input.destination.city,
      input.destination.country,
      input.progress,
      input.vessel,
      input.eta,
      input.containers,
      input.weight,
      JSON.stringify(input.timeline),
    ]
  );
  return toShipment(rows[0]);
}

export async function updateShipment(trackingNumber: string, input: ShipmentInput): Promise<Shipment | null> {
  const { rows } = await getPool().query<ShipmentRow>(
    `UPDATE shipments SET
       mode = $2, status = $3, status_label = $4,
       origin_code = $5, origin_city = $6, origin_country = $7,
       destination_code = $8, destination_city = $9, destination_country = $10,
       progress = $11, vessel = $12, eta = $13, containers = $14, weight = $15,
       timeline = $16, updated_at = now()
     WHERE tracking_number = $1
     RETURNING *`,
    [
      trackingNumber.trim().toUpperCase(),
      input.mode,
      input.status,
      input.statusLabel,
      input.origin.code,
      input.origin.city,
      input.origin.country,
      input.destination.code,
      input.destination.city,
      input.destination.country,
      input.progress,
      input.vessel,
      input.eta,
      input.containers,
      input.weight,
      JSON.stringify(input.timeline),
    ]
  );
  return rows[0] ? toShipment(rows[0]) : null;
}

export async function deleteShipment(trackingNumber: string): Promise<boolean> {
  const { rowCount } = await getPool().query(`DELETE FROM shipments WHERE tracking_number = $1`, [
    trackingNumber.trim().toUpperCase(),
  ]);
  return (rowCount ?? 0) > 0;
}
