"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, BookOpen, Calendar } from "lucide-react";
import { formatDate } from "@/app/lib/utils";

interface Article {
  id: number;
  judul: string;
  slug: string;
  ringkasan: string | null;
  gambarUrl: string | null;
  penulis: string | null;
  createdAt: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setArticles(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-dark">Beranda</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">Artikel Islami</span>
      </nav>

      <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Artikel & Tips Islami</h1>
      <p className="text-gray-500 mb-10">Informasi bermanfaat seputar fashion muslim</p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden skeleton h-72" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Belum ada artikel</h3>
          <p className="text-gray-500 text-sm">Artikel akan segera tersedia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="aspect-video bg-gradient-to-br from-emerald-dark/10 to-gold/10 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-emerald-dark/30" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(article.createdAt)}</span>
                  {article.penulis && (
                    <>
                      <span>•</span>
                      <span>{article.penulis}</span>
                    </>
                  )}
                </div>
                <h3 className="font-bold text-gray-800 group-hover:text-emerald-dark transition-colors mb-2">
                  {article.judul}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{article.ringkasan}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
