import { NextResponse } from "next/server";
import { getShipmentByTrackingNumber } from "@/lib/server/shipments";

export async function GET(_req: Request, ctx: RouteContext<"/api/track/[trackingNumber]">) {
  const { trackingNumber } = await ctx.params;
  const shipment = await getShipmentByTrackingNumber(trackingNumber);
  if (!shipment) {
    return NextResponse.json({ error: "Shipment not found." }, { status: 404 });
  }

  // Allowlist only: sender/receiver name, address, and contact info are
  // admin-only fields for the receipt — never expose them on this
  // unauthenticated public endpoint.
  const { trackingNumber: tn, mode, status, statusLabel, origin, destination, progress, vessel, eta, containers, weight, timeline } = shipment;
  return NextResponse.json({ trackingNumber: tn, mode, status, statusLabel, origin, destination, progress, vessel, eta, containers, weight, timeline });
}
