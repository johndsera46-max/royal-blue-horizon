import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Royal Blue Horizon — Global Freight, Tracked in Real Time",
  description:
    "Ocean, air, and multimodal freight forwarding with live shipment tracking and secure booking — Royal Blue Horizon moves cargo across the horizon and back.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} ${body.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-ink text-ink-100 font-body antialiased selection:bg-royal-400/30 selection:text-white">
        {/*
          THESIS: The tracking experience is the hero, not a footnote — cargo is
          already in motion the instant the page loads, refusing the generic
          headline-plus-stock-ship freight-site default.
          OWN-WORLD: Near-black navy deepens into a royal-blue horizon band under
          a thin warm gold skyline; frosted bridge/cockpit-glass panels edged in
          blue light; glowing great-circle routes. Space Grotesk display, IBM
          Plex Mono for data, Inter body.
          STORY: A prospective client sees global cargo already moving, tracks a
          live-feeling shipment in seconds, and trusts this builder to ship
          something equally sharp for their real company.
          FIRST VIEWPORT: full-bleed horizon scene, an animated route arcing
          across it, a glass tracking panel floating center-low, input focused.
          FORM: committed Royal-Blue-Horizon world, brief-pinned by the user
          (glass + futuristic) — no concept roll, direction locked at brief.
          FINISH: unreviewed and undocumented is unfinished; this build ends
          with the finish review, the verdict, DESIGN.md, and every shipping
          raster carrying its provenance.
        */}
        {children}
      </body>
    </html>
  );
}
