export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rbh-sky" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4d68ff" />
          <stop offset="0.65" stopColor="#1a2f9e" />
          <stop offset="1" stopColor="#e8bd6b" />
        </linearGradient>
        <linearGradient id="rbh-arc" x1="4" y1="30" x2="36" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f2d59a" stopOpacity="0" />
          <stop offset="0.5" stopColor="#f2d59a" />
          <stop offset="1" stopColor="#f2d59a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17.5" stroke="url(#rbh-sky)" strokeWidth="2" fill="none" />
      <path d="M20 2.5C20 2.5 29 10 29 20C29 30 20 37.5 20 37.5" stroke="#85a0ff" strokeOpacity="0.55" strokeWidth="1" />
      <path d="M5 24c4-2 8.5-3 15-3s11 1 15 3" stroke="url(#rbh-arc)" strokeWidth="1.5" />
      <circle cx="8" cy="23.2" r="1.6" fill="#f2d59a" />
    </svg>
  );
}
