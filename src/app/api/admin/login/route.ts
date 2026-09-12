import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getPool } from "@/lib/db";
import { createSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/auth";

interface AdminRow {
  id: string;
  email: string;
  password_hash: string;
}

// Simple in-memory rate limit: 5 attempts / 15 min per email. Resets on
// process restart — acceptable for a single-instance admin login; swap for
// a DB-backed table (like Optimus's LoginAttempt) if this ever runs
// multi-instance.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function isLocked(email: string): boolean {
  const rec = attempts.get(email);
  if (!rec) return false;
  if (Date.now() > rec.resetAt) {
    attempts.delete(email);
    return false;
  }
  return rec.count >= MAX_ATTEMPTS;
}

function recordFailure(email: string) {
  const rec = attempts.get(email);
  if (!rec || Date.now() > rec.resetAt) {
    attempts.set(email, { count: 1, resetAt: Date.now() + WINDOW_MS });
  } else {
    rec.count += 1;
  }
}

function clearFailures(email: string) {
  attempts.delete(email);
}

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (isLocked(email)) {
    return NextResponse.json(
      { error: "Too many failed attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  const { rows } = await getPool().query<AdminRow>(`SELECT * FROM admin_users WHERE email = $1`, [email]);
  const admin = rows[0];

  const ok = admin ? await bcrypt.compare(password, admin.password_hash) : false;
  if (!ok) {
    recordFailure(email);
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  clearFailures(email);
  const token = await createSessionToken(admin.id, admin.email);
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ ok: true });
}
