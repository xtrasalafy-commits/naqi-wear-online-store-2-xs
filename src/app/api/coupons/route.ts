import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await db.select().from(coupons).where(eq(coupons.aktif, true));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { kode, totalBelanja } = await req.json();
    if (!kode) {
      return NextResponse.json({ success: false, message: "Masukkan kode voucher" }, { status: 400 });
    }

    const [coupon] = await db
      .select()
      .from(coupons)
      .where(
        and(
          eq(coupons.kode, kode.toUpperCase()),
          eq(coupons.aktif, true),
          lte(coupons.terpakai, coupons.kuota)
        )
      )
      .limit(1);

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Kode voucher tidak valid" }, { status: 404 });
    }

    if (totalBelanja && coupon.minimalOrder && totalBelanja < coupon.minimalOrder) {
      return NextResponse.json(
        { success: false, message: `Minimal belanja ${coupon.minimalOrder}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: coupon });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
