import { getPool } from "@/lib/db";
import type { BookingData } from "@/lib/booking";

export type BookingStatus = "new" | "contacted" | "quoted" | "won" | "lost";

export interface BookingRecord extends BookingData {
  id: string;
  reference: string;
  status: BookingStatus;
  createdAt: string;
}

interface BookingRow {
  id: string;
  reference: string;
  mode: string;
  origin: string;
  destination: string;
  ready_date: string;
  incoterm: string;
  cargo_type: string;
  description: string;
  weight: string;
  units: string;
  notes: string;
  full_name: string;
  company: string;
  email: string;
  phone: string;
  contact_method: string;
  status: string;
  created_at: string;
}

function toBooking(row: BookingRow): BookingRecord {
  return {
    id: row.id,
    reference: row.reference,
    mode: row.mode as BookingData["mode"],
    origin: row.origin,
    destination: row.destination,
    readyDate: row.ready_date,
    incoterm: row.incoterm,
    cargoType: row.cargo_type,
    description: row.description,
    weight: row.weight,
    units: row.units,
    notes: row.notes,
    fullName: row.full_name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    contactMethod: row.contact_method as BookingData["contactMethod"],
    status: row.status as BookingStatus,
    createdAt: row.created_at,
  };
}

function generateReference(): string {
  const digits = Math.floor(100000 + Math.random() * 899999);
  return `BK-${new Date().getFullYear()}-${digits}`;
}

export async function createBooking(input: BookingData): Promise<BookingRecord> {
  const reference = generateReference();
  const { rows } = await getPool().query<BookingRow>(
    `INSERT INTO bookings
      (reference, mode, origin, destination, ready_date, incoterm, cargo_type, description,
       weight, units, notes, full_name, company, email, phone, contact_method)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
     RETURNING *`,
    [
      reference,
      input.mode,
      input.origin,
      input.destination,
      input.readyDate,
      input.incoterm,
      input.cargoType,
      input.description,
      input.weight,
      input.units,
      input.notes,
      input.fullName,
      input.company,
      input.email,
      input.phone,
      input.contactMethod,
    ]
  );
  return toBooking(rows[0]);
}

export async function listBookings(): Promise<BookingRecord[]> {
  const { rows } = await getPool().query<BookingRow>(`SELECT * FROM bookings ORDER BY created_at DESC`);
  return rows.map(toBooking);
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<BookingRecord | null> {
  const { rows } = await getPool().query<BookingRow>(
    `UPDATE bookings SET status = $2, updated_at = now() WHERE id = $1 RETURNING *`,
    [id, status]
  );
  return rows[0] ? toBooking(rows[0]) : null;
}
