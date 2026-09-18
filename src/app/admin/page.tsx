"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
} from "lucide-react";
import { formatRupiah, formatDate, statusColor, statusLabel } from "@/app/lib/utils";

interface Stats {
  penjualanHariIni: number;
  pesananBaru: number;
  pelangganBaru: number;
  produkTerjual: number;
  totalProduk: number;
  recentOrders: {
    id: number;
    nomorPesanan: string;
    total: number;
    statusPesanan: string | null;
    createdAt: string;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStats(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 skeleton h-32" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Penjualan Hari Ini",
      value: formatRupiah(stats?.penjualanHariIni || 0),
      icon: TrendingUp,
      color: "bg-emerald-dark",
    },
    {
      title: "Pesanan Baru",
      value: stats?.pesananBaru?.toString() || "0",
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Pelanggan Baru",
      value: stats?.pelangganBaru?.toString() || "0",
      icon: Users,
      color: "bg-gold",
    },
    {
      title: "Produk Terjual",
      value: `${stats?.produkTerjual || 0} pcs`,
      icon: Package,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-800 mb-6">
        Dashboard Admin
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.title} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}
              >
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">{card.title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="font-serif font-bold text-lg text-gray-800 mb-4">
          Grafik Penjualan 7 Hari
        </h2>
        <div className="h-64 bg-gradient-to-br from-emerald-dark/5 to-gold/5 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-emerald-dark/30 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Grafik penjualan mingguan</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-serif font-bold text-lg text-gray-800 mb-4">
          5 Pesanan Terbaru
        </h2>
        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 font-medium text-gray-500">Nomor Pesanan</th>
                  <th className="text-left py-3 font-medium text-gray-500">Tanggal</th>
                  <th className="text-right py-3 font-medium text-gray-500">Total</th>
                  <th className="text-right py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-800">{order.nomorPesanan}</td>
                    <td className="py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="py-3 text-right font-medium">{formatRupiah(order.total)}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(
                          order.statusPesanan || "dibuat"
                        )}`}
                      >
                        {statusLabel(order.statusPesanan || "dibuat")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">Belum ada pesanan</p>
        )}
      </div>
    </div>
  );
}
