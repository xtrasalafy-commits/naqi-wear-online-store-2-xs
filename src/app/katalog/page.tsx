"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronRight, SlidersHorizontal, X } from "lucide-react";
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

interface Category {
  id: number;
  nama: string;
  slug: string;
}

const SORT_OPTIONS = [
  { value: "terbaru", label: "Terbaru" },
  { value: "terlaris", label: "Terlaris" },
  { value: "harga_asc", label: "Harga: Rendah ke Tinggi" },
  { value: "harga_desc", label: "Harga: Tinggi ke Rendah" },
  { value: "rating", label: "Rating Tertinggi" },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("terbaru");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [gender, setGender] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set("category", selectedCategory);
      if (searchQuery) params.set("search", searchQuery);
      if (sortBy) params.set("sort", sortBy);
      if (minPrice) params.set("min_price", minPrice);
      if (maxPrice) params.set("max_price", maxPrice);
      if (gender) params.set("gender", gender);
      params.set("limit", "50");

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, sortBy, minPrice, maxPrice, gender]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCategories(d.data);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setSortBy("terbaru");
    setMinPrice("");
    setMaxPrice("");
    setGender("");
  };

  const parentCategories = categories.filter((c) => !c.slug.includes("-"));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-dark">Beranda</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">Katalog Produk</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ─── Sidebar Filters (Desktop) ─────────── */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-28">
            <h3 className="font-serif font-bold text-lg text-gray-800 mb-4">Filter</h3>

            {/* Category */}
            <div className="mb-6">
              <h4 className="font-medium text-sm text-gray-700 mb-3">Kategori</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !selectedCategory ? "bg-emerald-dark text-white" : "hover:bg-gray-50"
                  }`}
                >
                  Semua
                </button>
                {parentCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat.slug
                        ? "bg-emerald-dark text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {cat.nama}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <h4 className="font-medium text-sm text-gray-700 mb-3">Harga</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-dark"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-dark"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="mb-6">
              <h4 className="font-medium text-sm text-gray-700 mb-3">Untuk</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "", label: "Semua" },
                  { value: "wanita", label: "Wanita" },
                  { value: "pria", label: "Pria" },
                  { value: "anak", label: "Anak" },
                  { value: "keluarga", label: "Keluarga" },
                ].map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGender(g.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      gender === g.value
                        ? "bg-emerald-dark text-white border-emerald-dark"
                        : "border-gray-200 hover:border-emerald-dark"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="w-full py-2 text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Hapus Semua Filter
            </button>
          </div>
        </aside>

        {/* ─── Main Content ──────────────────────── */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-800">Katalog Produk</h1>
              {searchQuery && (
                <p className="text-sm text-gray-500 mt-1">
                  Hasil pencarian untuk &ldquo;{searchQuery}&rdquo;
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filter
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-dark cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden bg-white rounded-2xl shadow-sm p-6 mb-6 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Filter</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    !selectedCategory
                      ? "bg-emerald-dark text-white border-emerald-dark"
                      : "border-gray-200"
                  }`}
                >
                  Semua
                </button>
                {parentCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      selectedCategory === cat.slug
                        ? "bg-emerald-dark text-white border-emerald-dark"
                        : "border-gray-200"
                    }`}
                  >
                    {cat.nama}
                  </button>
                ))}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 font-medium"
              >
                Hapus Filter
              </button>
            </div>
          )}

          {/* Results Count */}
          <p className="text-sm text-gray-500 mb-4">
            Menampilkan {products.length} produk
          </p>

          {/* Product Grid */}
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <p className="text-5xl mb-4">🛍️</p>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Belum ada produk ditemukan
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-emerald-dark text-white rounded-full text-sm font-medium hover:bg-emerald-dark/90"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-6"><ProductGridSkeleton count={8} /></div>}>
      <CatalogContent />
    </Suspense>
  );
}
