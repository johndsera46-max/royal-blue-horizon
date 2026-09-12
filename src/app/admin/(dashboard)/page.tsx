import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import { listShipments } from "@/lib/server/shipments";
import { listBookings } from "@/lib/server/bookings";
import { Ship, Inbox } from "lucide-react";

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const [shipments, bookings] = await Promise.all([listShipments(), listBookings()]);
  const newBookings = bookings.filter((b) => b.status === "new").length;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-100">Overview</h1>
      <p className="mt-1 text-sm text-ink-400">Signed in as {admin.email}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Link href="/admin/shipments" className="glass glass-edge rounded-2xl p-6 transition-transform hover:-translate-y-1">
          <Ship className="h-6 w-6 text-royal-300" strokeWidth={1.5} />
          <div className="mt-4 font-display text-3xl font-semibold text-ink-100">{shipments.length}</div>
          <div className="mt-1 text-sm text-ink-400">Shipments</div>
        </Link>
        <Link href="/admin/bookings" className="glass glass-edge rounded-2xl p-6 transition-transform hover:-translate-y-1">
          <Inbox className="h-6 w-6 text-gold-300" strokeWidth={1.5} />
          <div className="mt-4 font-display text-3xl font-semibold text-ink-100">{bookings.length}</div>
          <div className="mt-1 text-sm text-ink-400">
            Bookings {newBookings > 0 && <span className="text-gold-300">({newBookings} new)</span>}
          </div>
        </Link>
      </div>
    </div>
  );
}
