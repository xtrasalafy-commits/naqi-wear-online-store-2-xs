"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Settings,
} from "lucide-react";
import { useStore } from "@/app/lib/store-context";
import { cn } from "@/app/lib/utils";

export default function AccountPage() {
  const { user, login, logout } = useStore();
  const [showLogin, setShowLogin] = useState(!user);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    nomorWa: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isRegister ? "register" : "login",
          ...formData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.data);
        setShowLogin(false);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  if (showLogin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl shadow-sm p-8 animate-scale-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gold font-bold text-2xl font-serif">N</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-800">
              {isRegister ? "Daftar Akun Baru" : "Masuk ke Akun"}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {isRegister
                ? "Buat akun untuk mulai berbelanja"
                : "Masuk untuk melanjutkan belanja"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Masukkan nama Anda"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-dark"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contoh@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-dark"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Masukkan password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-dark"
              />
            </div>
            {isRegister && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nomor WhatsApp</label>
                <input
                  type="tel"
                  value={formData.nomorWa}
                  onChange={(e) => setFormData({ ...formData, nomorWa: e.target.value })}
                  placeholder="08xxx"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-dark"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-dark text-white font-bold rounded-xl hover:bg-emerald-dark/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Memproses..." : isRegister ? "Daftar Sekarang" : "Masuk"}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-sm text-emerald-dark font-medium hover:underline"
            >
              {isRegister
                ? "Sudah punya akun? Masuk di sini"
                : "Belum punya akun? Daftar di sini"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: "Pesanan Saya", href: "/akun/pesanan", icon: Package },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Alamat Tersimpan", href: "/akun/alamat", icon: MapPin },
    { label: "Pengaturan Akun", href: "/akun/settings", icon: Settings },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-dark">Beranda</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">Akun Saya</span>
      </nav>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-dark/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-emerald-dark" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-serif font-bold text-gray-800">{user?.nama}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        {menuItems.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors",
              i < menuItems.length - 1 && "border-b border-gray-50"
            )}
          >
            <item.icon className="w-5 h-5 text-emerald-dark" />
            <span className="flex-1 font-medium text-gray-800">{item.label}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        ))}
      </div>

      {/* Admin Link (if admin) */}
      {user?.role === "admin" && (
        <Link
          href="/admin"
          className="block bg-gold/10 border border-gold/20 rounded-2xl p-6 mb-6 hover:bg-gold/20 transition-colors"
        >
          <p className="font-bold text-gray-800">🔧 Dashboard Admin</p>
          <p className="text-sm text-gray-500">Kelola produk, pesanan, dan pengaturan toko</p>
        </Link>
      )}

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          window.location.href = "/";
        }}
        className="w-full py-4 bg-white rounded-2xl shadow-sm text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Keluar dari Akun
      </button>
    </div>
  );
}
