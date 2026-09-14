import { getPool } from "@/lib/db";
import type { Shipment, TimelineStep } from "@/lib/tracking";

interface ShipmentRow {
  tracking_number: string;
  mode: string;
  status: string;
  status_label: string;
  sender_name: string;
  sender_address: string;
  sender_phone: string;
  sender_email: string;
  receiver_name: string;
  receiver_address: string;
  receiver_phone: string;
  receiver_email: string;
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
    senderName: row.sender_name,
    senderAddress: row.sender_address,
    senderPhone: row.sender_phone,
    senderEmail: row.sender_email,
    receiverName: row.receiver_name,
    receiverAddress: row.receiver_address,
    receiverPhone: row.receiver_phone,
    receiverEmail: row.receiver_email,
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
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  senderEmail: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  receiverEmail: string;
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
      (tracking_number, mode, status, status_label, sender_name, sender_address, sender_phone, sender_email,
       receiver_name, receiver_address, receiver_phone, receiver_email, origin_code, origin_city, origin_country,
       destination_code, destination_city, destination_country, progress, vessel, eta, containers, weight, timeline)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
     RETURNING *`,
    [
      input.trackingNumber.trim().toUpperCase(),
      input.mode,
      input.status,
      input.statusLabel,
      input.senderName,
      input.senderAddress,
      input.senderPhone,
      input.senderEmail,
      input.receiverName,
      input.receiverAddress,
      input.receiverPhone,
      input.receiverEmail,
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
       sender_name = $5, sender_address = $6, sender_phone = $7, sender_email = $8,
       receiver_name = $9, receiver_address = $10, receiver_phone = $11, receiver_email = $12,
       origin_code = $13, origin_city = $14, origin_country = $15,
       destination_code = $16, destination_city = $17, destination_country = $18,
       progress = $19, vessel = $20, eta = $21, containers = $22, weight = $23,
       timeline = $24, updated_at = now()
     WHERE tracking_number = $1
     RETURNING *`,
    [
      trackingNumber.trim().toUpperCase(),
      input.mode,
      input.status,
      input.statusLabel,
      input.senderName,
      input.senderAddress,
      input.senderPhone,
      input.senderEmail,
      input.receiverName,
      input.receiverAddress,
      input.receiverPhone,
      input.receiverEmail,
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
