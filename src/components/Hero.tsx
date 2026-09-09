"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Radar } from "lucide-react";
import RouteScene from "./RouteScene";
import { EXAMPLE_TRACKING_NUMBERS } from "@/lib/tracking";

export default function Hero() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const id = value.trim() || EXAMPLE_TRACKING_NUMBERS[0];
    router.push(`/track?id=${encodeURIComponent(id)}`);
  }

  return (
    <section className="horizon-scene relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-sunset-ship.jpg"
          alt="Cargo ship crossing the ocean at sunset"
          fill
          priority
          className="object-cover opacity-45 mix-blend-luminosity"
        />
        <div className="absolute inset-0 horizon-scene opacity-90" />
      </div>
      <div className="animate-drift absolute inset-0 opacity-90">
        <RouteScene className="absolute inset-0 h-full w-full" />
      </div>
      <div className="horizon-line" style={{ top: "78%" }} />

      <div className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-center px-6 pt-28 pb-40 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-ink-300">
            <Radar className="h-3.5 w-3.5 text-gold-400" />
            <span className="font-mono tracking-tight">4,382 active shipments on the water right now</span>
          </div>

          <h1 className="font-display text-[clamp(2.6rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-tight text-ink-100">
            Cargo moving across
            <br />
            <span className="text-transparent [-webkit-text-stroke:1.5px_#c1ceff]">every horizon,</span>
            <br />
            visible the moment it moves.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300">
            Royal Blue Horizon moves ocean, air, and multimodal freight across
            108 ports — and puts every leg of the journey, live, in your hands.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="glass-strong glass-edge relative mt-14 flex w-full max-w-2xl flex-col gap-3 rounded-2xl p-2.5 sm:flex-row sm:items-center"
        >
          <label htmlFor="hero-track" className="sr-only">
            Tracking number
          </label>
          <input
            id="hero-track"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter tracking number — try ${EXAMPLE_TRACKING_NUMBERS[0]}`}
            className="w-full flex-1 rounded-xl bg-transparent px-4 py-3.5 font-mono text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            className="group flex items-center justify-center gap-1.5 rounded-xl bg-gold-400 px-5 py-3.5 text-sm font-semibold text-royal-950 transition-colors hover:bg-gold-300"
          >
            Track shipment
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-500">
          <span>Try:</span>
          {EXAMPLE_TRACKING_NUMBERS.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => router.push(`/track?id=${num}`)}
              className="font-mono text-ink-400 underline decoration-white/15 underline-offset-4 transition-colors hover:text-gold-300 hover:decoration-gold-300"
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
