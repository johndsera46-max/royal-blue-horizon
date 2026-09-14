import PDFDocument from "pdfkit";
import type { Shipment } from "@/lib/tracking";

function section(doc: PDFKit.PDFDocument, title: string, rows: [string, string][]) {
  doc.fontSize(12).font("Helvetica-Bold").fillColor("#111").text(title);
  doc.moveDown(0.3);
  doc.fontSize(10).font("Helvetica").fillColor("#333");
  for (const [label, value] of rows) {
    doc.text(`${label}: ${value || "—"}`);
  }
  doc.moveDown(1);
}

export async function generateShipmentReceiptPdf(shipment: Shipment): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  doc.fontSize(20).font("Helvetica-Bold").fillColor("#111").text("Royal Blue Horizon");
  doc.fontSize(10).font("Helvetica").fillColor("#666").text("Ocean, air, and multimodal freight forwarding");
  doc.moveDown(1.5);

  doc.fontSize(14).font("Helvetica-Bold").fillColor("#111").text("Shipment Receipt");
  doc.fontSize(10).font("Helvetica").fillColor("#333");
  doc.text(`Tracking number: ${shipment.trackingNumber}`);
  doc.text(
    `Date issued: ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`
  );
  doc.moveDown(1.2);

  section(doc, "Sender (Shipper)", [
    ["Name", shipment.senderName],
    ["Address", shipment.senderAddress],
    ["Phone", shipment.senderPhone],
    ["Email", shipment.senderEmail],
  ]);

  section(doc, "Receiver (Consignee)", [
    ["Name", shipment.receiverName],
    ["Address", shipment.receiverAddress],
    ["Phone", shipment.receiverPhone],
    ["Email", shipment.receiverEmail],
  ]);

  section(doc, "Shipment details", [
    ["Mode", shipment.mode],
    ["Status", shipment.statusLabel],
    ["Origin", `${shipment.origin.city}, ${shipment.origin.country} (${shipment.origin.code})`],
    ["Destination", `${shipment.destination.city}, ${shipment.destination.country} (${shipment.destination.code})`],
    ["Vessel / flight", shipment.vessel],
    ["Estimated date of arrival (ETA)", shipment.eta],
    ["Containers / units", shipment.containers],
    ["Weight", shipment.weight],
  ]);

  doc.moveDown(0.5);
  doc
    .fontSize(8)
    .fillColor("#888")
    .text(
      "This receipt confirms shipment details on file with Royal Blue Horizon Logistics. For questions, contact your account representative.",
      { width: 495 }
    );

  doc.end();
  return done;
}
