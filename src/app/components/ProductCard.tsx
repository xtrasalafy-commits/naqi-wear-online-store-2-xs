"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useStore } from "@/app/lib/store-context";
import { formatRupiah, cn } from "@/app/lib/utils";

interface ProductCardProps {
  product: {
    id: number;
    nama: string;
    slug: string;
    hargaDasar: number;
    hargaDiskon: number | null;
    rating: string | null;
    jumlahUlasan: number | null;
    unggulan: boolean | null;
    terlaris: boolean | null;
    gambarUrl?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  const diskonPercent =
    product.hargaDiskon && product.hargaDasar
      ? Math.round(((product.hargaDasar - product.hargaDiskon) / product.hargaDasar) * 100)
      : 0;

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image */}
      <Link href={`/produk/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <div className="w-full h-full bg-gradient-to-br from-emerald-dark/5 to-gold/5 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto bg-emerald-dark/10 rounded-full flex items-center justify-center mb-2">
                <span className="text-emerald-dark text-2xl font-serif font-bold">
                  {product.nama.charAt(0)}
                </span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">{product.nama}</p>
            </div>
          </div>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {diskonPercent > 0 && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-[11px] font-bold rounded-full">
                -{diskonPercent}%
              </span>
            )}
            {product.terlaris && (
              <span className="px-2.5 py-1 bg-gold text-white text-[11px] font-bold rounded-full">
                Best Seller
              </span>
            )}
            {product.unggulan && (
              <span className="px-2.5 py-1 bg-emerald-dark text-white text-[11px] font-bold rounded-full">
                Unggulan
              </span>
            )}
          </div>
          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition-transform"
            aria-label="Wishlist"
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-colors",
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
              )}
            />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/produk/${product.slug}`}>
          <h3 className="font-medium text-gray-800 text-sm line-clamp-2 hover:text-emerald-dark transition-colors min-h-[40px]">
            {product.nama}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-3.5 h-3.5",
                  star <= Math.round(parseFloat(product.rating || "0"))
                    ? "fill-gold text-gold"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.jumlahUlasan || 0})</span>
        </div>

        {/* Price */}
        <div className="mt-2">
          {product.hargaDiskon ? (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gold">
                {formatRupiah(product.hargaDiskon)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {formatRupiah(product.hargaDasar)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gold">
              {formatRupiah(product.hargaDasar)}
            </span>
          )}
        </div>

        {/* Add to Cart Button (visible on hover on desktop) */}
        <Link
          href={`/produk/${product.slug}`}
          className="mt-3 w-full py-2.5 bg-emerald-dark text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-dark/90 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
        >
          <ShoppingCart className="w-4 h-4" />
          Lihat Produk
        </Link>
      </div>
    </div>
  );
}
