import { db } from "@/db";
import { reviews, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const productId = sp.get("product_id");

    if (!productId) {
      return NextResponse.json({ success: false, message: "product_id diperlukan" }, { status: 400 });
    }

    const data = await db
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
      .where(eq(reviews.productId, parseInt(productId)));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, productId, orderId, rating, judul, komentar } = body;

    const [review] = await db
      .insert(reviews)
      .values({
        userId,
        productId,
        orderId,
        rating,
        judul,
        komentar,
        terverifikasi: true,
        status: "aktif",
      })
      .returning();

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
