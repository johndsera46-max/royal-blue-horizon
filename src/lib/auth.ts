import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "rbh_admin_session";
const SESSION_DURATION = "12h";

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(adminId: string, email: string): Promise<string> {
  return new SignJWT({ sub: adminId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<{ sub: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export const ADMIN_SESSION_COOKIE = COOKIE_NAME;
