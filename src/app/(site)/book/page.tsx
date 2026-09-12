import type { Metadata } from "next";
import { ShieldCheck, Lock, Clock } from "lucide-react";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Request booking — Royal Blue Horizon",
  description: "Request a secure freight booking quote from Royal Blue Horizon.",
};

const TRUST = [
  { icon: Lock, label: "Encrypted submission" },
  { icon: ShieldCheck, label: "Never sold or shared" },
  { icon: Clock, label: "~11 min avg. response" },
];

export default function BookPage() {
  return (
    <div className="horizon-scene relative min-h-[calc(100vh-4rem)] overflow-hidden py-20">
      <div className="horizon-line" style={{ top: "94%" }} />
      <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-100 sm:text-5xl">
          Request a booking
        </h1>
        <p className="mt-3 max-w-lg text-ink-300">
          Tell us what&apos;s moving and where. A rated quote lands in your
          inbox, and every shipment gets a live tracking link from day one.
        </p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-400">
          {TRUST.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-gold-400" />
              {label}
            </span>
          ))}
        </div>

        <div className="mt-10">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
