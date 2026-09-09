const QUOTES = [
  {
    quote:
      "We stopped calling for status updates. The timeline just tells us before we have to ask.",
    name: "Operations Lead",
    org: "Atlas Manufacturing Co.",
  },
  {
    quote:
      "Customs used to be our slowest leg. RBH's clearance times cut our dock-to-shelf window by two days.",
    name: "Supply Chain Director",
    org: "Nordic Textile Group",
  },
  {
    quote:
      "Booking a charter used to mean five emails and a phone call. Now it's one form.",
    name: "Procurement Manager",
    org: "Delta Components",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-ink py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="max-w-xl font-display text-4xl font-semibold tracking-tight text-ink-100 sm:text-5xl">
          Trusted by teams who move real cargo.
        </h2>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {QUOTES.map((t, i) => (
            <figure
              key={t.org}
              className={`glass glass-edge rounded-3xl p-8 ${i === 1 ? "lg:mt-10" : ""}`}
            >
              <blockquote className="font-display text-lg leading-snug text-ink-100">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/8 pt-5">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-royal-400 to-gold-400" />
                <div>
                  <div className="text-sm font-medium text-ink-100">{t.name}</div>
                  <div className="text-xs text-ink-500">{t.org}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
