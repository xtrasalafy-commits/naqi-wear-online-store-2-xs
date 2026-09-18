import { db } from "@/db";
import { products, categories, productVariants, productImages } from "@/db/schema";
import { eq, and, desc, asc, ilike, sql, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const category = sp.get("category");
    const search = sp.get("search");
    const sort = sp.get("sort") || "terbaru";
    const minPrice = sp.get("min_price");
    const maxPrice = sp.get("max_price");
    const gender = sp.get("gender");
    const unggulan = sp.get("unggulan");
    const terlaris = sp.get("terlaris");
    const page = parseInt(sp.get("page") || "1");
    const limit = parseInt(sp.get("limit") || "20");
    const offset = (page - 1) * limit;

    let whereConditions = [eq(products.status, "aktif")];

    if (category) {
      const cat = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, category))
        .limit(1);
      if (cat.length > 0) {
        whereConditions.push(eq(products.categoryId, cat[0].id));
      }
    }

    if (search) {
      whereConditions.push(
        or(
          ilike(products.nama, `%${search}%`),
          ilike(products.deskripsi, `%${search}%`)
        )!
      );
    }

    if (gender) {
      whereConditions.push(eq(products.gender, gender));
    }
    if (unggulan === "true") {
      whereConditions.push(eq(products.unggulan, true));
    }
    if (terlaris === "true") {
      whereConditions.push(eq(products.terlaris, true));
    }

    if (minPrice) {
      whereConditions.push(sql`${products.hargaDiskon} >= ${parseInt(minPrice)}`);
    }
    if (maxPrice) {
      whereConditions.push(sql`${products.hargaDiskon} <= ${parseInt(maxPrice)}`);
    }

    let orderClause;
    switch (sort) {
      case "harga_asc":
        orderClause = asc(products.hargaDiskon);
        break;
      case "harga_desc":
        orderClause = desc(products.hargaDiskon);
        break;
      case "terlaris":
        orderClause = desc(products.jumlahUlasan);
        break;
      case "rating":
        orderClause = desc(products.rating);
        break;
      default:
        orderClause = desc(products.createdAt);
    }

    const where = and(...whereConditions);

    const results = await db
      .select({
        id: products.id,
        nama: products.nama,
        slug: products.slug,
        deskripsi: products.deskripsi,
        bahan: products.bahan,
        gender: products.gender,
        hargaDasar: products.hargaDasar,
        hargaDiskon: products.hargaDiskon,
        status: products.status,
        unggulan: products.unggulan,
        terlaris: products.terlaris,
        rating: products.rating,
        jumlahUlasan: products.jumlahUlasan,
        createdAt: products.createdAt,
        categoryName: categories.nama,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(orderClause)
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(where);

    return NextResponse.json({
      success: true,
      data: results,
      pagination: { page, limit, total: Number(count), totalPages: Math.ceil(Number(count) / limit) },
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
