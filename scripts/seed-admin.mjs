#!/usr/bin/env node
// Creates (or updates the password of) the single admin account.
// Never prints the plaintext password anywhere.
//
//   DATABASE_URL=postgres://... ADMIN_EMAIL=you@royalbluehorizon.com ADMIN_PASSWORD=... node scripts/seed-admin.mjs

import bcrypt from "bcryptjs";
import pg from "pg";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!connectionString) {
    console.error("Set DATABASE_URL first.");
    process.exit(1);
  }
  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD first.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("ADMIN_PASSWORD should be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const client = new pg.Client({
    connectionString,
    ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
  });
  await client.connect();
  try {
    await client.query(
      `INSERT INTO admin_users (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [email.toLowerCase().trim(), passwordHash]
    );
    console.log(`Admin account ready for ${email}.`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
