import { db } from "@/db";
import { articles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.createdAt));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
