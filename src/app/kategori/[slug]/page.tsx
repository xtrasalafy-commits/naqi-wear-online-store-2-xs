"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/app/components/ProductCard";
import { ProductGridSkeleton } from "@/app/components/LoadingSkeleton";

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

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState(slug);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?category=${slug}&limit=50`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
          if (data.data.length > 0 && data.data[0].categoryName) {
            setCategoryName(data.data[0].categoryName);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-dark">Beranda</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium capitalize">{categoryName}</span>
      </nav>

      <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2 capitalize">
        {categoryName}
      </h1>
      <p className="text-gray-500 mb-8">
        {loading ? "Memuat produk..." : `${products.length} produk ditemukan`}
      </p>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <p className="text-5xl mb-4">🛍️</p>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Belum ada produk di kategori ini
          </h3>
          <Link
            href="/katalog"
            className="text-emerald-dark underline text-sm"
          >
            Lihat Semua Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
