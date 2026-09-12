import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import Logo from "@/components/Logo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ink text-ink-100">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="font-display text-sm font-semibold">Royal Blue Horizon Admin</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-ink-300 sm:flex">
            <Link href="/admin/shipments" className="hover:text-ink-100">Shipments</Link>
            <Link href="/admin/bookings" className="hover:text-ink-100">Bookings</Link>
          </nav>
        </div>
        <LogoutButton />
      </header>
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
