import { NextResponse } from "next/server";
import { createBooking } from "@/lib/server/bookings";
import type { BookingData } from "@/lib/booking";

const VALID_MODES = new Set(["ocean", "air", "multimodal"]);
const VALID_CONTACT = new Set(["email", "phone"]);

export async function POST(req: Request) {
  let body: Partial<BookingData>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.origin?.trim() || !body.destination?.trim()) {
    return NextResponse.json({ error: "Origin and destination are required." }, { status: 400 });
  }
  if (!body.fullName?.trim()) {
    return NextResponse.json({ error: "Full name is required." }, { status: 400 });
  }
  if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  const mode = VALID_MODES.has(body.mode ?? "") ? (body.mode as BookingData["mode"]) : "ocean";
  const contactMethod = VALID_CONTACT.has(body.contactMethod ?? "")
    ? (body.contactMethod as BookingData["contactMethod"])
    : "email";

  const booking = await createBooking({
    mode,
    origin: body.origin.trim(),
    destination: body.destination.trim(),
    readyDate: body.readyDate ?? "",
    incoterm: body.incoterm ?? "",
    cargoType: body.cargoType ?? "",
    description: body.description ?? "",
    weight: body.weight ?? "",
    units: body.units ?? "",
    notes: body.notes ?? "",
    fullName: body.fullName.trim(),
    company: body.company ?? "",
    email: body.email.trim(),
    phone: body.phone ?? "",
    contactMethod,
  });

  return NextResponse.json({ reference: booking.reference }, { status: 201 });
}
