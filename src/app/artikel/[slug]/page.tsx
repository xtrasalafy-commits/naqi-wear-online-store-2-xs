"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronRight, Calendar, User, ArrowLeft } from "lucide-react";
import { formatDate } from "@/app/lib/utils";

interface Article {
  id: number;
  judul: string;
  slug: string;
  ringkasan: string | null;
  konten: string | null;
  gambarUrl: string | null;
  penulis: string | null;
  createdAt: string;
}

export default function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const found = d.data.find((a: Article) => a.slug === slug);
          setArticle(found || null);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-8 skeleton h-96" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">📄</p>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Artikel tidak ditemukan</h2>
        <Link href="/artikel" className="text-emerald-dark underline">
          Kembali ke Daftar Artikel
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-dark">Beranda</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/artikel" className="hover:text-emerald-dark">Artikel</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium truncate">{article.judul}</span>
      </nav>

      <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Hero */}
        <div className="aspect-video bg-gradient-to-br from-emerald-dark/10 to-gold/10 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl">📖</span>
          </div>
        </div>

        <div className="p-6 md:p-10">
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(article.createdAt)}
            </div>
            {article.penulis && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {article.penulis}
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-6">
            {article.judul}
          </h1>

          {/* Summary */}
          {article.ringkasan && (
            <p className="text-lg text-gray-600 mb-6 font-medium leading-relaxed italic border-l-4 border-gold pl-4">
              {article.ringkasan}
            </p>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {article.konten?.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Back */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <Link
              href="/artikel"
              className="inline-flex items-center gap-2 text-emerald-dark font-medium hover:underline"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Daftar Artikel
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
