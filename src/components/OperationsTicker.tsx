const READOUTS = [
  { label: "Active shipments", value: "4,382" },
  { label: "Ports served", value: "108" },
  { label: "On-time arrival", value: "98.4%" },
  { label: "Avg. customs clearance", value: "6.2 hrs" },
  { label: "Countries", value: "63" },
  { label: "Fleet & charter partners", value: "212" },
  { label: "Containers moved / day", value: "9,140" },
  { label: "Avg. quote response", value: "11 min" },
];

export default function OperationsTicker() {
  const items = [...READOUTS, ...READOUTS];
  return (
    <div className="relative overflow-hidden border-y border-white/8 bg-ink-2 py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-2 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-2 to-transparent" />
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 font-mono text-[13px]">
            <span className="text-ink-500">{item.label}</span>
            <span className="font-tabular font-medium text-ink-100">{item.value}</span>
            <span className="ml-8 text-royal-400/40">/</span>
          </div>
        ))}
      </div>
    </div>
  );
}
