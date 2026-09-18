import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { generateOrderNumber } from "@/app/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const userId = sp.get("user_id");

    if (!userId) {
      return NextResponse.json({ success: false, message: "user_id diperlukan" }, { status: 400 });
    }

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, parseInt(userId)))
      .orderBy(desc(orders.createdAt));

    return NextResponse.json({ success: true, data: userOrders });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, items, alamat, kurir, layanan, ongkir, total, diskon, catatan } = body;

    if (!userId || !items?.length) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap" }, { status: 400 });
    }

    const nomorPesanan = generateOrderNumber();
    const subtotal = items.reduce((s: number, i: { harga: number; qty: number }) => s + i.harga * i.qty, 0);

    const [order] = await db
      .insert(orders)
      .values({
        nomorPesanan,
        userId,
        snapshotAlamat: alamat,
        subtotal,
        diskon: diskon || 0,
        ongkir: ongkir || 0,
        total: total || subtotal,
        kurir,
        layanan,
        catatan,
        statusPembayaran: "belum_bayar",
        statusPesanan: "dibuat",
      })
      .returning();

    for (const item of items) {
      await db.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        variantId: item.variantId,
        snapshotNama: item.nama,
        snapshotSku: item.sku,
        snapshotVarian: `${item.warna} / ${item.ukuran}`,
        qty: item.qty,
        harga: item.harga,
        subtotal: item.harga * item.qty,
      });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
