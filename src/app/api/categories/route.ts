import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cats = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.urutan));

    return NextResponse.json({ success: true, data: cats });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
