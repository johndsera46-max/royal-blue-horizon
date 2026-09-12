"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Ship, Plane, Boxes, Check, CircleDashed, AlertTriangle, Loader2 } from "lucide-react";
import { EXAMPLE_TRACKING_NUMBERS, type Shipment, type ShipmentStatus } from "@/lib/tracking";
import MiniRouteMap from "./MiniRouteMap";

const STATUS_STYLES: Record<ShipmentStatus, { label: string; dot: string; text: string; bg: string }> = {
  "in-transit": { label: "In transit", dot: "bg-royal-400", text: "text-royal-200", bg: "bg-royal-400/12 border-royal-400/25" },
  customs: { label: "Customs", dot: "bg-gold-400", text: "text-gold-300", bg: "bg-gold-400/12 border-gold-400/25" },
  delivered: { label: "Delivered", dot: "bg-signal-green", text: "text-signal-green", bg: "bg-signal-green/12 border-signal-green/25" },
  delayed: { label: "Delayed", dot: "bg-signal-red", text: "text-signal-red", bg: "bg-signal-red/12 border-signal-red/25" },
};

const MODE_ICON = { ocean: Ship, air: Plane, multimodal: Boxes };

async function fetchShipment(trackingNumber: string): Promise<Shipment | null> {
  const res = await fetch(`/api/track/${encodeURIComponent(trackingNumber)}`);
  if (!res.ok) return null;
  return res.json();
}

export default function TrackingExperience() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("id") ?? "";
  const [input, setInput] = useState(initial);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const runLookup = useCallback(async (value: string) => {
    if (!value.trim()) return;
    setLoading(true);
    setError(false);
    const result = await fetchShipment(value);
    setShipment(result);
    setError(!result);
    setLoading(false);
  }, []);

  useEffect(() => {
    const id = params.get("id");
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInput(id);
      runLookup(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    router.push(`/track?id=${encodeURIComponent(trimmed)}`);
    runLookup(trimmed);
  }

  const ModeIcon = shipment ? MODE_ICON[shipment.mode] : Ship;
  const status = shipment ? STATUS_STYLES[shipment.status] : null;

  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-16 lg:px-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-100 sm:text-5xl">
        Track a shipment
      </h1>
      <p className="mt-3 max-w-lg text-ink-300">
        Enter any Royal Blue Horizon tracking number for a live status of
        every leg, from booking to final delivery.
      </p>

      <form onSubmit={submit} className="glass-strong glass-edge mt-8 flex flex-col gap-3 rounded-2xl p-2.5 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 px-3">
          <Search className="h-4 w-4 shrink-0 text-ink-500" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. RBH4821903"
            className="w-full bg-transparent py-3.5 font-mono text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gold-400 px-6 py-3.5 text-sm font-semibold text-royal-950 transition-colors hover:bg-gold-300 disabled:opacity-60"
        >
          {loading ? "Tracking…" : "Track"}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-500">
        <span>Examples:</span>
        {EXAMPLE_TRACKING_NUMBERS.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => {
              setInput(num);
              router.push(`/track?id=${num}`);
              runLookup(num);
            }}
            className="font-mono text-ink-400 underline decoration-white/15 underline-offset-4 hover:text-gold-300 hover:decoration-gold-300"
          >
            {num}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-10 flex items-center gap-2 text-sm text-ink-400"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Looking up shipment…
          </motion.div>
        )}

        {!loading && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-10 flex items-center gap-3 rounded-2xl border border-signal-red/25 bg-signal-red/8 px-5 py-4 text-sm text-ink-200"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 text-signal-red" />
            <span>
              We couldn&apos;t find a shipment matching that number. Check the
              format and try again, or use one of the examples above.
            </span>
          </motion.div>
        )}

        {!loading && shipment && !error && (
          <motion.div
            key={shipment.trackingNumber}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_1fr]"
          >
            <div className="glass glass-edge rounded-3xl p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-xs text-ink-500">Tracking number</div>
                  <div className="font-mono text-lg text-ink-100">{shipment.trackingNumber}</div>
                </div>
                {status && (
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${status.bg} ${status.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {shipment.statusLabel}
                  </span>
                )}
              </div>

              <div className="mt-6 h-52 w-full">
                <MiniRouteMap origin={shipment.origin} destination={shipment.destination} progress={shipment.progress} />
              </div>

              <div className="flex items-center justify-between text-xs text-ink-400">
                <span>{shipment.origin.city}, {shipment.origin.country}</span>
                <span className="font-mono text-gold-300">{Math.round(shipment.progress * 100)}%</span>
                <span>{shipment.destination.city}, {shipment.destination.country}</span>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-y-5 border-t border-white/8 pt-6 text-sm">
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-ink-500">
                    <ModeIcon className="h-3.5 w-3.5" /> Carrier / flight
                  </dt>
                  <dd className="mt-1 text-ink-100">{shipment.vessel}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-500">ETA</dt>
                  <dd className="mt-1 font-mono text-ink-100">{shipment.eta}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-500">Cargo</dt>
                  <dd className="mt-1 text-ink-100">{shipment.containers}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-500">Weight</dt>
                  <dd className="mt-1 font-mono text-ink-100">{shipment.weight}</dd>
                </div>
              </dl>
            </div>

            <div className="glass glass-edge rounded-3xl p-7">
              <h2 className="font-display text-lg font-medium text-ink-100">Shipment timeline</h2>
              <ol className="mt-6 space-y-0">
                {shipment.timeline.map((step, i) => (
                  <motion.li
                    key={step.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex gap-4 pb-7 last:pb-0"
                  >
                    {i < shipment.timeline.length - 1 && (
                      <span
                        className={`absolute left-[9px] top-5 h-full w-px ${
                          step.complete ? "bg-gradient-to-b from-gold-400/60 to-royal-400/30" : "bg-white/10"
                        }`}
                      />
                    )}
                    <span
                      className={`relative z-10 mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border ${
                        step.current
                          ? "border-gold-400 bg-gold-400/20"
                          : step.complete
                            ? "border-royal-300/60 bg-royal-400/25"
                            : "border-white/15 bg-ink-2"
                      }`}
                    >
                      {step.complete ? (
                        <Check className="h-3 w-3 text-gold-200" strokeWidth={3} />
                      ) : (
                        <CircleDashed className="h-3 w-3 text-ink-500" />
                      )}
                      {step.current && (
                        <span className="absolute inset-0 rounded-full border border-gold-400 animate-pulse-glow" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className={`text-sm font-medium ${step.complete ? "text-ink-100" : "text-ink-400"}`}>
                          {step.label}
                        </span>
                        <span className="font-mono text-[11px] text-ink-500">{step.timestamp}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-ink-400">{step.detail}</p>
                      <p className="mt-0.5 text-[11px] text-ink-500">{step.location}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
