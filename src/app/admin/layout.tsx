"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Image,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/app/lib/utils";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Produk", href: "/admin/produk", icon: Package },
  { label: "Pesanan", href: "/admin/pesanan", icon: ShoppingCart },
  { label: "Pelanggan", href: "/admin/pelanggan", icon: Users },
  { label: "Promo/Voucher", href: "/admin/promo", icon: Tag },
  { label: "Banner", href: "/admin/banner", icon: Image },
  { label: "Konten", href: "/admin/konten", icon: FileText },
  { label: "Laporan", href: "/admin/laporan", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ─── Sidebar ─────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-emerald-dark text-white flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
              <span className="text-emerald-dark font-bold text-lg font-serif">N</span>
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg leading-none">NAQI WEAR</h2>
              <p className="text-[10px] text-white/50 tracking-widest">ADMIN PANEL</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-colors",
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors px-4 py-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Lihat Toko
          </Link>
        </div>
      </aside>

      {/* ─── Main Content ────────────────────────── */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Top Bar */}
        <div className="lg:hidden bg-emerald-dark text-white p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
            <span className="text-emerald-dark font-bold text-sm font-serif">N</span>
          </div>
          <span className="font-serif font-bold">Admin Panel</span>
          <Link href="/" className="ml-auto text-xs text-white/70 hover:text-white">
            Lihat Toko →
          </Link>
        </div>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
