"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { formatRupiah, formatDate, statusColor, statusLabel } from "@/app/lib/utils";
import { useStore } from "@/app/lib/store-context";

interface AdminOrder {
  id: number;
  nomorPesanan: string;
  userId: number;
  namaUser: string | null;
  total: number;
  statusPembayaran: string | null;
  statusPesanan: string | null;
  createdAt: string;
}

const STATUS_OPTIONS = [
  "dibuat",
  "diverifikasi",
  "diproses",
  "dikemas",
  "dikirim",
  "selesai",
  "dibatalkan",
];

export default function AdminOrdersPage() {
  const { addToast } = useStore();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async (status?: string) => {
    setLoading(true);
    try {
      const params = status ? `?status=${status}` : "";
      const res = await fetch(`/api/admin/orders${params}`);
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(filterStatus);
  }, [filterStatus]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, statusPesanan: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Status pesanan diubah ke "${statusLabel(newStatus)}"`, "success");
        fetchOrders(filterStatus);
      } else {
        addToast(data.message || "Gagal mengubah status", "error");
      }
    } catch {
      addToast("Gagal mengubah status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-800 mb-6">Manajemen Pesanan</h1>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-dark cursor-pointer"
          >
            <option value="">Semua Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-6 skeleton h-64" />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center">
          <p className="text-gray-400">Tidak ada pesanan ditemukan</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Nomor Pesanan</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Pelanggan</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-500">Total</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-500">Pembayaran</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-500">Status</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-500">Tanggal</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-800">{order.nomorPesanan}</p>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{order.namaUser || "N/A"}</td>
                    <td className="py-4 px-6 text-right font-bold">{formatRupiah(order.total)}</td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.statusPembayaran === "lunas"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.statusPembayaran === "lunas" ? "Lunas" : "Belum Bayar"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(
                          order.statusPesanan || "dibuat"
                        )}`}
                      >
                        {statusLabel(order.statusPesanan || "dibuat")}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-gray-500 text-xs">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <select
                        value={order.statusPesanan || "dibuat"}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-dark disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {statusLabel(s)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
