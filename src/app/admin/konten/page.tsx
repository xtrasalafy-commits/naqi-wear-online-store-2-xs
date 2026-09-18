"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { formatDate } from "@/app/lib/utils";

interface Article {
  id: number;
  judul: string;
  slug: string;
  penulis: string | null;
  status: string | null;
  createdAt: string;
}

export default function AdminContentPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"artikel" | "faq" | "syarat">("artikel");

  useEffect(() => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setArticles(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-800">Manajemen Konten</h1>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-dark text-white font-bold rounded-xl hover:bg-emerald-dark/90 transition-colors text-sm">
          <Plus className="w-5 h-5" /> Tambah Konten
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["artikel", "faq", "syarat"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              activeTab === tab
                ? "bg-emerald-dark text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab === "artikel" ? "Artikel" : tab === "faq" ? "FAQ" : "Syarat & Ketentuan"}
          </button>
        ))}
      </div>

      {activeTab === "artikel" && (
        loading ? (
          <div className="bg-white rounded-2xl p-6 skeleton h-64" />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-4 px-6 font-medium text-gray-500">Judul</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-500">Penulis</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-500">Tanggal</th>
                    <th className="text-center py-4 px-6 font-medium text-gray-500">Status</th>
                    <th className="text-center py-4 px-6 font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-dark/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-emerald-dark" />
                          </div>
                          <p className="font-medium text-gray-800">{a.judul}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-500">{a.penulis || "-"}</td>
                      <td className="py-4 px-6 text-gray-500 text-xs">{formatDate(a.createdAt)}</td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            a.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {a.status === "published" ? "Diterbitkan" : "Draft"}
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
        )
      )}

      {activeTab === "faq" && (
        <div className="bg-white rounded-2xl p-10 text-center">
          <p className="text-gray-400">Halaman FAQ akan segera tersedia.</p>
        </div>
      )}

      {activeTab === "syarat" && (
        <div className="bg-white rounded-2xl p-10 text-center">
          <p className="text-gray-400">Editor Syarat & Ketentuan akan segera tersedia.</p>
        </div>
      )}
    </div>
  );
}
