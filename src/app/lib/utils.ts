/* ─── Helpers ──────────────────────────────────────────── */

export function formatRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const r = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NQW-${y}${m}${d}-${r}`;
}

export function starArray(rating: number): ("full" | "half" | "empty")[] {
  const stars: ("full" | "half" | "empty")[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push("full");
    else if (rating >= i - 0.5) stars.push("half");
    else stars.push("empty");
  }
  return stars;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

export function formatDate(d: string | Date): string {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    belum_bayar: "bg-yellow-100 text-yellow-800",
    dibuat: "bg-yellow-100 text-yellow-800",
    diverifikasi: "bg-blue-100 text-blue-800",
    diproses: "bg-blue-100 text-blue-800",
    dikemas: "bg-indigo-100 text-indigo-800",
    dikirim: "bg-purple-100 text-purple-800",
    selesai: "bg-green-100 text-green-800",
    dibatalkan: "bg-red-100 text-red-800",
    retur: "bg-red-100 text-red-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    belum_bayar: "Menunggu Pembayaran",
    dibuat: "Dibuat",
    diverifikasi: "Terverifikasi",
    diproses: "Diproses",
    dikemas: "Dikemas",
    dikirim: "Dikirim",
    selesai: "Selesai",
    dibatalkan: "Dibatalkan",
    retur: "Retur",
  };
  return map[status] || status;
}
