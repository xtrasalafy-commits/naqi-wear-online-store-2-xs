"use client";

import { Download, TrendingUp, BarChart3 } from "lucide-react";
import { formatRupiah } from "@/app/lib/utils";

export default function AdminReportsPage() {
  const monthlyData = [
    { bulan: "Januari", penjualan: 4500000, pesanan: 23 },
    { bulan: "Februari", penjualan: 3800000, pesanan: 19 },
    { bulan: "Maret", penjualan: 5200000, pesanan: 31 },
    { bulan: "April", penjualan: 7800000, pesanan: 45 },
    { bulan: "Mei", penjualan: 6100000, pesanan: 35 },
  ];

  const topProducts = [
    { nama: "Bergo NADIRA instant", terjual: 89, pendapatan: 6141000 },
    { nama: "Gamis SYAKIRA Premium", terjual: 67, pendapatan: 16683000 },
    { nama: "Mukena PRINCESS Royal", terjual: 45, pendapatan: 11205000 },
    { nama: "Sarimbit KELUARGA KAHALA", terjual: 32, pendapatan: 15968000 },
    { nama: "Pashmina ZAHRA Premium", terjual: 78, pendapatan: 4602000 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-800">Laporan Penjualan</h1>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-dark text-white font-bold rounded-xl hover:bg-emerald-dark/90 transition-colors text-sm">
          <Download className="w-5 h-5" /> Ekspor CSV
        </button>
      </div>

      {/* Monthly Sales */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-serif font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-dark" />
          Penjualan Bulanan
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 font-medium text-gray-500">Bulan</th>
                <th className="text-right py-3 font-medium text-gray-500">Jumlah Pesanan</th>
                <th className="text-right py-3 font-medium text-gray-500">Total Penjualan</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((m) => (
                <tr key={m.bulan} className="border-b border-gray-50">
                  <td className="py-3 font-medium text-gray-800">{m.bulan}</td>
                  <td className="py-3 text-right">{m.pesanan} pesanan</td>
                  <td className="py-3 text-right font-bold text-emerald-dark">
                    {formatRupiah(m.penjualan)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-serif font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gold" />
          5 Produk Terlaris
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 font-medium text-gray-500">#</th>
                <th className="text-left py-3 font-medium text-gray-500">Produk</th>
                <th className="text-right py-3 font-medium text-gray-500">Terjual</th>
                <th className="text-right py-3 font-medium text-gray-500">Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={p.nama} className="border-b border-gray-50">
                  <td className="py-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0
                          ? "bg-gold text-white"
                          : i === 1
                          ? "bg-gray-300 text-white"
                          : i === 2
                          ? "bg-earth text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 font-medium text-gray-800">{p.nama}</td>
                  <td className="py-3 text-right">{p.terjual} pcs</td>
                  <td className="py-3 text-right font-bold text-gold">
                    {formatRupiah(p.pendapatan)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
