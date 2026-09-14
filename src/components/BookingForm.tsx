"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Ship,
  Plane,
  Boxes,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { EMPTY_BOOKING, NOTES_MAX_LENGTH, type BookingData } from "@/lib/booking";

const STEPS = ["Parties", "Shipment", "Cargo", "Contact", "Review"] as const;
type Errors = Partial<Record<keyof BookingData, string>>;

const MODES: { value: BookingData["mode"]; label: string; icon: typeof Ship }[] = [
  { value: "ocean", label: "Ocean", icon: Ship },
  { value: "air", label: "Air", icon: Plane },
  { value: "multimodal", label: "Multimodal", icon: Boxes },
];

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-200">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1.5 block text-xs text-signal-red">{error}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-500 transition-colors focus:border-royal-300/50 focus:bg-white/8 focus:outline-none";

export default function BookingForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BookingData>(EMPTY_BOOKING);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set<K extends keyof BookingData>(key: K, value: BookingData[K]) {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateStep(index: number): boolean {
    const next: Errors = {};
    if (index === 0) {
      if (!data.senderName.trim()) next.senderName = "Enter the sender's full name.";
      if (!data.senderAddress.trim()) next.senderAddress = "Enter the sender's complete address.";
      if (!data.receiverName.trim()) next.receiverName = "Enter the receiver's full name.";
      if (!data.receiverAddress.trim()) next.receiverAddress = "Enter the receiver's complete delivery address.";
    }
    if (index === 1) {
      if (!data.origin.trim()) next.origin = "Enter an origin city or port.";
      if (!data.destination.trim()) next.destination = "Enter a destination city or port.";
      if (!data.readyDate) next.readyDate = "Choose a ready-to-ship date.";
    }
    if (index === 2) {
      if (!data.description.trim()) next.description = "Describe the cargo being shipped.";
      if (!data.weight.trim()) next.weight = "Enter an approximate total weight.";
    }
    if (index === 3) {
      if (!data.fullName.trim()) next.fullName = "Enter your full name.";
      if (!data.company.trim()) next.company = "Enter your company name.";
      if (!/^\S+@\S+\.\S+$/.test(data.email)) next.email = "Enter a valid business email.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(3)) {
      setStep(3);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSubmitError(body.error ?? "Something went wrong submitting your request. Please try again.");
        return;
      }
      const body: { reference: string } = await res.json();
      setReference(body.reference);
    } catch {
      setSubmitError("Something went wrong submitting your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-strong glass-edge rounded-3xl p-10 text-center"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-signal-green" strokeWidth={1.5} />
        <h2 className="mt-5 font-display text-2xl font-semibold text-ink-100">
          Booking request received
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-300">
          A rated quote for your {data.mode} shipment from {data.origin} to{" "}
          {data.destination} is on its way to {data.email || "your inbox"}.
        </p>
        <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-sm text-gold-300">
          Reference {reference}
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-gold-400 px-6 py-3 text-sm font-semibold text-royal-950 hover:bg-gold-300"
          >
            Return home
          </Link>
          <Link
            href="/track"
            className="rounded-full border border-white/12 px-6 py-3 text-sm font-medium text-ink-200 hover:bg-white/5"
          >
            Track a shipment
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="glass-strong glass-edge rounded-3xl p-6 sm:p-10">
      <ol className="mb-9 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col gap-1.5">
              <span
                className={`h-1 w-full rounded-full transition-colors ${
                  i <= step ? "bg-gold-400" : "bg-white/10"
                }`}
              />
              <span className={`text-xs ${i === step ? "text-ink-100" : "text-ink-500"}`}>{label}</span>
            </div>
          </li>
        ))}
      </ol>

      <form onSubmit={submit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-sm font-medium text-ink-100">Sender (Shipper)</h3>
                  <div className="mt-3 grid gap-5 sm:grid-cols-2">
                    <Field label="Sender's full name" error={errors.senderName}>
                      <input
                        className={inputClass}
                        placeholder="Jordan Alabi"
                        value={data.senderName}
                        onChange={(e) => set("senderName", e.target.value)}
                      />
                    </Field>
                    <Field label="Sender's phone">
                      <input
                        className={inputClass}
                        placeholder="+1 555 010 2947"
                        value={data.senderPhone}
                        onChange={(e) => set("senderPhone", e.target.value)}
                      />
                    </Field>
                    <Field label="Complete pickup address" error={errors.senderAddress}>
                      <textarea
                        className={`${inputClass} min-h-20 resize-y`}
                        placeholder="Street address, city, state/region, postal code, country"
                        value={data.senderAddress}
                        onChange={(e) => set("senderAddress", e.target.value)}
                      />
                    </Field>
                    <Field label="Sender's email">
                      <input
                        type="email"
                        className={inputClass}
                        placeholder="jordan@atlasmfg.com"
                        value={data.senderEmail}
                        onChange={(e) => set("senderEmail", e.target.value)}
                      />
                    </Field>
                  </div>
                </div>

                <div className="border-t border-white/8 pt-6">
                  <h3 className="font-display text-sm font-medium text-ink-100">Receiver (Consignee)</h3>
                  <div className="mt-3 grid gap-5 sm:grid-cols-2">
                    <Field label="Receiver's full name" error={errors.receiverName}>
                      <input
                        className={inputClass}
                        placeholder="Amara Chen"
                        value={data.receiverName}
                        onChange={(e) => set("receiverName", e.target.value)}
                      />
                    </Field>
                    <Field label="Receiver's phone">
                      <input
                        className={inputClass}
                        placeholder="+31 20 555 0192"
                        value={data.receiverPhone}
                        onChange={(e) => set("receiverPhone", e.target.value)}
                      />
                    </Field>
                    <Field label="Complete delivery address" error={errors.receiverAddress}>
                      <textarea
                        className={`${inputClass} min-h-20 resize-y`}
                        placeholder="Street address, city, state/region, postal code, country"
                        value={data.receiverAddress}
                        onChange={(e) => set("receiverAddress", e.target.value)}
                      />
                    </Field>
                    <Field label="Receiver's email">
                      <input
                        type="email"
                        className={inputClass}
                        placeholder="amara@destinationco.nl"
                        value={data.receiverEmail}
                        onChange={(e) => set("receiverEmail", e.target.value)}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <span className="text-sm font-medium text-ink-200">Mode of transport</span>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {MODES.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => set("mode", value)}
                        className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-xs transition-colors ${
                          data.mode === value
                            ? "border-royal-300/50 bg-royal-400/12 text-ink-100"
                            : "border-white/10 bg-white/5 text-ink-400 hover:bg-white/8"
                        }`}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Origin" error={errors.origin}>
                    <input
                      className={inputClass}
                      placeholder="Shanghai, CN"
                      value={data.origin}
                      onChange={(e) => set("origin", e.target.value)}
                    />
                  </Field>
                  <Field label="Destination" error={errors.destination}>
                    <input
                      className={inputClass}
                      placeholder="Rotterdam, NL"
                      value={data.destination}
                      onChange={(e) => set("destination", e.target.value)}
                    />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                  <Field label="Ready to ship" error={errors.readyDate}>
                    <input
                      type="date"
                      className={inputClass}
                      value={data.readyDate}
                      onChange={(e) => set("readyDate", e.target.value)}
                    />
                  </Field>
                  <Field label="Estimated date of arrival (ETA)">
                    <input
                      type="date"
                      className={inputClass}
                      value={data.eta}
                      onChange={(e) => set("eta", e.target.value)}
                    />
                  </Field>
                  <Field label="Incoterm">
                    <select
                      className={inputClass}
                      value={data.incoterm}
                      onChange={(e) => set("incoterm", e.target.value)}
                    >
                      {["FOB", "CIF", "EXW", "DDP", "FCA"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <Field label="Cargo description" error={errors.description}>
                  <textarea
                    className={`${inputClass} min-h-24 resize-y`}
                    placeholder="e.g. Palletized electronics components, 12 pallets"
                    value={data.description}
                    onChange={(e) => set("description", e.target.value)}
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-3">
                  <Field label="Cargo type">
                    <select
                      className={inputClass}
                      value={data.cargoType}
                      onChange={(e) => set("cargoType", e.target.value)}
                    >
                      {["General cargo", "Perishable", "Hazardous", "Oversized"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Total weight (kg)" error={errors.weight}>
                    <input
                      className={inputClass}
                      placeholder="18,240"
                      value={data.weight}
                      onChange={(e) => set("weight", e.target.value)}
                    />
                  </Field>
                  <Field label="Containers / pallets">
                    <input
                      className={inputClass}
                      placeholder="2 × 40ft HC"
                      value={data.units}
                      onChange={(e) => set("units", e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Comments / special instructions (optional)">
                  <textarea
                    className={`${inputClass} min-h-56 resize-y`}
                    placeholder="Temperature control, fragile handling, stacking limits, customs notes, delivery instructions…"
                    maxLength={NOTES_MAX_LENGTH}
                    value={data.notes}
                    onChange={(e) => set("notes", e.target.value)}
                  />
                  <div className="mt-1.5 text-right text-xs text-ink-500">
                    {data.notes.length.toLocaleString()} / {NOTES_MAX_LENGTH.toLocaleString()} characters
                  </div>
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" error={errors.fullName}>
                    <input
                      className={inputClass}
                      placeholder="Jordan Alabi"
                      value={data.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                    />
                  </Field>
                  <Field label="Company" error={errors.company}>
                    <input
                      className={inputClass}
                      placeholder="Atlas Manufacturing Co."
                      value={data.company}
                      onChange={(e) => set("company", e.target.value)}
                    />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Business email" error={errors.email}>
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="jordan@atlasmfg.com"
                      value={data.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      className={inputClass}
                      placeholder="+1 555 010 2947"
                      value={data.phone}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </Field>
                </div>
                <div>
                  <span className="text-sm font-medium text-ink-200">Preferred contact method</span>
                  <div className="mt-1.5 flex gap-2">
                    {(["email", "phone"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => set("contactMethod", m)}
                        className={`rounded-xl border px-4 py-2.5 text-sm capitalize transition-colors ${
                          data.contactMethod === m
                            ? "border-royal-300/50 bg-royal-400/12 text-ink-100"
                            : "border-white/10 bg-white/5 text-ink-400 hover:bg-white/8"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Sender", `${data.senderName || "—"}`],
                    ["Sender address", data.senderAddress || "—"],
                    ["Receiver", `${data.receiverName || "—"}`],
                    ["Receiver address", data.receiverAddress || "—"],
                    ["Mode", data.mode],
                    ["Route", `${data.origin || "—"} → ${data.destination || "—"}`],
                    ["Ready date", data.readyDate || "—"],
                    ["ETA", data.eta || "—"],
                    ["Incoterm", data.incoterm],
                    ["Cargo", data.description || "—"],
                    ["Weight", data.weight ? `${data.weight} kg` : "—"],
                    ["Units", data.units || "—"],
                    ["Contact", `${data.fullName || "—"} · ${data.company || "—"}`],
                    ["Email", data.email || "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-white/8 bg-white/4 px-4 py-3">
                      <div className="text-xs text-ink-500">{label}</div>
                      <div className="mt-1 truncate text-sm text-ink-100">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2.5 rounded-xl border border-signal-green/20 bg-signal-green/6 px-4 py-3 text-xs text-ink-300">
                  <Lock className="h-3.5 w-3.5 shrink-0 text-signal-green" />
                  Submitted over an encrypted connection. Your details are only
                  used to prepare your quote — never sold or shared.
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {submitError && (
          <p className="mt-6 rounded-xl border border-signal-red/25 bg-signal-red/8 px-4 py-3 text-sm text-ink-200">
            {submitError}
          </p>
        )}

        <div className="mt-9 flex items-center justify-between border-t border-white/8 pt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            className={`inline-flex items-center gap-1.5 text-sm text-ink-400 transition-colors hover:text-ink-100 ${
              step === 0 ? "invisible" : ""
            }`}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="group inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-6 py-3 text-sm font-semibold text-royal-950 hover:bg-gold-300"
            >
              Continue
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-semibold text-royal-950 hover:bg-gold-300 disabled:opacity-60"
            >
              <ShieldCheck className="h-4 w-4" />
              {submitting ? "Submitting…" : "Submit booking request"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
