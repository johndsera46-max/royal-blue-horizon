"use client";

import { useEffect, useState } from "react";
import type { BookingRecord, BookingStatus } from "@/lib/server/bookings";

const STATUS_OPTIONS: BookingStatus[] = ["new", "contacted", "quoted", "won", "lost"];

const STATUS_STYLES: Record<BookingStatus, string> = {
  new: "bg-royal-400/12 text-royal-200",
  contacted: "bg-gold-400/12 text-gold-300",
  quoted: "bg-gold-400/12 text-gold-300",
  won: "bg-signal-green/12 text-signal-green",
  lost: "bg-signal-red/12 text-signal-red",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/bookings");
    if (res.ok) setBookings(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function setStatus(id: string, status: BookingStatus) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-100">Bookings</h1>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-ink-500">Loading…</p>}
        {!loading && bookings.length === 0 && <p className="text-ink-500">No booking requests yet.</p>}

        {bookings.map((b) => (
          <div key={b.id} className="glass glass-edge rounded-2xl p-5">
            <button
              onClick={() => setExpanded(expanded === b.id ? null : b.id)}
              className="flex w-full flex-wrap items-center justify-between gap-3 text-left"
            >
              <div>
                <div className="font-mono text-sm text-gold-300">{b.reference}</div>
                <div className="mt-1 text-sm text-ink-100">
                  {b.fullName} — {b.company || "No company"}
                </div>
                <div className="text-xs text-ink-400">
                  {b.mode} · {b.origin} → {b.destination}
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[b.status]}`}>{b.status}</span>
            </button>

            {expanded === b.id && (
              <div className="mt-4 grid gap-3 border-t border-white/8 pt-4 text-sm sm:grid-cols-2">
                <div><span className="text-xs text-ink-500">Email</span><div className="text-ink-200">{b.email}</div></div>
                <div><span className="text-xs text-ink-500">Phone</span><div className="text-ink-200">{b.phone || "—"}</div></div>
                <div><span className="text-xs text-ink-500">Ready date</span><div className="text-ink-200">{b.readyDate || "—"}</div></div>
                <div><span className="text-xs text-ink-500">Incoterm</span><div className="text-ink-200">{b.incoterm || "—"}</div></div>
                <div className="sm:col-span-2"><span className="text-xs text-ink-500">Cargo</span><div className="text-ink-200">{b.description || "—"}</div></div>
                <div><span className="text-xs text-ink-500">Weight</span><div className="text-ink-200">{b.weight || "—"}</div></div>
                <div><span className="text-xs text-ink-500">Units</span><div className="text-ink-200">{b.units || "—"}</div></div>
                {b.notes && (
                  <div className="sm:col-span-2"><span className="text-xs text-ink-500">Notes</span><div className="text-ink-200">{b.notes}</div></div>
                )}

                <div className="sm:col-span-2">
                  <span className="text-xs text-ink-500">Status</span>
                  <select
                    value={b.status}
                    onChange={(e) => setStatus(b.id, e.target.value as BookingStatus)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-ink-100"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
