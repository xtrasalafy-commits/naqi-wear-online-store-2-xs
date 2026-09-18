"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useStore } from "@/app/lib/store-context";
import { formatRupiah } from "@/app/lib/utils";

interface Product {
  id: number;
  nama: string;
  slug: string;
  hargaDasar: number;
  hargaDiskon: number | null;
  rating: string | null;
  jumlahUlasan: number | null;
}

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToast } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlist() {
      if (wishlist.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/products?limit=50");
        const data = await res.json();
        if (data.success) {
          const filtered = data.data.filter((p: Product) => wishlist.includes(p.id));
          setProducts(filtered);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, [wishlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-dark">Beranda</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">Wishlist</span>
      </nav>

      <h1 className="text-2xl font-serif font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Heart className="w-7 h-7 text-red-500" />
        Wishlist Saya ({wishlist.length})
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl skeleton h-64" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Wishlist kosong</h3>
          <p className="text-gray-500 text-sm mb-6">Mulai simpan produk favorit Anda!</p>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-dark text-white font-bold rounded-xl hover:bg-emerald-dark/90 transition-colors"
          >
            Jelajahi Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden group"
            >
              <Link href={`/produk/${product.slug}`}>
                <div className="aspect-[3/4] bg-gradient-to-br from-emerald-dark/5 to-gold/5 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 mx-auto bg-emerald-dark/10 rounded-full flex items-center justify-center mb-2">
                      <span className="text-emerald-dark text-2xl font-serif font-bold">
                        {product.nama.charAt(0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{product.nama}</p>
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/produk/${product.slug}`}>
                  <h3 className="font-medium text-sm line-clamp-2 hover:text-emerald-dark transition-colors">
                    {product.nama}
                  </h3>
                </Link>
                <p className="font-bold text-gold mt-2">
                  {formatRupiah(product.hargaDiskon || product.hargaDasar)}
                </p>
                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/produk/${product.slug}`}
                    className="flex-1 py-2 bg-emerald-dark text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Keranjang
                  </Link>
                  <button
                    onClick={() => {
                      toggleWishlist(product.id);
                      addToast("Dihapus dari wishlist", "info");
                    }}
                    className="w-9 h-9 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
