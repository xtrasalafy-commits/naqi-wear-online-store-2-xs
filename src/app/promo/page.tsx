"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Copy, Check } from "lucide-react";
import { useStore } from "@/app/lib/store-context";
import { formatRupiah } from "@/app/lib/utils";

interface Coupon {
  id: number;
  kode: string;
  tipe: string;
  nilai: number;
  minimalOrder: number | null;
  maksimalDiskon: number | null;
  kuota: number | null;
  terpakai: number | null;
}

export default function PromoPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { addToast } = useStore();

  useEffect(() => {
    fetch("/api/coupons")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCoupons(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(`Kode "${code}" berhasil disalin!`, "success");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-dark">Beranda</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">Promo & Voucher</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-3">
          🎉 Promo & Voucher Aktif
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Gunakan kode voucher di bawah saat checkout untuk mendapatkan diskon spesial!
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl skeleton h-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border-2 border-dashed border-gold/30"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-bold rounded-full">
                    {coupon.tipe === "persen"
                      ? `Diskon ${coupon.nilai}%`
                      : coupon.tipe === "gratis_ongkir"
                      ? "GRATIS ONGKIR"
                      : `Potongan ${formatRupiah(coupon.nilai)}`}
                  </span>
                  <span className="text-xs text-gray-400">
                    {coupon.kuota && coupon.terpakai
                      ? `${coupon.kuota - coupon.terpakai} kuota tersisa`
                      : ""}
                  </span>
                </div>

                <div className="bg-cream rounded-xl p-4 text-center mb-4">
                  <p className="text-xs text-gray-500 mb-1">Kode Voucher</p>
                  <p className="text-2xl font-bold text-emerald-dark tracking-widest">
                    {coupon.kode}
                  </p>
                </div>

                <ul className="text-xs text-gray-500 space-y-1 mb-4">
                  {coupon.minimalOrder && coupon.minimalOrder > 0 && (
                    <li>• Minimal belanja {formatRupiah(coupon.minimalOrder)}</li>
                  )}
                  {coupon.maksimalDiskon && (
                    <li>• Maksimal diskon {formatRupiah(coupon.maksimalDiskon)}</li>
                  )}
                  <li>• Berlaku untuk semua produk</li>
                </ul>

                <button
                  onClick={() => copyCode(coupon.kode)}
                  className="w-full py-3 bg-emerald-dark text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-dark/90 transition-colors"
                >
                  {copiedCode === coupon.kode ? (
                    <>
                      <Check className="w-5 h-5" /> Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" /> Salin Kode
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-10 text-sm text-gray-400">
        <p>Voucher hanya berlaku untuk satu kali penggunaan per akun.</p>
        <p>Hubungi admin jika ada kendala: <a href="https://wa.me/6281234567890" className="text-emerald-dark underline">0812-3456-7890</a></p>
      </div>
    </div>
  );
}
