import type { Metadata } from "next";
import type { ReactNode } from "react";
import ClientLayout from "@/app/components/ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "NAQI WEAR - Toko Fashion Muslim Online",
  description:
    "NAQI WEAR - Toko fashion muslim online terpercaya. Koleksi lengkap hijab, gamis, mukena, baju koko, sarimbit keluarga. Tampil syar'i, nyaman, dan elegan setiap hari.",
  keywords:
    "fashion muslim, hijab, gamis, mukena, baju koko, sarimbit, muslimah, pakaian muslim, toko online muslim",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-cream text-gray-800 antialiased min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
