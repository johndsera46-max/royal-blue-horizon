import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_SESSION_COOKIE } from "@/lib/auth";

// Real authorization check for every admin API route — the proxy redirect
// is UX only, this is what actually gates data access.
export async function requireAdmin(): Promise<{ sub: string; email: string } | null> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
