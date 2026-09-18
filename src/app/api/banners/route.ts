import { db } from "@/db";
import { banners } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(banners)
      .where(eq(banners.aktif, true))
      .orderBy(asc(banners.urutan));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
