import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { getShipmentByTrackingNumber } from "@/lib/server/shipments";
import { generateShipmentReceiptPdf } from "@/lib/server/receipt";

export async function GET(_req: Request, ctx: RouteContext<"/api/admin/shipments/[trackingNumber]/receipt">) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { trackingNumber } = await ctx.params;
  const shipment = await getShipmentByTrackingNumber(trackingNumber);
  if (!shipment) {
    return NextResponse.json({ error: "Shipment not found." }, { status: 404 });
  }

  const pdf = await generateShipmentReceiptPdf(shipment);
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receipt-${shipment.trackingNumber}.pdf"`,
    },
  });
}
