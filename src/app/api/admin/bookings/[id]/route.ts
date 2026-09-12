import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { updateBookingStatus, type BookingStatus } from "@/lib/server/bookings";

const VALID_STATUSES = new Set<BookingStatus>(["new", "contacted", "quoted", "won", "lost"]);

export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/bookings/[id]">) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await ctx.params;

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.status || !VALID_STATUSES.has(body.status as BookingStatus)) {
    return NextResponse.json({ error: "status must be one of new, contacted, quoted, won, lost." }, { status: 400 });
  }

  const booking = await updateBookingStatus(id, body.status as BookingStatus);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  return NextResponse.json(booking);
}
