import { Pool } from "pg";

declare global {
  var __rbhPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }
  return new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require") || process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
  });
}

// Lazy singleton: the connection string is only required once a request
// actually needs the database, not at module import time — Next.js
// statically imports every route module while collecting build output, so
// eagerly creating a Pool here would make DATABASE_URL a hard build-time
// requirement instead of a runtime one.
export function getPool(): Pool {
  if (!global.__rbhPool) {
    global.__rbhPool = createPool();
  }
  return global.__rbhPool;
}
