"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Package } from "lucide-react";
import { useStore } from "@/app/lib/store-context";
import { formatRupiah, formatDate, statusColor, statusLabel } from "@/app/lib/utils";

interface Order {
  id: number;
  nomorPesanan: string;
  subtotal: number;
  diskon: number;
  ongkir: number;
  total: number;
  kurir: string | null;
  resi: string | null;
  statusPembayaran: string | null;
  statusPesanan: string | null;
  catatan: string | null;
  createdAt: string;
}

const STATUS_TIMELINE = ["dibuat", "diverifikasi", "diproses", "dikirim", "selesai"];

export default function OrdersPage() {
  const { user } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetch(`/api/orders?user_id=${user.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setOrders(d.data);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-3">
          Silakan masuk untuk melihat pesanan
        </h2>
        <Link
          href="/akun"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-dark text-white font-bold rounded-xl hover:bg-emerald-dark/90 transition-colors"
        >
          Masuk ke Akun
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-dark">Beranda</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/akun" className="hover:text-emerald-dark">Akun</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">Pesanan Saya</span>
      </nav>

      <h1 className="text-2xl font-serif font-bold text-gray-800 mb-6">Pesanan Saya</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 skeleton h-32" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Belum ada pesanan</h3>
          <p className="text-gray-500 text-sm mb-6">Mulai belanja untuk membuat pesanan pertama!</p>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-dark text-white font-bold rounded-xl hover:bg-emerald-dark/90 transition-colors"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Order Header */}
              <button
                onClick={() =>
                  setExpandedOrder(expandedOrder === order.id ? null : order.id)
                }
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <p className="font-bold text-gray-800">{order.nomorPesanan}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(
                      order.statusPesanan || "dibuat"
                    )}`}
                  >
                    {statusLabel(order.statusPesanan || "dibuat")}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedOrder === order.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Order Detail */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-100 p-6 animate-fade-in">
                  {/* Timeline */}
                  <div className="flex items-center justify-between mb-6">
                    {STATUS_TIMELINE.map((status, i) => {
                      const currentIdx = STATUS_TIMELINE.indexOf(
                        order.statusPesanan || "dibuat"
                      );
                      const isActive = i <= currentIdx;
                      return (
                        <div key={status} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                              isActive
                                ? "bg-emerald-dark text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {i + 1}
                          </div>
                          <p
                            className={`text-[10px] text-center ${
                              isActive ? "text-emerald-dark font-medium" : "text-gray-400"
                            }`}
                          >
                            {statusLabel(status)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status Pembayaran</span>
                      <span
                        className={`font-medium ${
                          order.statusPembayaran === "lunas"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.statusPembayaran === "lunas" ? "Lunas" : "Menunggu Pembayaran"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Kurir</span>
                      <span className="font-medium">{order.kurir || "-"}</span>
                    </div>
                    {order.resi && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">No. Resi</span>
                        <span className="font-medium text-emerald-dark">{order.resi}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">{formatRupiah(order.subtotal)}</span>
                    </div>
                    {order.diskon > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Diskon</span>
                        <span className="font-medium text-green-600">
                          -{formatRupiah(order.diskon)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ongkir</span>
                      <span className="font-medium">{formatRupiah(order.ongkir)}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 flex justify-between">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="font-bold text-gold text-lg">
                        {formatRupiah(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
