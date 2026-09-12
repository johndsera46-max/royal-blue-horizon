#!/usr/bin/env node
// Applies db/schema.sql against DATABASE_URL. Safe to re-run (CREATE TABLE
// IF NOT EXISTS / CREATE EXTENSION IF NOT EXISTS throughout).
//
//   DATABASE_URL=postgres://... node scripts/migrate.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Set DATABASE_URL first.");
    process.exit(1);
  }

  const sql = readFileSync(join(__dirname, "..", "db", "schema.sql"), "utf8");
  const client = new pg.Client({
    connectionString,
    ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
  });

  await client.connect();
  try {
    await client.query(sql);
    console.log("Schema applied.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
