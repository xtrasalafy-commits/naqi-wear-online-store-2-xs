import { db } from "@/db";
import { orders, users, products, orderItems } from "@/db/schema";
import { eq, sql, gte, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [salesToday] = await db
      .select({ total: sql<number>`coalesce(sum(${orders.total}), 0)` })
      .from(orders)
      .where(gte(orders.createdAt, today));

    const [newOrders] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.statusPesanan, "dibuat"));

    const [newCustomers] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, "customer"));

    const [productsSold] = await db
      .select({ total: sql<number>`coalesce(sum(${orderItems.qty}), 0)` })
      .from(orderItems);

    const recentOrders = await db
      .select({
        id: orders.id,
        nomorPesanan: orders.nomorPesanan,
        total: orders.total,
        statusPesanan: orders.statusPesanan,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    const [totalProducts] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products);

    return NextResponse.json({
      success: true,
      data: {
        penjualanHariIni: Number(salesToday.total),
        pesananBaru: Number(newOrders.count),
        pelangganBaru: Number(newCustomers.count),
        produkTerjual: Number(productsSold.total),
        totalProduk: Number(totalProducts.count),
        recentOrders,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
