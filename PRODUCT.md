# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion, deployed for a shareable live preview URL. User-decided.

## Users

Primary user: a prospective logistics-company client evaluating whether to commission Ronald (a solo builder/freelancer, pitching under a neutral GitHub identity separate from his other ventures) to build their real company website. They will view this as a portfolio/capability demo, likely in a live walkthrough or shared link, and are judging craft, polish, and whether this builder can deliver something "jaw-dropping" and futuristic for their brand.

Secondary (simulated) user: the fictional freight company's own customers, represented inside the demo, who would use the site to track a global freight/cargo shipment.

## Product Purpose

A speculative marketing + tracking website for a fictional global freight/cargo shipping company ("Royal Blue Horizon" / "RBH" — placeholder brand, chosen by the user for this demo). Built pre-contract as a portfolio piece to prove capability and win a real logistics-company commission. Success = the prospective client is impressed enough by visual craft and the tracking experience to award the real contract.

## Positioning

Not a real, operating logistics company. The site must read as premium, futuristic, and enterprise-grade (glassmorphism, motion, dark sci-fi-leaning palette) — distinctly more polished than typical freight/logistics industry sites, which tend to be dated and utilitarian. The differentiator being pitched is design/engineering craft, not a real business claim.

## Operating Context

Viewed as a live demo (local dev preview and/or deployed URL) during or ahead of a sales conversation. No real backend, customers, or shipments exist yet.

## Capabilities and Constraints

- Marketing/landing pages for a global freight & cargo shipping company (ocean/air freight, containers, ports, customs framing).
- A shipment tracking feature: user enters a tracking number and sees an animated shipment timeline/route — backed by **realistic mock data only**, no real backend, database, or carrier API (explicitly decided over building real functional tracking, to move fast pre-contract).
- A live chat widget (floating, on every page): a scripted, keyword-based assistant ("Aria, Ops desk") with typing-indicator and timestamped messages for a human feel. Honestly framed as an assistant/preview layer, not impersonating a specific real employee, since there is no real backend or human on the other end in this demo.
- A secure booking/quote request application form (multi-step: shipment details, cargo details, contact/company info) so a prospective customer can request freight booking. Styled and framed as secure (encryption/trust badges, validation, confirmation state) but, like tracking, has **no real backend** in this demo — submission shows a polished success/confirmation state client-side only; no data is actually transmitted or stored. This is a client-requested addition to the pitch demo.
- All company facts, testimonials, stats, routes, and tracking data are fabricated for demo purposes and must read as plausible, not as real claims (no real customer names, no real financial/regulatory claims).
- Repo/GitHub account for this project is intentionally kept separate from the user's other ventures (BAWIZO-OPTIMUS org) to avoid brand confusion; hosted under a neutral personal GitHub account.

## Brand Commitments

Placeholder brand invented for this demo: **Meridian Global Logistics**. Name, wordmark, and all brand assets are placeholders the real client would replace; not a binding identity.

## Evidence on Hand

No real company data, testimonials, logos, or case studies exist. All content
(routes, tracking numbers, shipment stats, testimonials) is fabricated/plausible
placeholder content, clearly a demo rather than misrepresented as real.
Photography is real, licensed stock (Unsplash License, free for commercial use,
verified to resolve), stored in `public/images/`: cargo ship at sunset (hero/CTA),
container ship, cargo aircraft, warehouse forklift, and two container-port shots
(services + network sections).

## Product Principles

1. Optimize for maximum visual impact in a short live-demo viewing — this is a pitch artifact, not a shipping product.
2. Every effect (glass, motion, gradients) must still read as premium and purposeful for a freight/logistics brand, not generic template flash.
3. Keep the tracking mock believable and delightful — it's the centerpiece feature most likely to make the client say yes.
4. Fabricated content must be plausible and non-misleading in intent, since this is transparently a capability demo.
5. Keep the build fast and deployable (Vercel-friendly) so a shareable link can go out quickly.
