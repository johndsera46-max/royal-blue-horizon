import type { RoutePoint } from "@/lib/tracking";

function bezierPoint(t: number, p0: [number, number], p1: [number, number], p2: [number, number]) {
  const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0];
  const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1];
  return [x, y] as const;
}

export default function MiniRouteMap({
  origin,
  destination,
  progress,
}: {
  origin: RoutePoint;
  destination: RoutePoint;
  progress: number;
}) {
  const start: [number, number] = [50, 210];
  const end: [number, number] = [550, 130];
  const control: [number, number] = [300, 20];
  const pathD = `M${start[0]},${start[1]} Q${control[0]},${control[1]} ${end[0]},${end[1]}`;
  const [px, py] = bezierPoint(Math.min(Math.max(progress, 0), 1), start, control, end);

  return (
    <svg viewBox="0 0 600 240" className="h-full w-full" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="mini-route-done" x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]}>
          <stop offset="0" stopColor="#e8bd6b" />
          <stop offset="1" stopColor="#85a0ff" />
        </linearGradient>
      </defs>

      {[60, 120, 180].map((y) => (
        <path key={y} d={`M0,${y} Q300,${y - 30} 600,${y}`} stroke="#4d68ff" strokeOpacity="0.06" />
      ))}

      <path d={pathD} stroke="#4d68ff" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="1 8" strokeLinecap="round" />

      <path
        d={pathD}
        stroke="url(#mini-route-done)"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - Math.min(Math.max(progress, 0), 1)}
        style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1)" }}
      />

      <g transform={`translate(${start[0]} ${start[1]})`}>
        <circle r="5" fill="#f1f4ff" />
        <text x="0" y="26" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="#aab3d9">
          {origin.code}
        </text>
      </g>
      <g transform={`translate(${end[0]} ${end[1]})`}>
        <circle r="5" fill="#f1f4ff" />
        <text x="0" y="-14" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="#aab3d9">
          {destination.code}
        </text>
      </g>

      <g transform={`translate(${px} ${py})`}>
        <circle r="9" fill="#e8bd6b" opacity="0.25" className="animate-pulse-glow" style={{ transformOrigin: "center" }} />
        <circle r="4.5" fill="#f2d59a" stroke="#0a1140" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
