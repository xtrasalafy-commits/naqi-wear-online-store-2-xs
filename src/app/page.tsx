"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Truck,
  Shield,
  CreditCard,
  Star,
  ChevronRight,
  ArrowRight,
  Shirt,
  BookOpen,
} from "lucide-react";
import ProductCard from "@/app/components/ProductCard";
import { ProductGridSkeleton, BannerSkeleton, CategorySkeleton } from "@/app/components/LoadingSkeleton";

/* ═══════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════ */
interface Category {
  id: number;
  nama: string;
  slug: string;
  gambarUrl: string | null;
}

interface Product {
  id: number;
  nama: string;
  slug: string;
  hargaDasar: number;
  hargaDiskon: number | null;
  rating: string | null;
  jumlahUlasan: number | null;
  unggulan: boolean | null;
  terlaris: boolean | null;
}

interface Article {
  id: number;
  judul: string;
  slug: string;
  ringkasan: string | null;
  gambarUrl: string | null;
}

interface Review {
  id: number;
  judul: string | null;
  komentar: string | null;
  rating: number;
  namaUser: string | null;
}

/* ═══════════════════════════════════════════════════════════
   Home Page
   ═══════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, bsRes, npRes, artRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products?terlaris=true&limit=4"),
          fetch("/api/products?sort=terbaru&limit=4"),
          fetch("/api/articles"),
        ]);

        const catData = await catRes.json();
        const bsData = await bsRes.json();
        const npData = await npRes.json();
        const artData = await artRes.json();

        if (catData.success) setCategories(catData.data);
        if (bsData.success) setBestSellers(bsData.data);
        if (npData.success) setNewProducts(npData.data);
        if (artData.success) setArticles(artData.data);

        // Get some reviews
        if (bsData.success && bsData.data.length > 0) {
          const revRes = await fetch(`/api/reviews?product_id=${bsData.data[0].id}`);
          const revData = await revRes.json();
          if (revData.success) setReviews(revData.data);
        }
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const popularCategories = [
    { nama: "Hijab", slug: "hijab", icon: "🧕" },
    { nama: "Gamis", slug: "gamis", icon: "👗" },
    { nama: "Mukena", slug: "mukena", icon: "🕌" },
    { nama: "Baju Koko", slug: "baju-koko", icon: "👔" },
    { nama: "Anak", slug: "anak", icon: "👶" },
    { nama: "Sarimbit", slug: "sarimbit", icon: "👨‍👩‍👧‍👦" },
  ];

  const testimonials = reviews.length > 0
    ? reviews.slice(0, 3)
    : [
        { id: 1, judul: "Gamisnya bagus banget!", komentar: "Bahannya adem, jatuh, dan tidak menerawang. Warnanya sama seperti di foto. Suka banget! Pasti bakal repeat order.", rating: 5, namaUser: "Siti Rahmawati" },
        { id: 2, judul: "Mukena premium worth it", komentar: "Bordirannya mewah banget. Kainnya jatuh dan nggak menerawang. Recommended banget buat hadiah!", rating: 5, namaUser: "Fatimah Azzahra" },
        { id: 3, judul: "Sarimbit keluarga kompak!", komentar: "Lebaran tahun ini pakai sarimbit dari NAQI WEAR. Bahan nyaman, harga terjangkau. Keluarga happy semua.", rating: 5, namaUser: "Ahmad Fauzi" },
      ];

  return (
    <div>
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative bg-gradient-to-br from-emerald-dark via-emerald-dark to-earth overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-gold/20 text-gold text-sm font-medium rounded-full mb-6">
              ✨ Koleksi Terbaru 2025
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-6">
              Tampil Syar&apos;i, Nyaman, dan Elegan Setiap Hari
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-lg">
              Koleksi fashion muslim premium untuk wanita, pria, anak, dan keluarga.
              Bahan berkualitas, desain modern, harga terjangkau.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/katalog"
                className="px-8 py-4 bg-gold text-white font-bold rounded-full hover:bg-gold-light transition-colors text-base flex items-center gap-2"
              >
                Belanja Sekarang <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/kategori/hijab"
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors text-base border border-white/20"
              >
                Lihat Koleksi Ramadhan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORY MENU ═══ */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="flex items-center gap-2 px-5 py-3 bg-cream rounded-xl hover:bg-emerald-dark hover:text-white transition-all text-sm font-medium whitespace-nowrap"
              >
                {cat.nama}
                <ChevronRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ POPULAR CATEGORIES ═══ */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">
              Kategori Populer
            </h2>
            <p className="text-gray-500 mt-1">Temukan koleksi favorit Anda</p>
          </div>
          <Link
            href="/katalog"
            className="text-emerald-dark font-medium text-sm flex items-center gap-1 hover:underline"
          >
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <CategorySkeleton />
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            {popularCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-dark transition-colors">
                  {cat.nama}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ═══ BEST SELLERS ═══ */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">
              Produk Terlaris 🔥
            </h2>
            <p className="text-gray-500 mt-1">Pilihan paling disukai pelanggan</p>
          </div>
          <Link
            href="/katalog?sort=terlaris"
            className="text-emerald-dark font-medium text-sm flex items-center gap-1 hover:underline"
          >
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ═══ PROMO BANNER ═══ */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative bg-gradient-to-r from-gold to-gold-light rounded-2xl overflow-hidden p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 bg-emerald-dark text-white text-xs font-bold rounded-full mb-3">
                PROMO SPESIAL
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-emerald-dark mb-2">
                Diskon Hingga 50%!
              </h2>
              <p className="text-emerald-dark/70 max-w-md">
                Berlaku untuk koleksi hijab, gamis, dan mukena pilihan. Jangan sampai kehabisan!
              </p>
            </div>
            <Link
              href="/promo"
              className="px-8 py-4 bg-emerald-dark text-white font-bold rounded-full hover:bg-emerald-dark/90 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              Lihat Promo <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ NEW ARRIVALS ═══ */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">
              Produk Terbaru ✨
            </h2>
            <p className="text-gray-500 mt-1">Koleksi terbaru yang fresh</p>
          </div>
          <Link
            href="/katalog?sort=terbaru"
            className="text-emerald-dark font-medium text-sm flex items-center gap-1 hover:underline"
          >
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ═══ ADVANTAGES ═══ */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">
            Kenapa Pilih NAQI WEAR?
          </h2>
          <p className="text-gray-500 mt-2">Kenyamanan dan kepuasan Anda adalah prioritas kami</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { icon: "🧵", title: "Bahan Berkualitas", desc: "Pilihan bahan premium yang adem & nyaman" },
            { icon: "📐", title: "Ukuran Lengkap", desc: "S hingga XXL, Jumbo juga ada" },
            { icon: "📦", title: "Pengiriman Aman", desc: "Dikemas rapi & dijamin sampai" },
            { icon: "💳", title: "Pembayaran Mudah", desc: "Transfer, QRIS, COD, E-Wallet" },
            { icon: "🫣", title: "Tidak Menerawang", desc: "Jaminan busana tertutup sopan" },
          ].map((adv) => (
            <div
              key={adv.title}
              className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-4xl block mb-3">{adv.icon}</span>
              <h3 className="font-bold text-gray-800 text-sm">{adv.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{adv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">
            Kata Mereka tentang NAQI WEAR
          </h2>
          <p className="text-gray-500 mt-2">Testimoni nyata dari pelanggan setia</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < t.rating ? "fill-gold text-gold" : "text-gray-300"}`}
                  />
                ))}
              </div>
              {t.judul && (
                <h4 className="font-bold text-gray-800 mb-2">{t.judul}</h4>
              )}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                &ldquo;{t.komentar}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-dark/10 rounded-full flex items-center justify-center">
                  <span className="text-emerald-dark font-bold text-sm">
                    {t.namaUser?.charAt(0) || "P"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">{t.namaUser || "Pelanggan"}</p>
                  <p className="text-xs text-gray-400">Pembeli Terverifikasi ✓</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ARTICLES ═══ */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">
              Artikel & Tips Islami
            </h2>
            <p className="text-gray-500 mt-1">Informasi bermanfaat seputar fashion muslim</p>
          </div>
          <Link
            href="/artikel"
            className="text-emerald-dark font-medium text-sm flex items-center gap-1 hover:underline"
          >
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(articles.length > 0
            ? articles.slice(0, 3)
            : [
                { id: 1, judul: "Panduan Memilih Hijab yang Tepat", slug: "panduan-memilih-hijab", ringkasan: "Memilih hijab tidak hanya soal warna dan motif, tapi juga bahan dan potongan.", gambarUrl: null },
                { id: 2, judul: "Tips Memilih Ukuran Gamis yang Pas", slug: "tips-ukuran-gamis", ringkasan: "Tidak semua gamis ukuran L sama. Kenali ukuran yang tepat agar gamis terlihat sempurna.", gambarUrl: null },
                { id: 3, judul: "Inspirasi Sarimbit Lebaran", slug: "inspirasi-sarimbit-lebaran", ringkasan: "Rayakan Lebaran dengan tampil kompak bersama keluarga tercinta.", gambarUrl: null },
              ]
          ).map((article) => (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="aspect-video bg-gradient-to-br from-emerald-dark/10 to-gold/10 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-emerald-dark/30" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-800 group-hover:text-emerald-dark transition-colors mb-2">
                  {article.judul}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{article.ringkasan}</p>
                <span className="inline-flex items-center gap-1 text-emerald-dark text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                  Baca Selengkapnya <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
