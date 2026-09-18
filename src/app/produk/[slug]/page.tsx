"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Truck,
  Shield,
  Eye,
  Check,
} from "lucide-react";
import { useStore } from "@/app/lib/store-context";
import { formatRupiah, cn } from "@/app/lib/utils";
import { ProductGridSkeleton } from "@/app/components/LoadingSkeleton";
import ProductCard from "@/app/components/ProductCard";

interface ProductDetail {
  id: number;
  nama: string;
  slug: string;
  deskripsi: string | null;
  bahan: string | null;
  gender: string | null;
  hargaDasar: number;
  hargaDiskon: number | null;
  beratGram: number | null;
  unggulan: boolean | null;
  terlaris: boolean | null;
  rating: string | null;
  jumlahUlasan: number | null;
  categoryName: string | null;
  categorySlug: string | null;
  variants: {
    id: number;
    warna: string | null;
    ukuran: string | null;
    harga: number | null;
    stok: number | null;
  }[];
  images: {
    id: number;
    gambarUrl: string;
    altText: string | null;
  }[];
  reviews: {
    id: number;
    rating: number;
    judul: string | null;
    komentar: string | null;
    terverifikasi: boolean | null;
    createdAt: string | null;
    namaUser: string | null;
  }[];
  related: {
    id: number;
    nama: string;
    slug: string;
    hargaDasar: number;
    hargaDiskon: number | null;
    rating: string | null;
    jumlahUlasan: number | null;
    unggulan: boolean | null;
    terlaris: boolean | null;
  }[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { addToCart, toggleWishlist, wishlist, addToast } = useStore();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"deskripsi" | "ulasan">("deskripsi");
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
          // Set first available color
          const colors = [...new Set(data.data.variants.map((v: ProductDetail["variants"][0]) => v.warna))] as string[];
          if (colors.length > 0) setSelectedColor(colors[0]);
          const sizes = [...new Set(data.data.variants.map((v: ProductDetail["variants"][0]) => v.ukuran))] as string[];
          if (sizes.length > 0) setSelectedSize(sizes[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-2xl skeleton" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded skeleton w-3/4" />
            <div className="h-6 bg-gray-200 rounded skeleton w-1/4" />
            <div className="h-10 bg-gray-200 rounded skeleton w-1/3" />
            <div className="h-20 bg-gray-200 rounded skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">😔</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Produk tidak ditemukan</h2>
        <Link href="/katalog" className="text-emerald-dark underline">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const colors = [...new Set(product.variants.map((v) => v.warna))] as string[];
  const sizes = [...new Set(product.variants.map((v) => v.ukuran))] as string[];

  const selectedVariant = product.variants.find(
    (v) => v.warna === selectedColor && v.ukuran === selectedSize
  );

  const currentPrice = selectedVariant?.harga || product.hargaDiskon || product.hargaDasar;
  const isWishlisted = wishlist.includes(product.id);

  const diskonPercent =
    product.hargaDiskon && product.hargaDasar
      ? Math.round(((product.hargaDasar - product.hargaDiskon) / product.hargaDasar) * 100)
      : 0;

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stok === 0) {
      addToast("Pilih varian yang tersedia", "error");
      return;
    }
    addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      nama: product.nama,
      gambarUrl: product.images[0]?.gambarUrl || "",
      warna: selectedColor,
      ukuran: selectedSize,
      harga: selectedVariant.harga || currentPrice,
      qty,
      stok: selectedVariant.stok || 0,
    });
  };

  const handleBeliSekarang = () => {
    handleAddToCart();
    setTimeout(() => {
      window.location.href = "/keranjang";
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-emerald-dark">Beranda</Link>
        <ChevronRight className="w-4 h-4" />
        {product.categorySlug && (
          <>
            <Link href={`/kategori/${product.categorySlug}`} className="hover:text-emerald-dark">
              {product.categoryName}
            </Link>
            <ChevronRight className="w-4 h-4" />
          </>
        )}
        <span className="text-gray-800 font-medium">{product.nama}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* ─── Image Gallery ──────────────────────── */}
        <div>
          <div className="aspect-square bg-white rounded-2xl shadow-sm overflow-hidden mb-4 img-zoom">
            <div className="w-full h-full bg-gradient-to-br from-emerald-dark/5 to-gold/5 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto bg-emerald-dark/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-emerald-dark text-5xl font-serif font-bold">
                    {product.nama.charAt(0)}
                  </span>
                </div>
                <p className="text-gray-400">{product.nama}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Product Info ───────────────────────── */}
        <div>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {product.terlaris && (
              <span className="px-3 py-1 bg-gold text-white text-xs font-bold rounded-full">
                Best Seller 🔥
              </span>
            )}
            {diskonPercent > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                Hemat {diskonPercent}%
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-3">
            {product.nama}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-5 h-5",
                    i < Math.round(parseFloat(product.rating || "0"))
                      ? "fill-gold text-gold"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating} ({product.jumlahUlasan || 0} ulasan)
            </span>
          </div>

          {/* Price */}
          <div className="bg-cream rounded-xl p-4 mb-6">
            {product.hargaDiskon ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gold">
                  {formatRupiah(currentPrice)}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {formatRupiah(product.hargaDasar)}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gold">
                {formatRupiah(currentPrice)}
              </span>
            )}
          </div>

          {/* Syar'i Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["Tidak Menerawang", "Wudhu Friendly", "Busui Friendly", "Panjang Syar'i"].map(
              (badge) => (
                <span
                  key={badge}
                  className="px-3 py-1.5 bg-emerald-dark/5 text-emerald-dark text-xs font-medium rounded-full border border-emerald-dark/10"
                >
                  ✓ {badge}
                </span>
              )
            )}
          </div>

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 text-sm mb-3">
                Warna: <span className="font-bold">{selectedColor}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium border-2 transition-all",
                      selectedColor === color
                        ? "border-emerald-dark bg-emerald-dark text-white"
                        : "border-gray-200 hover:border-emerald-dark"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-700 text-sm">
                  Ukuran: <span className="font-bold">{selectedSize}</span>
                </h3>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="text-emerald-dark text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" /> Lihat Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const variant = product.variants.find(
                    (v) => v.warna === selectedColor && v.ukuran === size
                  );
                  const isOutOfStock = !variant || (variant.stok ?? 0) === 0;
                  return (
                    <button
                      key={size}
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock}
                      className={cn(
                        "w-14 h-14 rounded-xl text-sm font-bold border-2 transition-all",
                        selectedSize === size
                          ? "border-emerald-dark bg-emerald-dark text-white"
                          : isOutOfStock
                          ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                          : "border-gray-200 hover:border-emerald-dark"
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Status */}
          {selectedVariant && (
            <div className="mb-6">
              {(selectedVariant.stok ?? 0) > 0 ? (
                <span className="text-sm text-success font-medium">
                  ✓ Stok tersedia ({selectedVariant.stok} tersisa)
                </span>
              ) : (
                <span className="text-sm text-danger font-medium">✗ Stok habis</span>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 text-sm mb-3">Jumlah</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-emerald-dark transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-12 text-center font-bold text-lg">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-emerald-dark transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-4 bg-emerald-dark text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-dark/90 transition-colors text-base"
            >
              <ShoppingCart className="w-5 h-5" />
              Tambah ke Keranjang
            </button>
            <button
              onClick={handleBeliSekarang}
              className="flex-1 py-4 bg-gold text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gold-light transition-colors text-base"
            >
              <Zap className="w-5 h-5" />
              Beli Sekarang
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={cn(
                "w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all",
                isWishlisted
                  ? "border-red-500 bg-red-50 text-red-500"
                  : "border-gray-200 hover:border-red-300"
              )}
            >
              <span className="text-xl">{isWishlisted ? "❤️" : "🤍"}</span>
            </button>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-emerald-dark" />
              <div>
                <p className="text-sm font-medium text-gray-700">Pengiriman</p>
                <p className="text-xs text-gray-500">
                  Estimasi 2-4 hari kerja | Berat: {product.beratGram || 200}g
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-dark" />
              <div>
                <p className="text-sm font-medium text-gray-700">Garansi Retur</p>
                <p className="text-xs text-gray-500">Bisa retur dalam 7 hari jika ada cacat</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Tabs: Deskripsi & Ulasan ──────────── */}
      <div className="bg-white rounded-2xl shadow-sm mb-12">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("deskripsi")}
            className={cn(
              "px-6 py-4 text-sm font-bold transition-colors",
              activeTab === "deskripsi"
                ? "text-emerald-dark border-b-2 border-emerald-dark"
                : "text-gray-500 hover:text-gray-800"
            )}
          >
            Deskripsi Produk
          </button>
          <button
            onClick={() => setActiveTab("ulasan")}
            className={cn(
              "px-6 py-4 text-sm font-bold transition-colors",
              activeTab === "ulasan"
                ? "text-emerald-dark border-b-2 border-emerald-dark"
                : "text-gray-500 hover:text-gray-800"
            )}
          >
            Ulasan ({product.reviews.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === "deskripsi" ? (
            <div className="prose max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif font-bold text-lg text-gray-800 mb-3">Deskripsi</h3>
                  <p className="text-gray-600 leading-relaxed">{product.deskripsi}</p>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-gray-800 mb-3">Detail</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-500">Bahan</td>
                        <td className="py-2 font-medium">{product.bahan}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-500">Gender</td>
                        <td className="py-2 font-medium capitalize">{product.gender}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-500">Berat</td>
                        <td className="py-2 font-medium">{product.beratGram}g</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-500">Perawatan</td>
                        <td className="py-2 font-medium">Cuci dingin, jangan diperas, jemur teduh</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Rating Summary */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="text-center">
                  <span className="text-4xl font-bold text-gray-800">{product.rating}</span>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < Math.round(parseFloat(product.rating || "0"))
                            ? "fill-gold text-gold"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{product.jumlahUlasan} ulasan</p>
                </div>
              </div>

              {/* Reviews List */}
              {product.reviews.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Belum ada ulasan untuk produk ini</p>
              ) : (
                <div className="space-y-6">
                  {product.reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-gray-50 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-4 h-4",
                                i < rev.rating ? "fill-gold text-gold" : "text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                        {rev.terverifikasi && (
                          <span className="text-xs text-success font-medium">✓ Terverifikasi</span>
                        )}
                      </div>
                      <p className="font-medium text-gray-800 text-sm">{rev.judul}</p>
                      <p className="text-gray-600 text-sm mt-1">{rev.komentar}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-6 h-6 bg-emerald-dark/10 rounded-full flex items-center justify-center">
                          <span className="text-emerald-dark text-[10px] font-bold">
                            {rev.namaUser?.charAt(0) || "P"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">{rev.namaUser}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Related Products ───────────────────── */}
      {product.related.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">
            Produk Terkait
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {product.related.map((p) => (
              <ProductCard
                key={p.id}
                product={{ ...p, gambarUrl: "" }}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── Size Chart Modal ───────────────────── */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-auto animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-serif font-bold text-lg">Size Chart</h3>
              <button onClick={() => setShowSizeChart(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                ×
              </button>
            </div>
            <div className="p-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-cream">
                    <th className="p-3 text-left font-medium">Ukuran</th>
                    <th className="p-3 text-left font-medium">Dada (cm)</th>
                    <th className="p-3 text-left font-medium">Panjang (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ukuran: "S", dada: "88-92", panjang: "120" },
                    { ukuran: "M", dada: "93-97", panjang: "125" },
                    { ukuran: "L", dada: "98-102", panjang: "130" },
                    { ukuran: "XL", dada: "103-108", panjang: "132" },
                    { ukuran: "XXL", dada: "109-114", panjang: "135" },
                  ].map((row) => (
                    <tr key={row.ukuran} className="border-b border-gray-100">
                      <td className="p-3 font-bold">{row.ukuran}</td>
                      <td className="p-3">{row.dada}</td>
                      <td className="p-3">{row.panjang}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 mt-4">
                * Ukuran dapat berbeda ±2cm. Jika ragu, pilih ukuran satu kali lebih besar.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
