"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Login failed.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <Logo className="h-9 w-9" />
          <h1 className="font-display text-lg font-semibold text-ink-100">Royal Blue Horizon Admin</h1>
        </div>

        <form onSubmit={submit} className="glass glass-edge rounded-2xl p-6">
          <label className="block">
            <span className="text-sm font-medium text-ink-200">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-ink-100 focus:border-royal-300/50 focus:outline-none"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-medium text-ink-200">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-ink-100 focus:border-royal-300/50 focus:outline-none"
            />
          </label>

          {error && <p className="mt-3 text-sm text-signal-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gold-400 py-3 text-sm font-semibold text-royal-950 hover:bg-gold-300 disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
