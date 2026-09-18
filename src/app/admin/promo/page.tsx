"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { formatRupiah, formatDate } from "@/app/lib/utils";

interface Coupon {
  id: number;
  kode: string;
  tipe: string;
  nilai: number;
  minimalOrder: number | null;
  kuota: number | null;
  terpakai: number | null;
  aktif: boolean | null;
}

export default function AdminPromoPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/coupons")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCoupons(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-800">Manajemen Promo & Voucher</h1>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-dark text-white font-bold rounded-xl hover:bg-emerald-dark/90 transition-colors text-sm">
          <Plus className="w-5 h-5" /> Tambah Voucher
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-6 skeleton h-64" />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Kode</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Tipe</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-500">Nilai</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-500">Min. Order</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-500">Terpakai</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-500">Status</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-emerald-dark tracking-wider">{c.kode}</p>
                    </td>
                    <td className="py-4 px-6 text-gray-600 capitalize">
                      {c.tipe === "persen" ? "Persentase" : c.tipe === "gratis_ongkir" ? "Gratis Ongkir" : "Potongan"}
                    </td>
                    <td className="py-4 px-6 text-right font-medium">
                      {c.tipe === "persen" ? `${c.nilai}%` : formatRupiah(c.nilai)}
                    </td>
                    <td className="py-4 px-6 text-right text-gray-500">
                      {c.minimalOrder ? formatRupiah(c.minimalOrder) : "-"}
                    </td>
                    <td className="py-4 px-6 text-center text-gray-500">
                      {c.terpakai || 0} / {c.kuota || "-"}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          c.aktif ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {c.aktif ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
