# Royal Blue Horizon

Global freight forwarding marketing site, live shipment tracking, secure
booking, and an admin panel — backed by a real Postgres database.

## Going live (once hosting is picked)

This app now needs a host that runs a real Node server (Vercel, Fly.io,
Render, etc.) — it's no longer a static export, because tracking, booking,
and the admin panel all read/write a real database.

1. **Provision Postgres.** Any Postgres works (Neon, Vercel Postgres, Fly
   Postgres, Supabase). Copy `.env.example` to `.env.local` and set
   `DATABASE_URL`.

2. **Generate a session secret** and set it as `ADMIN_SESSION_SECRET`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

3. **Create the tables:**
   ```bash
   npm run db:migrate
   ```

4. **Create the admin login** (never commit these values — pass them inline):
   ```bash
   ADMIN_EMAIL=you@royalbluehorizon.com ADMIN_PASSWORD=your-password npm run db:seed-admin
   ```
   Re-running this updates the password for that email — it's how you
   change the admin password later too.

5. **(Optional) Seed the 4 demo shipments** already used in the pitch
   (`RBH4821903`, `RBH1029447`, `RBH7734215`, `RBH5560098`) so tracking
   keeps working exactly as shown before:
   ```bash
   npm run db:seed-shipments
   ```

6. **Set the same `DATABASE_URL` and `ADMIN_SESSION_SECRET`** as
   environment variables on whichever host you deploy to, then deploy
   normally (`vercel`, `fly deploy`, etc.) — no other config needed.

## What's real vs. mock

- **Tracking** (`/track`) — real: looks up shipments from Postgres via
  `GET /api/track/[trackingNumber]`.
- **Booking** (`/book`) — real: submits to Postgres via `POST /api/bookings`,
  returns a real generated reference.
- **Admin panel** (`/admin`) — real: single email+password login
  (bcrypt-hashed, JWT session cookie), full CRUD on shipments, and a list/
  status-tracker for booking requests.
- **Live chat** — still a scripted, keyword-based widget (no real backend or
  human agent) — this was always presented as a preview layer, not changed
  in this pass.

## Admin panel

Visit `/admin/login`. There's exactly one admin account (see step 4 above)
— no self-registration, no roles. Sessions last 12 hours. 5 failed login
attempts locks that email out for 15 minutes (in-memory; resets if the
server restarts).

## Local development

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL and ADMIN_SESSION_SECRET
npm run db:migrate
ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:seed-admin
npm run db:seed-shipments
npm run dev
```
