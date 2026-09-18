import { db } from "@/db";
import { orders, orderItems, users } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const status = sp.get("status");

    let query = db
      .select({
        id: orders.id,
        nomorPesanan: orders.nomorPesanan,
        userId: orders.userId,
        namaUser: users.nama,
        total: orders.total,
        statusPembayaran: orders.statusPembayaran,
        statusPesanan: orders.statusPesanan,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));

    if (status) {
      query = query.where(eq(orders.statusPesanan, status)) as typeof query;
    }

    const data = await query;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, statusPesanan, statusPembayaran, resi } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "ID pesanan diperlukan" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (statusPesanan) updates.statusPesanan = statusPesanan;
    if (statusPembayaran) updates.statusPembayaran = statusPembayaran;
    if (resi !== undefined) updates.resi = resi;

    const [updated] = await db
      .update(orders)
      .set(updates)
      .where(eq(orders.id, id))
      .returning();

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
