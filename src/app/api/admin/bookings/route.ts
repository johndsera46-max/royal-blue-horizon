import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { listBookings } from "@/lib/server/bookings";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json(await listBookings());
}
