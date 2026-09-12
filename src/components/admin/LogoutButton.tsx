"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-ink-300 hover:bg-white/5 hover:text-ink-100"
    >
      <LogOut className="h-4 w-4" />
      Log out
    </button>
  );
}
