# NAQI WEAR - Toko Fashion Muslim Online

Toko fashion muslim online terpercaya. Koleksi lengkap untuk wanita, pria, anak, dan keluarga.

## 🚀 Cara Install & Jalankan

### 1. Clone Repository
```bash
git clone https://github.com/perpus_opera/naqi-wear-online-store.git
cd naqi-wear-online-store
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
Salin file `.env.example` dan isi konfigurasi:
```bash
cp .env.example .env.local
```

Atur variabel lingkungan di `.env.local`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/naqi_wear_db
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Setup Database
Pastikan PostgreSQL sudah berjalan, lalu jalankan:
```bash
npx drizzle-kit push
```

### 5. Seed Data
Isi data awal dengan POST request:
```bash
curl -X POST http://localhost:3000/api/seed
```

### 6. Jalankan Development Server
```bash
npm run dev
```

### 7. Buka Aplikasi
- **Toko**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

## 🔑 Login Demo

### Admin
- Email: admin@naqiwear.com
- Password: admin123

### Customer
- Email: siti@email.com
- Password: (bebas, password sama dengan yang di database)

## 📱 Fitur

### Customer
- ✅ Beranda dengan banner, kategori, produk terlaris & terbaru
- ✅ Katalog dengan filter & sorting
- ✅ Detail produk dengan varian warna/ukuran
- ✅ Keranjang belanja
- ✅ Checkout 3 langkah
- ✅ Akun & riwayat pesanan
- ✅ Wishlist
- ✅ Promo & voucher
- ✅ Artikel islami
- ✅ Chat WhatsApp
- ✅ Trakteer widget (dukung pengembangan)

### Admin
- Dashboard statistik
- Manajemen produk
- Manajemen pesanan
- Manajemen pelanggan
- Manajemen promo & voucher
- Manajemen banner
- Manajemen konten (artikel, FAQ, syarat)
- Laporan penjualan

## 📁 Struktur Proyek

```
src/
├── app/
│   ├── api/              # API Routes
│   │   ├── products/     # Produk CRUD
│   │   ├── products/[slug]/
│   │   ├── categories/   # Kategori
│   │   ├── orders/       # Pesanan
│   │   ├── admin/        # Admin API
│   │   │   ├── orders/
│   │   │   └── stats/
│   │   ├── coupons/      # Voucher
│   │   ├── reviews/      # Ulasan
│   │   ├── articles/     # Artikel
│   │   ├── banners/      # Banner
│   │   ├── auth/         # Autentikasi
│   │   ├── health/       # Health check
│   │   └── seed/         # Database seed
│   ├── components/       # Komponen UI
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── BottomNav.tsx
│   │   ├── ClientLayout.tsx
│   │   ├── ProductCard.tsx
│   │   ├── WhatsAppButton.tsx
│   │   ├── TrakteerWidget.tsx
│   │   ├── Toast.tsx
│   │   └── LoadingSkeleton.tsx
│   ├── lib/              # Library & utilities
│   │   ├── utils.ts      # Utility functions
│   │   └── store-context.tsx # State management
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Halaman beranda
│   ├── katalog/          # Halaman katalog
│   ├── keranjang/        # Keranjang belanja
│   ├── checkout/         # Checkout
│   ├── produk/[slug]/    # Detail produk
│   ├── kategori/[slug]/  # Kategori produk
│   ├── akun/             # Akun
│   │   ├── page.tsx
│   │   └── pesanan/      # Riwayat pesanan
│   ├── artikel/          # Artikel islami
│   │   ├── page.tsx
│   │   └── [slug]/
│   ├── promo/            # Promo & voucher
│   ├── wishlist/         # Wishlist
│   └── admin/            # Dashboard admin
│       ├── page.tsx
│       ├── produk/
│       ├── pesanan/
│       ├── pelanggan/
│       ├── promo/
│       ├── banner/
│       ├── konten/
│       └── laporan/
├── db/
│   ├── schema.ts         # Database schema
│   └── index.ts          # DB connection
├── next.config.ts
├── drizzle.config.json
└── package.json
```

## 🔧 Teknologi

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Next.js | 16 | Framework web |
| PostgreSQL | - | Database |
| Drizzle ORM | 0.45 | ORM |
| Tailwind CSS | 4 | Styling |
| Lucide React | - | Ikon |
| TypeScript | 5.9 | Type safety |
| Framer Motion | 13 | Animasi |
| date-fns | 4 | Date formatting |

## 🎨 Tema Warna

| Warna | Kode | Kegunaan |
|-------|------|----------|
| Hijau Zamrud | #1B4332 | Warna utama, header, tombol |
| Emas Muda | #D4AF37 | Harga, badge, highlight |
| Krem | #FDF6E3 | Background |
| Coklat Tanah | #6D4C3D | Aksen |
| Putih Bersih | #FFFFFF | Kartu, konten |

## 🖥️ Deploy ke Vercel

1. Push ke GitHub
2. Buat project di [Vercel](https://vercel.com) → Connect GitHub repo
3. Set Environment Variables di Vercel Dashboard:
   ```
   DATABASE_URL=postgresql://...
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
4. Deploy otomatis
5. Setelah deploy, POST ke `/api/seed` untuk isi data awal

## 💝 Trakteer

Web app ini gratis & bebas iklan. Kopi kecil, server tetap jalan.

Trakteer widget muncul di sudut kanan bawah layar. Klik untuk melihat nominal traktiran (Rp6.000, Rp10.000, Rp20.000, Rp50.000) dan QR Code langsung di dalam aplikasi.

🔗 [Trakteer - perpus_opera](https://trakteer.id/perpus_opera/)

## 📥 Download Source Code

Source code lengkap dapat diunduh melalui tombol "Download Source Code" pada widget Trakteer atau melalui halaman admin.

## 👤 Trakteer

Trakteer widget menampilkan opsi nominal traktiran dan QR Code langsung di dalam web app tanpa berpindah halaman.

## 📜 Lisensi

Open Source by MZF - 2026

Dikembangkan dengan ❤️ oleh Tim NAQI WEAR.
