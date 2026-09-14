"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Save, FileText } from "lucide-react";
import type { Shipment, TimelineStep } from "@/lib/tracking";

type FormState = {
  trackingNumber: string;
  mode: Shipment["mode"];
  status: Shipment["status"];
  statusLabel: string;
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  senderEmail: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  receiverEmail: string;
  originCode: string;
  originCity: string;
  originCountry: string;
  destinationCode: string;
  destinationCity: string;
  destinationCountry: string;
  progress: string;
  vessel: string;
  eta: string;
  containers: string;
  weight: string;
  timeline: TimelineStep[];
};

const EMPTY_FORM: FormState = {
  trackingNumber: "",
  mode: "ocean",
  status: "in-transit",
  statusLabel: "In transit",
  senderName: "",
  senderAddress: "",
  senderPhone: "",
  senderEmail: "",
  receiverName: "",
  receiverAddress: "",
  receiverPhone: "",
  receiverEmail: "",
  originCode: "",
  originCity: "",
  originCountry: "",
  destinationCode: "",
  destinationCity: "",
  destinationCountry: "",
  progress: "0",
  vessel: "",
  eta: "",
  containers: "",
  weight: "",
  timeline: [],
};

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-royal-300/50 focus:outline-none";

function shipmentToForm(s: Shipment): FormState {
  return {
    trackingNumber: s.trackingNumber,
    mode: s.mode,
    status: s.status,
    statusLabel: s.statusLabel,
    senderName: s.senderName,
    senderAddress: s.senderAddress,
    senderPhone: s.senderPhone,
    senderEmail: s.senderEmail,
    receiverName: s.receiverName,
    receiverAddress: s.receiverAddress,
    receiverPhone: s.receiverPhone,
    receiverEmail: s.receiverEmail,
    originCode: s.origin.code,
    originCity: s.origin.city,
    originCountry: s.origin.country,
    destinationCode: s.destination.code,
    destinationCity: s.destination.city,
    destinationCountry: s.destination.country,
    progress: String(Math.round(s.progress * 100)),
    vessel: s.vessel,
    eta: s.eta,
    containers: s.containers,
    weight: s.weight,
    timeline: s.timeline,
  };
}

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null); // tracking number of item being edited, or "new"
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/shipments");
    if (res.ok) setShipments(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  function startCreate() {
    setForm(EMPTY_FORM);
    setEditingId("new");
    setError(null);
  }

  function startEdit(s: Shipment) {
    setForm(shipmentToForm(s));
    setEditingId(s.trackingNumber);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  }

  function updateTimelineStep(index: number, patch: Partial<TimelineStep>) {
    setForm((f) => ({
      ...f,
      timeline: f.timeline.map((step, i) => (i === index ? { ...step, ...patch } : step)),
    }));
  }

  function addTimelineStep() {
    setForm((f) => ({
      ...f,
      timeline: [...f.timeline, { label: "", detail: "", timestamp: "", location: "", complete: false, current: false }],
    }));
  }

  function removeTimelineStep(index: number) {
    setForm((f) => ({ ...f, timeline: f.timeline.filter((_, i) => i !== index) }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      trackingNumber: form.trackingNumber.trim().toUpperCase(),
      mode: form.mode,
      status: form.status,
      statusLabel: form.statusLabel,
      senderName: form.senderName,
      senderAddress: form.senderAddress,
      senderPhone: form.senderPhone,
      senderEmail: form.senderEmail,
      receiverName: form.receiverName,
      receiverAddress: form.receiverAddress,
      receiverPhone: form.receiverPhone,
      receiverEmail: form.receiverEmail,
      origin: { code: form.originCode, city: form.originCity, country: form.originCountry },
      destination: { code: form.destinationCode, city: form.destinationCity, country: form.destinationCountry },
      progress: Math.min(Math.max(Number(form.progress) / 100, 0), 1),
      vessel: form.vessel,
      eta: form.eta,
      containers: form.containers,
      weight: form.weight,
      timeline: form.timeline,
    };

    const isNew = editingId === "new";
    const url = isNew ? "/api/admin/shipments" : `/api/admin/shipments/${editingId}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to save shipment.");
      setSaving(false);
      return;
    }

    setSaving(false);
    cancelEdit();
    load();
  }

  async function remove(trackingNumber: string) {
    if (!confirm(`Delete shipment ${trackingNumber}? This can't be undone.`)) return;
    await fetch(`/api/admin/shipments/${trackingNumber}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-100">Shipments</h1>
        {editingId === null && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gold-400 px-4 py-2 text-sm font-semibold text-royal-950 hover:bg-gold-300"
          >
            <Plus className="h-4 w-4" />
            New shipment
          </button>
        )}
      </div>

      {editingId !== null && (
        <form onSubmit={save} className="glass glass-edge mt-6 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-ink-100">
              {editingId === "new" ? "New shipment" : `Edit ${editingId}`}
            </h2>
            <button type="button" onClick={cancelEdit} className="text-ink-400 hover:text-ink-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-xs text-ink-400">Tracking number</span>
              <input
                required
                disabled={editingId !== "new"}
                value={form.trackingNumber}
                onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })}
                className={`${inputClass} mt-1 font-mono disabled:opacity-60`}
              />
            </label>
            <label className="block">
              <span className="text-xs text-ink-400">Mode</span>
              <select
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value as Shipment["mode"] })}
                className={`${inputClass} mt-1`}
              >
                <option value="ocean">Ocean</option>
                <option value="air">Air</option>
                <option value="multimodal">Multimodal</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-ink-400">Status</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Shipment["status"] })}
                className={`${inputClass} mt-1`}
              >
                <option value="in-transit">In transit</option>
                <option value="customs">Customs</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
              </select>
            </label>
            <label className="block sm:col-span-3">
              <span className="text-xs text-ink-400">Status label (shown to customer)</span>
              <input
                required
                value={form.statusLabel}
                onChange={(e) => setForm({ ...form, statusLabel: e.target.value })}
                className={`${inputClass} mt-1`}
              />
            </label>
          </div>

          <div className="mt-6 border-t border-white/8 pt-5">
            <h3 className="text-sm font-medium text-ink-200">Sender (Shipper)</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="text-xs text-ink-400">Sender's full name</span>
                <input value={form.senderName} onChange={(e) => setForm({ ...form, senderName: e.target.value })} className={`${inputClass} mt-1`} />
              </label>
              <label className="block">
                <span className="text-xs text-ink-400">Sender's phone</span>
                <input value={form.senderPhone} onChange={(e) => setForm({ ...form, senderPhone: e.target.value })} className={`${inputClass} mt-1`} />
              </label>
              <label className="block">
                <span className="text-xs text-ink-400">Sender's email</span>
                <input type="email" value={form.senderEmail} onChange={(e) => setForm({ ...form, senderEmail: e.target.value })} className={`${inputClass} mt-1`} />
              </label>
              <label className="block sm:col-span-3">
                <span className="text-xs text-ink-400">Complete pickup address</span>
                <textarea value={form.senderAddress} onChange={(e) => setForm({ ...form, senderAddress: e.target.value })} className={`${inputClass} mt-1 min-h-16 resize-y`} />
              </label>
            </div>
          </div>

          <div className="mt-6 border-t border-white/8 pt-5">
            <h3 className="text-sm font-medium text-ink-200">Receiver (Consignee)</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="text-xs text-ink-400">Receiver's full name</span>
                <input value={form.receiverName} onChange={(e) => setForm({ ...form, receiverName: e.target.value })} className={`${inputClass} mt-1`} />
              </label>
              <label className="block">
                <span className="text-xs text-ink-400">Receiver's phone</span>
                <input value={form.receiverPhone} onChange={(e) => setForm({ ...form, receiverPhone: e.target.value })} className={`${inputClass} mt-1`} />
              </label>
              <label className="block">
                <span className="text-xs text-ink-400">Receiver's email</span>
                <input type="email" value={form.receiverEmail} onChange={(e) => setForm({ ...form, receiverEmail: e.target.value })} className={`${inputClass} mt-1`} />
              </label>
              <label className="block sm:col-span-3">
                <span className="text-xs text-ink-400">Complete delivery address</span>
                <textarea value={form.receiverAddress} onChange={(e) => setForm({ ...form, receiverAddress: e.target.value })} className={`${inputClass} mt-1 min-h-16 resize-y`} />
              </label>
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-t border-white/8 pt-5 sm:grid-cols-3">
            <label className="block">
              <span className="text-xs text-ink-400">Origin code</span>
              <input required value={form.originCode} onChange={(e) => setForm({ ...form, originCode: e.target.value })} className={`${inputClass} mt-1`} />
            </label>
            <label className="block">
              <span className="text-xs text-ink-400">Origin city</span>
              <input required value={form.originCity} onChange={(e) => setForm({ ...form, originCity: e.target.value })} className={`${inputClass} mt-1`} />
            </label>
            <label className="block">
              <span className="text-xs text-ink-400">Origin country</span>
              <input required value={form.originCountry} onChange={(e) => setForm({ ...form, originCountry: e.target.value })} className={`${inputClass} mt-1`} />
            </label>

            <label className="block">
              <span className="text-xs text-ink-400">Destination code</span>
              <input required value={form.destinationCode} onChange={(e) => setForm({ ...form, destinationCode: e.target.value })} className={`${inputClass} mt-1`} />
            </label>
            <label className="block">
              <span className="text-xs text-ink-400">Destination city</span>
              <input required value={form.destinationCity} onChange={(e) => setForm({ ...form, destinationCity: e.target.value })} className={`${inputClass} mt-1`} />
            </label>
            <label className="block">
              <span className="text-xs text-ink-400">Destination country</span>
              <input required value={form.destinationCountry} onChange={(e) => setForm({ ...form, destinationCountry: e.target.value })} className={`${inputClass} mt-1`} />
            </label>

            <label className="block">
              <span className="text-xs text-ink-400">Progress (%)</span>
              <input type="number" min={0} max={100} value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} className={`${inputClass} mt-1`} />
            </label>
            <label className="block">
              <span className="text-xs text-ink-400">Vessel / flight</span>
              <input value={form.vessel} onChange={(e) => setForm({ ...form, vessel: e.target.value })} className={`${inputClass} mt-1`} />
            </label>
            <label className="block">
              <span className="text-xs text-ink-400">ETA</span>
              <input value={form.eta} onChange={(e) => setForm({ ...form, eta: e.target.value })} className={`${inputClass} mt-1`} />
            </label>
            <label className="block">
              <span className="text-xs text-ink-400">Containers</span>
              <input value={form.containers} onChange={(e) => setForm({ ...form, containers: e.target.value })} className={`${inputClass} mt-1`} />
            </label>
            <label className="block">
              <span className="text-xs text-ink-400">Weight</span>
              <input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className={`${inputClass} mt-1`} />
            </label>
          </div>

          <div className="mt-6 border-t border-white/8 pt-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-ink-200">Timeline steps</h3>
              <button type="button" onClick={addTimelineStep} className="text-xs font-medium text-gold-300 hover:text-gold-200">
                + Add step
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {form.timeline.map((step, i) => (
                <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border border-white/8 p-3 sm:grid-cols-6">
                  <input placeholder="Label" value={step.label} onChange={(e) => updateTimelineStep(i, { label: e.target.value })} className={`${inputClass} sm:col-span-2`} />
                  <input placeholder="Detail" value={step.detail} onChange={(e) => updateTimelineStep(i, { detail: e.target.value })} className={`${inputClass} sm:col-span-2`} />
                  <input placeholder="Timestamp" value={step.timestamp} onChange={(e) => updateTimelineStep(i, { timestamp: e.target.value })} className={inputClass} />
                  <input placeholder="Location" value={step.location} onChange={(e) => updateTimelineStep(i, { location: e.target.value })} className={inputClass} />
                  <label className="flex items-center gap-1.5 text-xs text-ink-300">
                    <input type="checkbox" checked={step.complete} onChange={(e) => updateTimelineStep(i, { complete: e.target.checked })} />
                    Complete
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-ink-300">
                    <input type="checkbox" checked={step.current} onChange={(e) => updateTimelineStep(i, { current: e.target.checked })} />
                    Current
                  </label>
                  <button type="button" onClick={() => removeTimelineStep(i)} className="flex items-center justify-center text-ink-500 hover:text-signal-red">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {form.timeline.length === 0 && <p className="text-xs text-ink-500">No timeline steps yet.</p>}
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-signal-red">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold-400 px-5 py-2.5 text-sm font-semibold text-royal-950 hover:bg-gold-300 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save shipment"}
          </button>
        </form>
      )}

      <div className="glass glass-edge mt-6 overflow-x-auto rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/8 text-xs text-ink-400">
              <th className="px-4 py-3 font-medium">Tracking #</th>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Progress</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-ink-500">Loading…</td></tr>
            )}
            {!loading && shipments.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-ink-500">No shipments yet.</td></tr>
            )}
            {shipments.map((s) => (
              <tr key={s.trackingNumber} className="border-b border-white/6 last:border-0">
                <td className="px-4 py-3 font-mono text-ink-100">{s.trackingNumber}</td>
                <td className="px-4 py-3 text-ink-300">{s.origin.code} → {s.destination.code}</td>
                <td className="px-4 py-3 text-ink-300">{s.statusLabel}</td>
                <td className="px-4 py-3 font-mono text-ink-300">{Math.round(s.progress * 100)}%</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <a
                      href={`/api/admin/shipments/${s.trackingNumber}/receipt`}
                      title="Download receipt (PDF)"
                      className="text-ink-400 hover:text-ink-100"
                    >
                      <FileText className="h-4 w-4" />
                    </a>
                    <button onClick={() => startEdit(s)} className="text-ink-400 hover:text-ink-100">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(s.trackingNumber)} className="text-ink-400 hover:text-signal-red">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
