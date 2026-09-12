import { Suspense } from "react";
import type { Metadata } from "next";
import TrackingExperience from "@/components/TrackingExperience";

export const metadata: Metadata = {
  title: "Track a shipment — Royal Blue Horizon",
  description: "Live status for any Royal Blue Horizon ocean, air, or multimodal shipment.",
};

export default function TrackPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink">
      <Suspense fallback={<div className="mx-auto max-w-5xl px-6 pt-16 text-ink-400">Loading…</div>}>
        <TrackingExperience />
      </Suspense>
    </div>
  );
}
