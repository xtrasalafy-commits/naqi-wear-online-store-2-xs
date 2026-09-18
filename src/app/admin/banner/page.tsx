"use client";

import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminBannerPage() {
  const banners = [
    { id: 1, judul: "Koleksi Ramadan 2025", urutan: 1, aktif: true },
    { id: 2, judul: "Diskon Spesial hingga 50%", urutan: 2, aktif: true },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-800">Manajemen Banner</h1>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-dark text-white font-bold rounded-xl hover:bg-emerald-dark/90 transition-colors text-sm">
          <Plus className="w-5 h-5" /> Tambah Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-emerald-dark/10 to-gold/10 flex items-center justify-center">
              <p className="text-gray-400 text-sm">{b.judul}</p>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">{b.judul}</p>
                <p className="text-xs text-gray-500">Urutan: {b.urutan}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    b.aktif ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {b.aktif ? "Aktif" : "Nonaktif"}
                </span>
                <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
