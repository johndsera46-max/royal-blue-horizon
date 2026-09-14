#!/usr/bin/env node
// Runs db/schema.sql automatically during `vercel-build`, before `next build`.
// Unlike scripts/migrate.mjs (used for manual `npm run db:migrate`), this is
// tolerant of a missing DATABASE_URL so Preview builds without a database
// attached still succeed — only fails the build if DATABASE_URL is set and
// the migration itself errors.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("DATABASE_URL not set — skipping schema migration for this build.");
    return;
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
  console.error("Schema migration failed during build:", err);
  process.exit(1);
});
