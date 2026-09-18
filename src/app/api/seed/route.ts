import { db } from "@/db";
import {
  categories,
  products,
  productVariants,
  productImages,
  coupons,
  banners,
  articles,
  users,
  reviews,
} from "@/db/schema";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    /* ── Categories ─────────────────────────────────── */
    const catData = [
      { nama: "Wanita", slug: "wanita", urutan: 1 },
      { nama: "Pria", slug: "pria", urutan: 2 },
      { nama: "Anak", slug: "anak", urutan: 3 },
      { nama: "Keluarga", slug: "keluarga", urutan: 4 },
      { nama: "Mukena", slug: "mukena", urutan: 5 },
      { nama: "Hijab", slug: "hijab", urutan: 6 },
      { nama: "Promo", slug: "promo", urutan: 7 },
    ];

    const insertedCats = await db
      .insert(categories)
      .values(catData)
      .returning();

    const catMap: Record<string, number> = {};
    for (const c of insertedCats) catMap[c.slug] = c.id;

    /* ── Sub-Categories ─────────────────────────────── */
    const subData = [
      { nama: "Gamis", slug: "gamis", parentId: catMap["wanita"], urutan: 1 },
      { nama: "Tunik", slug: "tunik", parentId: catMap["wanita"], urutan: 2 },
      { nama: "Bergo", slug: "bergo", parentId: catMap["wanita"], urutan: 3 },
      { nama: "Pashmina", slug: "pashmina", parentId: catMap["hijab"], urutan: 1 },
      { nama: "Hijab Segiempat", slug: "hijab-segiempat", parentId: catMap["hijab"], urutan: 2 },
      { nama: "Khimar", slug: "khimar", parentId: catMap["hijab"], urutan: 3 },
      { nama: "Mukena Dewasa", slug: "mukena-dewasa", parentId: catMap["mukena"], urutan: 1 },
      { nama: "Mukena Anak", slug: "mukena-anak", parentId: catMap["mukena"], urutan: 2 },
      { nama: "Baju Koko", slug: "baju-koko", parentId: catMap["pria"], urutan: 1 },
      { nama: "Sarung", slug: "sarung", parentId: catMap["pria"], urutan: 2 },
      { nama: "Gamis Pria", slug: "gamis-pria", parentId: catMap["pria"], urutan: 3 },
      { nama: "Gamis Anak", slug: "gamis-anak", parentId: catMap["anak"], urutan: 1 },
      { nama: "Baju Koko Anak", slug: "baju-koko-anak", parentId: catMap["anak"], urutan: 2 },
      { nama: "Sarimbit", slug: "sarimbit", parentId: catMap["keluarga"], urutan: 1 },
      { nama: "Paket Lebaran", slug: "paket-lebaran", parentId: catMap["promo"], urutan: 1 },
    ];
    const insertedSubs = await db
      .insert(categories)
      .values(subData)
      .returning();
    for (const s of insertedSubs) catMap[s.slug] = s.id;

    /* ── Products ───────────────────────────────────── */
    const prodData = [
      {
        categoryId: catMap["gamis"],
        nama: "Gamis SYAKIRA Premium",
        slug: "gamis-syakira-premium",
        deskripsi:
          "Gamis premium bahan premium American Drill yang adem, jatuh, dan tidak menerawang. Desain elegan dengan aksen tali pinggang. Cocok untuk aktifitas sehari-hari maupun acara formal.",
        bahan: "American Drill Premium",
        gender: "wanita",
        hargaDasar: 289000,
        hargaDiskon: 249000,
        beratGram: 350,
        unggulan: true,
        terlaris: true,
        rating: "4.80",
        jumlahUlasan: 156,
      },
      {
        categoryId: catMap["gamis"],
        nama: "Gamis AZAHRA Flowy",
        slug: "gamis-azahra-flowy",
        deskripsi:
          "Gamis flowy bahan Ceruty yang super lembut dan jatuh. Cutting loose yang nyaman untuk semua bentuk tubuh. Tersedia dalam 8 warna cantik.",
        bahan: "Ceruty Babydoll",
        gender: "wanita",
        hargaDasar: 199000,
        hargaDiskon: 169000,
        beratGram: 300,
        unggulan: false,
        terlaris: true,
        rating: "4.70",
        jumlahUlasan: 89,
      },
      {
        categoryId: catMap["bergo"],
        nama: "Bergo NADIRA instant",
        slug: "bergo-nadira-instant",
        deskripsi:
          "Bergo instant model terbaru dengan pet antemod yang lembut. Bahan Ceruty premium, adem, dan ringan. Cocok untuk daily wear.",
        bahan: "Ceruty",
        gender: "wanita",
        hargaDasar: 89000,
        hargaDiskon: 69000,
        beratGram: 120,
        unggulan: true,
        terlaris: true,
        rating: "4.90",
        jumlahUlasan: 234,
      },
      {
        categoryId: catMap["baju-koko"],
        nama: "Baju Koko AL-KHALIFAH",
        slug: "baju-koko-al-khalifah",
        deskripsi:
          "Baju koko pria bahan premium yang nyaman dan elegan. Desain modern dengan bordir minimalis. Cocok untuk sholat, pengajian, dan acara formal.",
        bahan: "Katun Premium",
        gender: "pria",
        hargaDasar: 179000,
        hargaDiskon: 149000,
        beratGram: 300,
        unggulan: true,
        terlaris: true,
        rating: "4.60",
        jumlahUlasan: 78,
      },
      {
        categoryId: catMap["mukena-dewasa"],
        nama: "Mukena PRINCESS Royal",
        slug: "mukena-princess-royal",
        deskripsi:
          "Mukena premium dengan bordir mewah. Bahan Satin Bubble yang jatuh dan tidak menerawang. Dilengkapi kantong kecil dan tali yang nyaman.",
        bahan: "Satin Bubble",
        gender: "wanita",
        hargaDasar: 299000,
        hargaDiskon: 249000,
        beratGram: 400,
        unggulan: true,
        terlaris: true,
        rating: "4.85",
        jumlahUlasan: 112,
      },
      {
        categoryId: catMap["sarimbit"],
        nama: "Sarimbit KELUARGA KAHALA",
        slug: "sarimbit-keluarga-kahala",
        deskripsi:
          "Setelan sarimbit keluarga dengan desain matching untuk ayah, ibu, dan anak. Bahan premium yang nyaman sepanjang hari. Cocok untuk lebaran dan acara keluarga.",
        bahan: "American Drill",
        gender: "keluarga",
        hargaDasar: 599000,
        hargaDiskon: 499000,
        beratGram: 800,
        unggulan: true,
        terlaris: true,
        rating: "4.92",
        jumlahUlasan: 67,
      },
      {
        categoryId: catMap["pashmina"],
        nama: "Pashmina ZAHRA Premium",
        slug: "pashmina-zahra-premium",
        deskripsi:
          "Pashmina premium bahan Ceruty yang super lembut. Pinggiran berenda cantik. Cocok untuk dipadupadakan dengan gamis atau tunik.",
        bahan: "Ceruty Premium",
        gender: "wanita",
        hargaDasar: 79000,
        hargaDiskon: 59000,
        beratGram: 100,
        unggulan: false,
        terlaris: true,
        rating: "4.75",
        jumlahUlasan: 198,
      },
      {
        categoryId: catMap["gamis-anak"],
        nama: "Gamis Anak BUNGA Harum",
        slug: "gamis-anak-bunga-harum",
        deskripsi:
          "Gamis anak perempuan dengan motif bunga cantik. Bahan katun yang adem dan nyaman untuk bermain. Ada kantong lucu di samping.",
        bahan: "KatunMotif",
        gender: "anak",
        hargaDasar: 129000,
        hargaDiskon: 99000,
        beratGram: 200,
        unggulan: false,
        terlaris: true,
        rating: "4.80",
        jumlahUlasan: 45,
      },
      {
        categoryId: catMap["hijab-segiempat"],
        nama: "Hijab Segiempat NURAYA",
        slug: "hijab-segiempat-nuraya",
        deskripsi:
          "Hijab segiempat bahan voal premium yang ringan dan adem. Motif elegan dengan pinggiran jahit rapi. Ukuran 130x130cm.",
        bahan: "Voal Premium",
        gender: "wanita",
        hargaDasar: 55000,
        hargaDiskon: 45000,
        beratGram: 80,
        unggulan: false,
        terlaris: false,
        rating: "4.60",
        jumlahUlasan: 134,
      },
      {
        categoryId: catMap["sarung"],
        nama: "Sarung TENUN Atlas Premium",
        slug: "sarung-tenun-atlas-premium",
        deskripsi:
          "Sarung tenun Atlas premium dengan motif tradisional. Bahan lembut dan nyaman dipakai. Cocok untuk sholat sehari-hari.",
        bahan: "Tenun Premium",
        gender: "pria",
        hargaDasar: 135000,
        hargaDiskon: 115000,
        beratGram: 250,
        unggulan: false,
        terlaris: true,
        rating: "4.50",
        jumlahUlasan: 89,
      },
      {
        categoryId: catMap["tunik"],
        nama: "Tunik AMARA Modern",
        slug: "tunik-amara-modern",
        deskripsi:
          "Tunik modern dengan desain kekinian. Bahan Katun Rayon yang adem dan flowy. Panjang pinggul, cocok dipadukan dengan celana palazzo atau rok plisket.",
        bahan: "Katun Rayon",
        gender: "wanita",
        hargaDasar: 159000,
        hargaDiskon: 129000,
        beratGram: 250,
        unggulan: false,
        terlaris: false,
        rating: "4.65",
        jumlahUlasan: 56,
      },
      {
        categoryId: catMap["paket-lebaran"],
        nama: "Paket Lebaran SEGER Bahagia",
        slug: "paket-lebaran-seger-bahagia",
        deskripsi:
          "Paket lengkap Lebaran: Gamis + Hijab + Mukena untuk Ibu, Baju Koko + Sarung + Peci untuk Ayah. Hemat hingga 40% dari harga satuan!",
        bahan: "Premium Mix",
        gender: "keluarga",
        hargaDasar: 899000,
        hargaDiskon: 699000,
        beratGram: 1200,
        unggulan: true,
        terlaris: true,
        rating: "4.95",
        jumlahUlasan: 34,
      },
    ];

    const insertedProds = await db
      .insert(products)
      .values(prodData)
      .returning();

    /* ── Variants ───────────────────────────────────── */
    const colors = ["Hijau Tua", "Navy", "Dusty Pink", "Maroon", "Hitam", "Krem", "Abu-abu", "Biru Dongker"];
    const sizes = ["S", "M", "L", "XL", "XXL"];

    for (const p of insertedProds) {
      const varColors =
        p.gender === "pria"
          ? ["Hitam", "Navy", "Abu-abas", "Krem"]
          : colors.slice(0, 5);
      const varSizes =
        p.gender === "pria" || p.gender === "keluarga"
          ? sizes
          : ["S", "M", "L", "XL"];

      for (const warna of varColors) {
        for (const ukuran of varSizes) {
          await db.insert(productVariants).values({
            productId: p.id,
            sku: `${p.slug?.toUpperCase()}-${warna.slice(0, 3).toUpperCase()}-${ukuran}`,
            warna,
            ukuran,
            harga: p.hargaDiskon || p.hargaDasar,
            stok: Math.floor(Math.random() * 20) + 5,
            beratGram: p.beratGram || 200,
          });
        }
      }

      /* Product Images */
      await db.insert(productImages).values({
        productId: p.id,
        gambarUrl: `/images/products/${p.slug}.jpg`,
        altText: p.nama,
        urutan: 0,
        utama: true,
      });
    }

    /* ── Users ──────────────────────────────────────── */
    await db.insert(users).values([
      {
        nama: "Admin NAQI WEAR",
        email: "admin@naqiwear.com",
        nomorWa: "081234567890",
        passwordHash: "admin123",
        role: "admin",
      },
      {
        nama: "Siti Rahmawati",
        email: "siti@email.com",
        nomorWa: "081234567891",
        role: "customer",
      },
    ]);

    /* ── Coupons ────────────────────────────────────── */
    await db.insert(coupons).values([
      {
        kode: "NAQI10",
        tipe: "persen",
        nilai: 10,
        minimalOrder: 100000,
        maksimalDiskon: 50000,
        kuota: 100,
        terpakai: 23,
        aktif: true,
      },
      {
        kode: "LEBARAN25",
        tipe: "persen",
        nilai: 25,
        minimalOrder: 300000,
        maksimalDiskon: 100000,
        kuota: 50,
        terpakai: 12,
        aktif: true,
      },
      {
        kode: "GRATISONGKIR",
        tipe: "gratis_ongkir",
        nilai: 0,
        minimalOrder: 200000,
        kuota: 200,
        terpakai: 45,
        aktif: true,
      },
    ]);

    /* ── Banners ────────────────────────────────────── */
    await db.insert(banners).values([
      {
        judul: "Koleksi Ramadan 2025",
        gambarUrl: "/images/banners/ramadan.jpg",
        tautan: "/kategori/hijab",
        aktif: true,
        urutan: 1,
      },
      {
        judul: "Diskon Spesial hingga 50%",
        gambarUrl: "/images/banners/promo.jpg",
        tautan: "/promo",
        aktif: true,
        urutan: 2,
      },
    ]);

    /* ── Articles ───────────────────────────────────── */
    await db.insert(articles).values([
      {
        judul: "Panduan Memilih Hijab yang Tepat untuk Aktivitas Sehari-hari",
        slug: "panduan-memilih-hijab",
        ringkasan:
          "Memilih hijab yang tepat akan membuat penampilan lebih percaya diri dan nyaman sepanjang hari.",
        konten:
          "Memilih hijab tidak hanya soal warna dan motif, tapi juga bahan dan potongan. Untuk aktifitas sehari-hari, pilih bahan yang ringan dan adem seperti voal atau ceruty. Untuk acara formal, pilih bahan satin atau silk yang elegan.",
        gambarUrl: "/images/articles/hijab-guide.jpg",
        penulis: "Tim NAQI WEAR",
        status: "published",
      },
      {
        judul: "Tips Memilih Ukuran Gamis yang Pas untuk Tubuh Anda",
        slug: "tips-ukuran-gamis",
        ringkasan:
          "Tidak semua gamis ukuran L sama. Kenali ukuran yang tepat agar gamis terlihat sempurna.",
        konten:
          "Ukuran gamis bisa berbeda antar merek. Yang terpenting adalah ukuran dada, panjang badan, dan panjang lengan. Gunakan ukuran chart yang kami sediakan untuk memastikan gamis pas di tubuh Anda.",
        gambarUrl: "/images/articles/gamis-size.jpg",
        penulis: "Tim NAQI WEAR",
        status: "published",
      },
      {
        judul: "Inspirasi Sarimbit Lebaran untuk Keluarga Bahagia",
        slug: "inspirasi-sarimbit-lebaran",
        ringkasan:
          "Rayakan Lebaran dengan tampil kompak bersama keluarga tercinta.",
        konten:
          "Sarimbit keluarga menjadi tren yang terus diminati. Pilih warna dan motif yang senada untuk seluruh anggota keluarga. Naqil Wear menyediakan berbagai pilihan sarimbit dengan bahan premium yang nyaman seharian.",
        gambarUrl: "/images/articles/sarimbit.jpg",
        penulis: "Tim NAQI WEAR",
        status: "published",
      },
    ]);

    /* ── Reviews ────────────────────────────────────── */
    await db.insert(reviews).values([
      {
        userId: 2,
        productId: insertedProds[0].id,
        rating: 5,
        judul: "Gamisnya bagus banget!",
        komentar:
          "Bahannya adem, jatuh, dan tidak menerawang. Warnanya sama seperti di foto. Suka banget!",
        terverifikasi: true,
      },
      {
        userId: 2,
        productId: insertedProds[2].id,
        rating: 5,
        judul: "Bergo favorit!",
        komentar:
          "Pet antemodnya lembut, bahan cerutynya adem. Sudah beli 3 warna sekarang.",
        terverifikasi: true,
      },
      {
        userId: 2,
        productId: insertedProds[4].id,
        rating: 5,
        judul: "Mukena premium worth it",
        komentar:
          "Bordirannya mewah banget. Kainnya jatuh dan nggak menerawang. Recommended!",
        terverifikasi: true,
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "Database berhasil di-seed!",
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}
