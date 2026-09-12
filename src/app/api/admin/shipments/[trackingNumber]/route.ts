import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { updateShipment, deleteShipment, type ShipmentInput } from "@/lib/server/shipments";

export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/shipments/[trackingNumber]">) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { trackingNumber } = await ctx.params;

  let body: Partial<ShipmentInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body.origin?.code || !body.destination?.code) {
    return NextResponse.json({ error: "origin and destination are required." }, { status: 400 });
  }

  const shipment = await updateShipment(trackingNumber, {
    trackingNumber,
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

  if (!shipment) {
    return NextResponse.json({ error: "Shipment not found." }, { status: 404 });
  }
  return NextResponse.json(shipment);
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/admin/shipments/[trackingNumber]">) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { trackingNumber } = await ctx.params;
  const deleted = await deleteShipment(trackingNumber);
  if (!deleted) {
    return NextResponse.json({ error: "Shipment not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
