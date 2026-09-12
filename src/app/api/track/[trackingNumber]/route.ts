import { NextResponse } from "next/server";
import { getShipmentByTrackingNumber } from "@/lib/server/shipments";

export async function GET(_req: Request, ctx: RouteContext<"/api/track/[trackingNumber]">) {
  const { trackingNumber } = await ctx.params;
  const shipment = await getShipmentByTrackingNumber(trackingNumber);
  if (!shipment) {
    return NextResponse.json({ error: "Shipment not found." }, { status: 404 });
  }
  return NextResponse.json(shipment);
}
