import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import RouteScene from "./RouteScene";

export default function CTASection() {
  return (
    <section className="horizon-scene relative overflow-hidden py-32">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-sunset-ship.jpg"
          alt="Cargo ship crossing the ocean at sunset"
          fill
          sizes="100vw"
          className="object-cover opacity-[0.18] [transform:scaleX(-1)]"
        />
        <div className="absolute inset-0 horizon-scene opacity-95" />
      </div>
      <div className="animate-drift absolute inset-0 opacity-50">
        <RouteScene className="absolute inset-0 h-full w-full" />
      </div>
      <div className="horizon-line" style={{ top: "88%" }} />

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <h2 className="font-display text-4xl font-semibold tracking-tight text-ink-100 sm:text-6xl">
          Ready to move your cargo forward?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-300">
          Get a rated quote in minutes and a live timeline the moment it
          leaves the dock.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/book"
            className="group inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-7 py-4 text-sm font-semibold text-royal-950 shadow-[0_10px_30px_-8px_rgba(232,189,107,0.7)] transition-all hover:bg-gold-300"
          >
            Request booking
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/track"
            className="glass rounded-full px-7 py-4 text-sm font-medium text-ink-100 transition-colors hover:bg-white/10"
          >
            Track an existing shipment
          </Link>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-ink-500">
          <ShieldCheck className="h-3.5 w-3.5 text-signal-green" />
          Secure booking · encrypted submission · no spam
        </div>
      </div>
    </section>
  );
}
