"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Eye, Trash2 } from "lucide-react";
import { formatRupiah } from "@/app/lib/utils";

interface Product {
  id: number;
  nama: string;
  slug: string;
  hargaDasar: number;
  hargaDiskon: number | null;
  status: string;
  unggulan: boolean | null;
  terlaris: boolean | null;
  rating: string | null;
  jumlahUlasan: number | null;
  categoryName: string | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=100")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setProducts(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-800">Manajemen Produk</h1>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-dark text-white font-bold rounded-xl hover:bg-emerald-dark/90 transition-colors text-sm">
          <Plus className="w-5 h-5" /> Tambah Produk
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
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Produk</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Kategori</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-500">Harga</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-500">Diskon</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-500">Rating</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-500">Status</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-dark/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-dark font-bold text-xs">
                            {p.nama.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{p.nama}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {p.unggulan && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-dark/10 text-emerald-dark rounded">
                                Unggulan
                              </span>
                            )}
                            {p.terlaris && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-gold/10 text-gold rounded">
                                Terlaris
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-500">{p.categoryName || "-"}</td>
                    <td className="py-4 px-6 text-right font-medium">
                      {formatRupiah(p.hargaDasar)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {p.hargaDiskon ? (
                        <span className="text-red-500 font-medium">{formatRupiah(p.hargaDiskon)}</span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-gold font-medium">⭐ {p.rating}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          p.status === "aktif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.status === "aktif" ? "Aktif" : "Nonaktif"}
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
