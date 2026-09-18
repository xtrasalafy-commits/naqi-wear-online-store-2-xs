import { db } from "@/db";
import { products, categories, productVariants, productImages, reviews, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const [product] = await db
      .select({
        id: products.id,
        nama: products.nama,
        slug: products.slug,
        deskripsi: products.deskripsi,
        bahan: products.bahan,
        gender: products.gender,
        hargaDasar: products.hargaDasar,
        hargaDiskon: products.hargaDiskon,
        beratGram: products.beratGram,
        status: products.status,
        unggulan: products.unggulan,
        terlaris: products.terlaris,
        rating: products.rating,
        jumlahUlasan: products.jumlahUlasan,
        categoryId: products.categoryId,
        categoryName: categories.nama,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.slug, slug))
      .limit(1);

    if (!product) {
      return NextResponse.json({ success: false, message: "Produk tidak ditemukan" }, { status: 404 });
    }

    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, product.id));

    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, product.id));

    const productReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        judul: reviews.judul,
        komentar: reviews.komentar,
        gambarUrlJson: reviews.gambarUrlJson,
        terverifikasi: reviews.terverifikasi,
        createdAt: reviews.createdAt,
        namaUser: users.nama,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, product.id));

    /* Related products */
    const related = await db
      .select({
        id: products.id,
        nama: products.nama,
        slug: products.slug,
        hargaDasar: products.hargaDasar,
        hargaDiskon: products.hargaDiskon,
        rating: products.rating,
        jumlahUlasan: products.jumlahUlasan,
        unggulan: products.unggulan,
        terlaris: products.terlaris,
      })
      .from(products)
      .where(eq(products.categoryId, product.categoryId!))
      .limit(4);

    return NextResponse.json({
      success: true,
      data: { ...product, variants, images, reviews: productReviews, related },
    });
  } catch (error) {
    console.error("Product detail error:", error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
