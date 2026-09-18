"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useStore } from "@/app/lib/store-context";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Wanita", href: "/kategori/wanita" },
  { label: "Pria", href: "/kategori/pria" },
  { label: "Anak", href: "/kategori/anak" },
  { label: "Keluarga", href: "/kategori/keluarga" },
  { label: "Hijab", href: "/kategori/hijab" },
  { label: "Mukena", href: "/kategori/mukena" },
  { label: "Promo", href: "/promo" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount, wishlist } = useStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/katalog?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* ─── Top Bar ───────────────────────────────── */}
      <div className="bg-emerald-dark text-white text-sm py-2 text-center">
        <span className="font-medium">✨ Gratis Ongkir min. belanja Rp200.000</span>
        <span className="mx-3">|</span>
        <span>Chat CS: <a href="https://wa.me/6281234567890" className="underline font-bold">0812-3456-7890</a></span>
      </div>

      {/* ─── Main Header ───────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-dark rounded-full flex items-center justify-center">
                <span className="text-gold font-bold text-lg font-serif">N</span>
              </div>
              <div>
                <h1 className="text-emerald-dark font-serif font-bold text-xl leading-none">
                  NAQI WEAR
                </h1>
                <p className="text-[10px] text-gray-400 tracking-widest">FASHION MUSLIM</p>
              </div>
            </div>
          </Link>

          {/* Search (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-auto"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari hijab, gamis, mukena, baju koko..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full text-sm focus:border-emerald-dark focus:outline-none transition-colors bg-gray-50"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            <Link
              href="/wishlist"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-6 h-6 text-gray-600" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0 -right-0 bg-gold text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href="/keranjang"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Keranjang"
            >
              <ShoppingCart className="w-6 h-6 text-gray-600" />
              {cartCount() > 0 && (
                <span className="absolute -top-0 -right-0 bg-emerald-dark text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount()}
                </span>
              )}
            </Link>

            <Link
              href="/akun"
              className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Akun Saya"
            >
              <User className="w-6 h-6 text-gray-600" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-emerald-dark hover:bg-emerald-dark/5 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white animate-slide-in-bottom">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="p-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full text-sm focus:border-emerald-dark focus:outline-none"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </form>
            <nav className="px-4 pb-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-emerald-dark/5 hover:text-emerald-dark rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/akun"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-emerald-dark/5 hover:text-emerald-dark rounded-lg transition-colors flex items-center gap-2"
              >
                <User className="w-5 h-5" /> Akun Saya
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
