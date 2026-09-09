import Link from "next/link";
import Logo from "./Logo";

const COLUMNS = [
  {
    heading: "Network",
    links: [
      { label: "Ocean freight", href: "/#services" },
      { label: "Air freight", href: "/#services" },
      { label: "Customs & compliance", href: "/#services" },
      { label: "Warehousing", href: "/#services" },
    ],
  },
  {
    heading: "Shipments",
    links: [
      { label: "Track a shipment", href: "/track" },
      { label: "Request booking", href: "/book" },
      { label: "Global network", href: "/#network" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Operations centers", href: "/#network" },
      { label: "Contact", href: "/book" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-ink-2">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <span className="font-display text-[15px] font-semibold text-ink-100">
                Royal Blue Horizon
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              Ocean, air, and multimodal freight forwarding — booked, cleared,
              and tracked from origin dock to final horizon.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="font-display text-sm font-medium text-ink-200">{col.heading}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-400 transition-colors hover:text-ink-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/8 pt-8 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Royal Blue Horizon Logistics. All routes plausible, all cargo fictional.</p>
          <p className="font-mono tracking-tight">Design & build capability preview</p>
        </div>
      </div>
    </footer>
  );
}
