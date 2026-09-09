type Node = { x: number; y: number; code: string };
type Arc = { path: string; duration: string; delay?: string };

const NODES: Node[] = [
  { x: 130, y: 300, code: "CNSHA" },
  { x: 610, y: 210, code: "AEJEA" },
  { x: 960, y: 260, code: "NLRTM" },
  { x: 300, y: 370, code: "SGSIN" },
  { x: 790, y: 360, code: "NGLOS" },
];

const ARCS: Arc[] = [
  { path: "M130,300 Q370,90 610,210", duration: "9s" },
  { path: "M610,210 Q790,120 960,260", duration: "11s", delay: "-3s" },
  { path: "M300,370 Q480,470 610,210", duration: "13s", delay: "-6s" },
  { path: "M300,370 Q560,300 790,360", duration: "10s", delay: "-1.5s" },
];

export default function RouteScene({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1100 480"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="route-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#85a0ff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#c1ceff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f2d59a" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="node-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f2d59a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f2d59a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* latitude arcs suggesting a globe */}
      {[120, 200, 280, 360].map((y, i) => (
        <path
          key={y}
          d={`M0,${y} Q550,${y - 60 + i * 6} 1100,${y}`}
          stroke="#4d68ff"
          strokeOpacity="0.08"
          strokeWidth="1"
        />
      ))}

      {ARCS.map((arc, i) => (
        <g key={i}>
          <path d={arc.path} stroke="url(#route-stroke)" strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
          <circle r="4" fill="#f2d59a">
            <animateMotion
              dur={arc.duration}
              begin={arc.delay ?? "0s"}
              repeatCount="indefinite"
              path={arc.path}
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur={arc.duration}
              begin={arc.delay ?? "0s"}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      {NODES.map((node) => (
        <g key={node.code} transform={`translate(${node.x} ${node.y})`}>
          <circle r="16" fill="url(#node-glow)" className="animate-pulse-glow" style={{ transformOrigin: "center" }} />
          <circle r="3" fill="#f1f4ff" />
          <text
            x="10"
            y="4"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fill="#aab3d9"
            letterSpacing="0.02em"
          >
            {node.code}
          </text>
        </g>
      ))}
    </svg>
  );
}
