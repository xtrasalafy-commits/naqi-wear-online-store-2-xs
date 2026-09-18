"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Package, User } from "lucide-react";
import { cn } from "@/app/lib/utils";

const tabs = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Kategori", href: "/katalog", icon: Grid3X3 },
  { label: "Pesanan", href: "/akun/pesanan", icon: Package },
  { label: "Akun", href: "/akun", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-bottom">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors",
                isActive ? "text-emerald-dark" : "text-gray-400"
              )}
            >
              <tab.icon
                className={cn(
                  "w-6 h-6",
                  isActive && "text-emerald-dark"
                )}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
