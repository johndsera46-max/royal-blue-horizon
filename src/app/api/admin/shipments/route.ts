import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { listShipments, createShipment, type ShipmentInput } from "@/lib/server/shipments";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json(await listShipments());
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: Partial<ShipmentInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.trackingNumber?.trim()) {
    return NextResponse.json({ error: "trackingNumber is required." }, { status: 400 });
  }
  if (!body.origin?.code || !body.destination?.code) {
    return NextResponse.json({ error: "origin and destination are required." }, { status: 400 });
  }

  try {
    const shipment = await createShipment({
      trackingNumber: body.trackingNumber,
      mode: body.mode ?? "ocean",
      status: body.status ?? "in-transit",
      statusLabel: body.statusLabel ?? "In transit",
      origin: body.origin,
      destination: body.destination,
      progress: body.progress ?? 0,
      vessel: body.vessel ?? "",
      eta: body.eta ?? "",
      containers: body.containers ?? "",
      weight: body.weight ?? "",
      timeline: body.timeline ?? [],
    });
    return NextResponse.json(shipment, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("duplicate key")) {
      return NextResponse.json({ error: "A shipment with that tracking number already exists." }, { status: 409 });
    }
    throw err;
  }
}
