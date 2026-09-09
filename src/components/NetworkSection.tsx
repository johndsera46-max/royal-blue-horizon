import Image from "next/image";

const HUBS = [
  { city: "Shanghai", code: "CNSHA", coords: "31.2°N, 121.5°E", role: "Origin hub — East Asia" },
  { city: "Singapore", code: "SGSIN", coords: "1.3°N, 103.8°E", role: "Transshipment hub" },
  { city: "Jebel Ali", code: "AEJEA", coords: "25.0°N, 55.1°E", role: "Gulf gateway" },
  { city: "Rotterdam", code: "NLRTM", coords: "51.9°N, 4.5°E", role: "European gateway" },
  { city: "Lagos", code: "NGLOS", coords: "6.5°N, 3.4°E", role: "West Africa hub" },
  { city: "Los Angeles", code: "USLAX", coords: "33.7°N, 118.3°W", role: "Pacific gateway" },
];

export default function NetworkSection() {
  return (
    <section id="network" className="relative overflow-hidden bg-ink-2 py-28">
      <div className="absolute inset-0">
        <Image
          src="/images/network-port.jpg"
          alt="Aerial view of a container port"
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-2 via-ink-2/85 to-ink-2" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-royal-400/10" />
        <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-royal-400/10" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-400/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-ink-100 sm:text-5xl">
            A control tower over 108 ports.
          </h2>
          <p className="mt-4 text-lg text-ink-300">
            Every hub feeds the same live timeline — so a shipment handed off
            in Shanghai reads exactly the same in Rotterdam.
          </p>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HUBS.map((hub) => (
            <div
              key={hub.code}
              className="glass glass-edge group relative overflow-hidden rounded-2xl p-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-wide text-gold-300">{hub.code}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-signal-green shadow-[0_0_10px_2px_rgba(79,214,140,0.7)]" />
              </div>
              <h3 className="mt-4 font-display text-lg font-medium text-ink-100">{hub.city}</h3>
              <p className="mt-1 text-sm text-ink-400">{hub.role}</p>
              <p className="mt-3 font-mono text-[11px] text-ink-500">{hub.coords}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
