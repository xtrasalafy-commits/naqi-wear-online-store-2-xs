"use client";

import Link from "next/link";
import {
  MessageCircle,
  Globe,
  Share2,
  Play,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-emerald-dark text-white">
      {/* ─── Newsletter ─────────────────────────── */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-serif font-bold">
              Dapatkan Info Promo & Koleksi Terbaru
            </h3>
            <p className="text-sm text-white/70 mt-1">
              Berlangganan newsletter kami untuk mendapatkan diskon eksklusif.
            </p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="flex-1 md:w-80 px-5 py-3 rounded-l-full text-gray-800 text-sm focus:outline-none"
            />
            <button className="px-6 py-3 bg-gold text-white font-bold rounded-r-full hover:bg-gold-light transition-colors text-sm">
              Berlangganan
            </button>
          </div>
        </div>
      </div>

      {/* ─── Main Footer ────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
              <span className="text-emerald-dark font-bold text-lg font-serif">N</span>
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg leading-none">NAQI WEAR</h2>
              <p className="text-[10px] text-white/50 tracking-widest">FASHION MUSLIM</p>
            </div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            Toko fashion muslim online terpercaya. Koleksi lengkap untuk wanita, pria,
            anak, dan keluarga. Tampil syar&apos;i, nyaman, dan elegan setiap hari.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a href="https://instagram.com/naqiwear" target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
              <Globe className="w-5 h-5" />
            </a>
            <a href="https://facebook.com/naqiwear" target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
              <Share2 className="w-5 h-5" />
            </a>
            <a href="https://youtube.com/@naqiwear" target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
              <Play className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Tautan Cepat */}
        <div>
          <h3 className="font-serif font-bold text-lg mb-4">Tautan Cepat</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/kategori/wanita" className="hover:text-gold transition-colors">Koleksi Wanita</Link></li>
            <li><Link href="/kategori/pria" className="hover:text-gold transition-colors">Koleksi Pria</Link></li>
            <li><Link href="/kategori/anak" className="hover:text-gold transition-colors">Koleksi Anak</Link></li>
            <li><Link href="/kategori/keluarga" className="hover:text-gold transition-colors">Sarimbit Keluarga</Link></li>
            <li><Link href="/promo" className="hover:text-gold transition-colors">Promo & Voucher</Link></li>
            <li><Link href="/artikel" className="hover:text-gold transition-colors">Artikel Islami</Link></li>
          </ul>
        </div>

        {/* Bantuan */}
        <div>
          <h3 className="font-serif font-bold text-lg mb-4">Bantuan</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/info/cara-beli" className="hover:text-gold transition-colors">Cara Membeli</Link></li>
            <li><Link href="/info/metode-bayar" className="hover:text-gold transition-colors">Metode Pembayaran</Link></li>
            <li><Link href="/info/pengiriman" className="hover:text-gold transition-colors">Info Pengiriman</Link></li>
            <li><Link href="/info/retur" className="hover:text-gold transition-colors">Kebijakan Retur</Link></li>
            <li><Link href="/info/syarat" className="hover:text-gold transition-colors">Syarat & Ketentuan</Link></li>
            <li><Link href="/info/privasi" className="hover:text-gold transition-colors">Kebijakan Privasi</Link></li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h3 className="font-serif font-bold text-lg mb-4">Hubungi Kami</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">WhatsApp</p>
                <a href="https://wa.me/6281234567890" className="hover:text-gold transition-colors">0812-3456-7890</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Email</p>
                <a href="mailto:info@naqiwear.com" className="hover:text-gold transition-colors">info@naqiwear.com</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Telepon</p>
                <span>021-1234-5678</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Alamat</p>
                <span>Jl. Islami No. 88, Jakarta Selatan, DKI Jakarta 12345</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Copyright ───────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} NAQI WEAR. Semua hak dilindungi.</p>
          <div className="flex gap-4">
            <Link href="/info/syarat" className="hover:text-white transition-colors">Syarat</Link>
            <Link href="/info/privasi" className="hover:text-white transition-colors">Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
