"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Trash2, Minus, Plus, Tag, ArrowRight, ShoppingBag } from "lucide-react";
import { useStore } from "@/app/lib/store-context";
import { formatRupiah, cn } from "@/app/lib/utils";

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, cartSubtotal, cartCount, addToast } = useStore();
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherApplied, setVoucherApplied] = useState(false);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      addToast("Masukkan kode voucher", "error");
      return;
    }
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kode: voucherCode, totalBelanja: cartSubtotal() }),
      });
      const data = await res.json();
      if (data.success) {
        const coupon = data.data;
        let discount = 0;
        if (coupon.tipe === "persen") {
          discount = Math.round((cartSubtotal() * coupon.nilai) / 100);
          if (coupon.maksimalDiskon && discount > coupon.maksimalDiskon) {
            discount = coupon.maksimalDiskon;
          }
        }
        setVoucherDiscount(discount);
        setVoucherApplied(true);
        addToast(`Voucher ${coupon.kode} berhasil diterapkan!`, "success");
      } else {
        addToast(data.message, "error");
      }
    } catch {
      addToast("Gagal memeriksa voucher", "error");
    }
  };

  const estimatedShipping = 15000;
  const total = cartSubtotal() - voucherDiscount + estimatedShipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-3">
          Keranjang Belanja Kosong
        </h2>
        <p className="text-gray-500 mb-8">
          Yuk mulai belanja koleksi fashion muslim favorit Anda!
        </p>
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-dark text-white font-bold rounded-full hover:bg-emerald-dark/90 transition-colors"
        >
          Mulai Belanja <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-dark">Beranda</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">Keranjang Belanja</span>
      </nav>

      <h1 className="text-2xl font-serif font-bold text-gray-800 mb-6">
        Keranjang Belanja ({cartCount()} item)
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm p-4 md:p-6 flex flex-col sm:flex-row gap-4"
            >
              {/* Image */}
              <div className="w-full sm:w-28 h-32 bg-gradient-to-br from-emerald-dark/5 to-gold/5 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-dark/30 text-2xl font-serif font-bold">
                  {item.nama.charAt(0)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/produk/${item.nama.toLowerCase().replace(/\s+/g, "-")}`}
                      className="font-bold text-gray-800 hover:text-emerald-dark transition-colors"
                    >
                      {item.nama}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.warna} | {item.ukuran}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (item.variantId != null) {
                        removeFromCart(item.variantId);
                        addToast("Produk dihapus dari keranjang", "info");
                      }
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => item.variantId != null && updateCartQty(item.variantId, item.qty - 1)}
                      className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:border-emerald-dark transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold">{item.qty}</span>
                    <button
                      onClick={() => item.variantId != null && updateCartQty(item.variantId, item.qty + 1)}
                      className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:border-emerald-dark transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="font-bold text-gold text-lg">
                      {formatRupiah(item.harga * item.qty)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatRupiah(item.harga)} / pcs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Summary Sidebar ───────────────────── */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-28">
            <h3 className="font-serif font-bold text-lg text-gray-800 mb-6">
              Ringkasan Belanja
            </h3>

            {/* Voucher Input */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Tag className="w-4 h-4" /> Kode Voucher
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="Masukkan kode"
                  disabled={voucherApplied}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-dark disabled:bg-gray-50"
                />
                <button
                  onClick={handleApplyVoucher}
                  disabled={voucherApplied}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-bold transition-colors",
                    voucherApplied
                      ? "bg-green-100 text-green-700"
                      : "bg-emerald-dark text-white hover:bg-emerald-dark/90"
                  )}
                >
                  {voucherApplied ? "✓" : "Gunakan"}
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal ({cartCount()} item)</span>
                <span className="font-medium">{formatRupiah(cartSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimasi Ongkir</span>
                <span className="font-medium">{formatRupiah(estimatedShipping)}</span>
              </div>
              {voucherDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Diskon Voucher</span>
                  <span className="font-medium text-success">
                    -{formatRupiah(voucherDiscount)}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-xl text-gold">{formatRupiah(total)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full py-4 bg-gold text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gold-light transition-colors text-base"
            >
              Lanjut ke Checkout <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/katalog"
              className="w-full py-3 mt-3 text-emerald-dark font-medium text-sm flex items-center justify-center hover:underline"
            >
              ← Lanjut Belanja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
