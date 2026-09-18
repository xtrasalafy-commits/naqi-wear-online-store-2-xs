import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { action, email, password, nama, nomorWa } = await req.json();

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ success: false, message: "Email dan password harus diisi" }, { status: 400 });
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        return NextResponse.json({ success: false, message: "Email tidak terdaftar" }, { status: 404 });
      }

      if (user.passwordHash !== password) {
        return NextResponse.json({ success: false, message: "Password salah" }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        data: { id: user.id, nama: user.nama, email: user.email, role: user.role },
      });
    }

    if (action === "register") {
      if (!email || !password || !nama) {
        return NextResponse.json({ success: false, message: "Data tidak lengkap" }, { status: 400 });
      }

      const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existing.length > 0) {
        return NextResponse.json({ success: false, message: "Email sudah terdaftar" }, { status: 409 });
      }

      const [user] = await db
        .insert(users)
        .values({ nama, email, passwordHash: password, nomorWa, role: "customer" })
        .returning();

      return NextResponse.json({
        success: true,
        data: { id: user.id, nama: user.nama, email: user.email, role: user.role },
      });
    }

    return NextResponse.json({ success: false, message: "Aksi tidak dikenal" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
