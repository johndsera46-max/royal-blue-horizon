-- Royal Blue Horizon — real backend schema.
-- Run via `npm run db:migrate` once DATABASE_URL is set.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shipments (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number    TEXT UNIQUE NOT NULL,
  mode               TEXT NOT NULL DEFAULT 'ocean',      -- ocean | air | multimodal
  status             TEXT NOT NULL DEFAULT 'in-transit',  -- in-transit | customs | delivered | delayed
  status_label       TEXT NOT NULL DEFAULT 'In transit',
  sender_name        TEXT NOT NULL DEFAULT '',
  sender_address     TEXT NOT NULL DEFAULT '',
  sender_phone       TEXT NOT NULL DEFAULT '',
  sender_email       TEXT NOT NULL DEFAULT '',
  receiver_name      TEXT NOT NULL DEFAULT '',
  receiver_address   TEXT NOT NULL DEFAULT '',
  receiver_phone     TEXT NOT NULL DEFAULT '',
  receiver_email     TEXT NOT NULL DEFAULT '',
  origin_code        TEXT NOT NULL,
  origin_city        TEXT NOT NULL,
  origin_country     TEXT NOT NULL,
  destination_code   TEXT NOT NULL,
  destination_city   TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  progress           NUMERIC(4,3) NOT NULL DEFAULT 0,     -- 0.000–1.000
  vessel             TEXT NOT NULL DEFAULT '',
  eta                TEXT NOT NULL DEFAULT '',
  containers         TEXT NOT NULL DEFAULT '',
  weight             TEXT NOT NULL DEFAULT '',
  timeline           JSONB NOT NULL DEFAULT '[]',         -- [{label, detail, timestamp, location, complete, current}]
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE shipments ADD COLUMN IF NOT EXISTS sender_name      TEXT NOT NULL DEFAULT '';
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS sender_address   TEXT NOT NULL DEFAULT '';
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS sender_phone     TEXT NOT NULL DEFAULT '';
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS sender_email     TEXT NOT NULL DEFAULT '';
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS receiver_name    TEXT NOT NULL DEFAULT '';
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS receiver_address TEXT NOT NULL DEFAULT '';
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS receiver_phone   TEXT NOT NULL DEFAULT '';
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS receiver_email   TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference        TEXT UNIQUE NOT NULL,
  mode             TEXT NOT NULL,
  sender_name      TEXT NOT NULL DEFAULT '',
  sender_address   TEXT NOT NULL DEFAULT '',
  sender_phone     TEXT NOT NULL DEFAULT '',
  sender_email     TEXT NOT NULL DEFAULT '',
  receiver_name    TEXT NOT NULL DEFAULT '',
  receiver_address TEXT NOT NULL DEFAULT '',
  receiver_phone   TEXT NOT NULL DEFAULT '',
  receiver_email   TEXT NOT NULL DEFAULT '',
  origin           TEXT NOT NULL,
  destination      TEXT NOT NULL,
  ready_date       TEXT NOT NULL DEFAULT '',
  eta              TEXT NOT NULL DEFAULT '',
  incoterm         TEXT NOT NULL DEFAULT '',
  cargo_type       TEXT NOT NULL DEFAULT '',
  description      TEXT NOT NULL DEFAULT '',
  weight           TEXT NOT NULL DEFAULT '',
  units            TEXT NOT NULL DEFAULT '',
  notes            TEXT NOT NULL DEFAULT '',
  full_name        TEXT NOT NULL,
  company          TEXT NOT NULL DEFAULT '',
  email            TEXT NOT NULL,
  phone            TEXT NOT NULL DEFAULT '',
  contact_method   TEXT NOT NULL DEFAULT 'email',
  status           TEXT NOT NULL DEFAULT 'new',  -- new | contacted | quoted | won | lost
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Idempotent patch for databases that already have the bookings table from
-- before sender/receiver/ETA were added (safe to re-run).
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS sender_name      TEXT NOT NULL DEFAULT '';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS sender_address   TEXT NOT NULL DEFAULT '';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS sender_phone     TEXT NOT NULL DEFAULT '';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS sender_email     TEXT NOT NULL DEFAULT '';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS receiver_name    TEXT NOT NULL DEFAULT '';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS receiver_address TEXT NOT NULL DEFAULT '';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS receiver_phone   TEXT NOT NULL DEFAULT '';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS receiver_email   TEXT NOT NULL DEFAULT '';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS eta              TEXT NOT NULL DEFAULT '';
