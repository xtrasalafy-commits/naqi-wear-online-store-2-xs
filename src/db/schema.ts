import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  boolean,
  decimal,
  timestamp,
  jsonb,
  date,
} from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nama: varchar("nama", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique(),
  nomorWa: varchar("nomor_wa", { length: 30 }),
  passwordHash: varchar("password_hash", { length: 255 }),
  alamatJson: jsonb("alamat_json"),
  gender: varchar("gender", { length: 20 }),
  tanggalLahir: date("tanggal_lahir"),
  role: varchar("role", { length: 20 }).default("customer").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Categories ──────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id"),
  nama: varchar("nama", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  gambarUrl: text("gambar_url"),
  urutan: integer("urutan").default(0),
});

// ─── Products ────────────────────────────────────────────────
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id"),
  nama: varchar("nama", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  deskripsi: text("deskripsi"),
  bahan: varchar("bahan", { length: 255 }),
  gender: varchar("gender", { length: 30 }),
  hargaDasar: integer("harga_dasar").notNull(),
  hargaDiskon: integer("harga_diskon"),
  beratGram: integer("berat_gram").default(200),
  status: varchar("status", { length: 20 }).default("aktif").notNull(),
  unggulan: boolean("unggulan").default(false),
  terlaris: boolean("terlaris").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  jumlahUlasan: integer("jumlah_ulasan").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Product Variants ────────────────────────────────────────
export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  sku: varchar("sku", { length: 100 }).unique(),
  warna: varchar("warna", { length: 100 }),
  ukuran: varchar("ukuran", { length: 30 }),
  harga: integer("harga"),
  stok: integer("stok").default(0),
  gambarUrl: text("gambar_url"),
  beratGram: integer("berat_gram"),
  aktif: boolean("aktif").default(true),
});

// ─── Product Images ──────────────────────────────────────────
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  gambarUrl: text("gambar_url").notNull(),
  altText: varchar("alt_text", { length: 255 }),
  urutan: integer("urutan").default(0),
  utama: boolean("utama").default(false),
});

// ─── Orders ──────────────────────────────────────────────────
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  nomorPesanan: varchar("nomor_pesanan", { length: 50 }).unique().notNull(),
  userId: integer("user_id").notNull(),
  snapshotAlamat: jsonb("snapshot_alamat"),
  subtotal: integer("subtotal").notNull(),
  diskon: integer("diskon").default(0),
  ongkir: integer("ongkir").default(0),
  total: integer("total").notNull(),
  kurir: varchar("kurir", { length: 50 }),
  layanan: varchar("layanan", { length: 100 }),
  resi: varchar("resi", { length: 100 }),
  statusPembayaran: varchar("status_pembayaran", { length: 30 }).default("belum_bayar"),
  statusPesanan: varchar("status_pesanan", { length: 30 }).default("dibuat"),
  catatan: text("catatan"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Order Items ─────────────────────────────────────────────
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id"),
  variantId: integer("variant_id"),
  snapshotNama: varchar("snapshot_nama", { length: 255 }),
  snapshotSku: varchar("snapshot_sku", { length: 100 }),
  snapshotVarian: varchar("snapshot_varian", { length: 255 }),
  qty: integer("qty").notNull(),
  harga: integer("harga").notNull(),
  subtotal: integer("subtotal").notNull(),
});

// ─── Payments ────────────────────────────────────────────────
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  metode: varchar("metode", { length: 50 }),
  idTransaksi: varchar("id_transaksi", { length: 100 }),
  jumlah: integer("jumlah"),
  status: varchar("status", { length: 30 }),
  dibayarPada: timestamp("dibayar_pada"),
});

// ─── Reviews ─────────────────────────────────────────────────
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  orderId: integer("order_id"),
  rating: integer("rating").notNull(),
  judul: varchar("judul", { length: 255 }),
  komentar: text("komentar"),
  gambarUrlJson: jsonb("gambar_url_json"),
  terverifikasi: boolean("terverifikasi").default(false),
  status: varchar("status", { length: 20 }).default("aktif"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Wishlists ───────────────────────────────────────────────
export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Coupons ─────────────────────────────────────────────────
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  kode: varchar("kode", { length: 50 }).unique().notNull(),
  tipe: varchar("tipe", { length: 20 }).notNull(),
  nilai: integer("nilai").notNull(),
  minimalOrder: integer("minimal_order").default(0),
  maksimalDiskon: integer("maksimal_diskon"),
  kuota: integer("kuota").default(100),
  terpakai: integer("terpakai").default(0),
  mulai: timestamp("mulai"),
  berakhir: timestamp("berakhir"),
  aktif: boolean("aktif").default(true),
});

// ─── Banners ─────────────────────────────────────────────────
export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  judul: varchar("judul", { length: 255 }),
  gambarUrl: text("gambar_url"),
  tautan: text("tautan"),
  mulai: timestamp("mulai"),
  berakhir: timestamp("berakhir"),
  aktif: boolean("aktif").default(true),
  urutan: integer("urutan").default(0),
});

// ─── Notifications ───────────────────────────────────────────
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  tipe: varchar("tipe", { length: 50 }),
  judul: varchar("judul", { length: 255 }),
  pesan: text("pesan"),
  dibaca: boolean("dibaca").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Articles ────────────────────────────────────────────────
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  judul: varchar("judul", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  ringkasan: text("ringkasan"),
  konten: text("konten"),
  gambarUrl: text("gambar_url"),
  penulis: varchar("penulis", { length: 100 }),
  status: varchar("status", { length: 20 }).default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
