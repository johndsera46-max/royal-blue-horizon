import { Ship, Plane, FileCheck2, Warehouse, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ServicesSection() {
  return (
    <section id="services" className="relative bg-ink py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-ink-100 sm:text-5xl">
            One network, every mode of transport.
          </h2>
          <p className="mt-4 text-lg text-ink-300">
            From a single pallet to a full charter vessel — booked, cleared,
            and tracked under one roof.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:grid-rows-2">
          {/* Ocean freight — featured, tall, photographic */}
          <div className="glass-edge relative overflow-hidden rounded-3xl p-8 lg:col-span-2 lg:row-span-2">
            <Image
              src="/images/ocean-freight.jpg"
              alt="Container ship underway at sea"
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-royal-950/40" />
            <div className="absolute inset-0 bg-royal-950/25" />

            <div className="relative z-10 flex h-full flex-col">
              <Ship className="h-7 w-7 text-ink-100" strokeWidth={1.5} />
              <h3 className="mt-6 font-display text-2xl font-medium text-ink-100">
                Ocean freight
              </h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-200">
                FCL and LCL across 90+ trade lanes, with container-level
                visibility from gate-in to final discharge. Charter capacity
                available for volume shippers.
              </p>
              <div className="mt-auto pt-10">
                <div className="flex items-end justify-between border-t border-white/15 pt-5">
                  <div className="font-mono text-xs text-ink-300">
                    MV Horizon Star · 62% en route
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/12">
                  <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-royal-400 to-gold-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Air freight */}
          <div className="glass-edge relative overflow-hidden rounded-3xl p-7">
            <Image
              src="/images/air-freight.jpg"
              alt="Cargo aircraft taking off"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-royal-950/30" />
            <div className="relative z-10">
              <Plane className="h-6 w-6 text-ink-100" strokeWidth={1.5} />
              <h3 className="mt-5 font-display text-xl font-medium text-ink-100">Air freight</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-200">
                Time-critical cargo on scheduled and charter flights, door to
                airport or door to door in under 48 hours.
              </p>
            </div>
          </div>

          {/* Customs & compliance */}
          <div className="glass-edge relative overflow-hidden rounded-3xl p-7">
            <Image
              src="/images/customs.jpg"
              alt="Cranes and containers at a shipping port"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-royal-950/35" />
            <div className="relative z-10">
              <FileCheck2 className="h-6 w-6 text-ink-100" strokeWidth={1.5} />
              <h3 className="mt-5 font-display text-xl font-medium text-ink-100">
                Customs & compliance
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-200">
                Licensed brokerage across every trade lane we operate — duties,
                documentation, and clearance handled before arrival.
              </p>
            </div>
          </div>

          {/* Warehousing */}
          <div className="glass-edge relative overflow-hidden rounded-3xl p-7 lg:col-span-1">
            <Image
              src="/images/warehousing.jpg"
              alt="Forklift moving pallets in a warehouse"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-royal-950/35" />
            <div className="relative z-10">
              <Warehouse className="h-6 w-6 text-ink-100" strokeWidth={1.5} />
              <h3 className="mt-5 font-display text-xl font-medium text-ink-100">
                Warehousing & distribution
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-200">
                Bonded storage and final-mile distribution at 34 hubs, synced to
                the same tracking timeline as your ocean and air legs.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/book"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-gold-300 transition-colors hover:text-gold-200"
        >
          Request a quote for any of these
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
