# NAQI WEAR - Toko Fashion Muslim Online

Toko fashion muslim online terpercaya. Koleksi lengkap untuk wanita, pria, anak, dan keluarga.

## 🚀 Cara Install & Jalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
Pastikan PostgreSQL sudah berjalan, lalu jalankan:
```bash
npx drizzle-kit push
```

### 3. Seed Data
Buka browser dan akses:
```
http://localhost:3000/api/seed
```
Lalu gunakan POST request untuk mengisi data awal.

Atau gunakan curl:
```bash
curl -X POST http://localhost:3000/api/seed
```

### 4. Jalankan Development Server
```bash
npm run dev
```

### 5. Buka Aplikasi
- **Toko**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

## 🔑 Login Demo

### Admin
- Email: admin@naqiwear.com
- Password: admin123

### Customer
- Email: siti@email.com
- Password: (bebas, password sama dengan yang di database)

## 📁 Struktur Proyek

```
src/
├── app/
│   ├── api/              # API Routes
│   │   ├── products/     # Produk CRUD
│   │   ├── categories/   # Kategori
│   │   ├── orders/       # Pesanan
│   │   ├── coupons/      # Voucher
│   │   ├── reviews/      # Ulasan
│   │   ├── auth/         # Autentikasi
│   │   ├── seed/         # Database seed
│   │   └── admin/        # Admin API
│   ├── components/       # Komponen UI
│   ├── katalog/          # Halaman katalog
│   ├── produk/           # Detail produk
│   ├── keranjang/        # Keranjang belanja
│   ├── checkout/         # Checkout
│   ├── akun/             # Akun & pesanan
│   ├── wishlist/         # Wishlist
│   ├── promo/            # Promo & voucher
│   ├── artikel/          # Artikel islami
│   ├── kategori/         # Kategori produk
│   └── admin/            # Dashboard admin
├── db/
│   ├── schema.ts         # Database schema
│   └── index.ts          # DB connection
└── lib/
    ├── store-context.tsx # State management
    └── utils.ts          # Utility functions
```

## 🎨 Tema Warna

| Warna | Kode | Kegunaan |
|-------|------|----------|
| Hijau Zamrud | #1B4332 | Warna utama, header, tombol |
| Emas Muda | #D4AF37 | Harga, badge, highlight |
| Krem | #FDF6E3 | Background |
| Coklat Tanah | #6D4C3D | Aksen |
| Putih Bersih | #FFFFFF | Kartu, konten |

## 📱 Fitur

### Customer
- Beranda dengan banner, kategori, produk terlaris & terbaru
- Katalog dengan filter & sorting
- Detail produk dengan varian warna/ukuran
- Keranjang belanja
- Checkout 3 langkah
- Akun & riwayat pesanan
- Wishlist
- Promo & voucher
- Artikel islami
- Chat WhatsApp

### Admin
- Dashboard statistik
- Manajemen produk
- Manajemen pesanan
- Manajemen pelanggan
- Manajemen promo
- Manajemen banner
- Manajemen konten
- Laporan penjualan

## 🔧 Teknologi

- Next.js 16 (App Router)
- PostgreSQL + Drizzle ORM
- Tailwind CSS
- Lucide React (ikon)
- TypeScript
