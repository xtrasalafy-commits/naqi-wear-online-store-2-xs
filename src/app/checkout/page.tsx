"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Check,
  MapPin,
  Truck,
  CreditCard,
  FileText,
  MessageCircle,
} from "lucide-react";
import { useStore } from "@/app/lib/store-context";
import { formatRupiah, cn } from "@/app/lib/utils";

type Step = 1 | 2 | 3;

const COURIERS = [
  { name: "JNE", service: "Reg", cost: 15000, estimate: "2-3 hari" },
  { name: "JNE", service: "Yes", cost: 25000, estimate: "1-2 hari" },
  { name: "SiCepat", service: "Reg", cost: 13000, estimate: "2-3 hari" },
  { name: "SiCepat", service: "Halu", cost: 22000, estimate: "1 hari" },
  { name: "GoSend", service: "Instant", cost: 30000, estimate: "hari ini" },
];

const PAYMENT_METHODS = [
  { id: "qris", name: "QRIS", desc: "Bayar pakai QR Code" },
  { id: "va", name: "Virtual Account", desc: "Transfer ke VA BCA/Mandiri/BRI" },
  { id: "transfer", name: "Transfer Bank", desc: "Transfer langsung ke rekening" },
  { id: "ewallet", name: "E-Wallet", desc: "GoPay, OVO, DANA, ShopeePay" },
  { id: "cod", name: "COD", desc: "Bayar di tempat (Cash on Delivery)" },
];

interface Address {
  nama: string;
  telepon: string;
  alamat: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kodePos: string;
}

export default function CheckoutPage() {
  const { cart, cartSubtotal, cartCount, clearCart, addToast, user } = useStore();
  const [step, setStep] = useState<Step>(1);
  const [address, setAddress] = useState<Address>({
    nama: "",
    telepon: "",
    alamat: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    kodePos: "",
  });
  const [selectedCourier, setSelectedCourier] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [catatan, setCatatan] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const ongkir = COURIERS[selectedCourier]?.cost || 15000;
  const total = cartSubtotal() + ongkir;

  const handlePlaceOrder = async () => {
    if (!selectedPayment) {
      addToast("Pilih metode pembayaran", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || 2,
          items: cart.map((c) => ({
            productId: c.productId,
            variantId: c.variantId,
            nama: c.nama,
            sku: "",
            warna: c.warna,
            ukuran: c.ukuran,
            harga: c.harga,
            qty: c.qty,
          })),
          alamat: address,
          kurir: COURIERS[selectedCourier]?.name,
          layanan: COURIERS[selectedCourier]?.service,
          ongkir,
          total,
          catatan,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderNumber(data.data.nomorPesanan);
        setOrderSuccess(true);
        clearCart();
        addToast("Pesanan berhasil dibuat!", "success");
      } else {
        addToast(data.message || "Gagal membuat pesanan", "error");
      }
    } catch {
      addToast("Terjadi kesalahan, coba lagi", "error");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-3">
          Keranjang belanja kosong
        </h2>
        <Link href="/katalog" className="text-emerald-dark underline">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-10 animate-scale-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-3">
            Pesanan Berhasil! 🎉
          </h1>
          <p className="text-gray-500 mb-6">
            Terima kasih telah berbelanja di NAQI WEAR
          </p>
          <div className="bg-cream rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-500 mb-1">Nomor Pesanan Anda</p>
            <p className="text-2xl font-bold text-emerald-dark">{orderNumber}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Silakan lakukan pembayaran sesuai metode yang dipilih. Pesanan akan diproses setelah pembayaran terverifikasi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/akun/pesanan"
              className="px-6 py-3 bg-emerald-dark text-white font-bold rounded-xl hover:bg-emerald-dark/90 transition-colors"
            >
              Lihat Pesanan Saya
            </Link>
            <a
              href={`https://wa.me/6281234567890?text=Halo%20NAQI%20WEAR%2C%20saya%20baru%20pesanan%20${orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" /> Chat Admin
            </a>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: "Alamat", icon: MapPin },
    { num: 2, label: "Pengiriman & Bayar", icon: Truck },
    { num: 3, label: "Review", icon: FileText },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-emerald-dark">Beranda</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">Checkout</span>
      </nav>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                  step >= s.num
                    ? "bg-emerald-dark text-white"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {step > s.num ? <Check className="w-5 h-5" /> : s.num}
              </div>
              <span
                className={cn(
                  "text-sm font-medium hidden sm:inline",
                  step >= s.num ? "text-emerald-dark" : "text-gray-400"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "w-12 h-0.5",
                  step > s.num ? "bg-emerald-dark" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 animate-fade-in">
              <h2 className="font-serif font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-emerald-dark" />
                Alamat Pengiriman
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "nama" as const, label: "Nama Penerima", placeholder: "Nama lengkap" },
                  { key: "telepon" as const, label: "Nomor WhatsApp", placeholder: "08xxx", type: "tel" },
                  { key: "provinsi" as const, label: "Provinsi", placeholder: "DKI Jakarta" },
                  { key: "kota" as const, label: "Kota/Kabupaten", placeholder: "Jakarta Selatan" },
                  { key: "kecamatan" as const, label: "Kecamatan", placeholder: "Kebayoran Baru" },
                  { key: "kodePos" as const, label: "Kode Pos", placeholder: "12190" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      value={address[field.key]}
                      onChange={(e) =>
                        setAddress({ ...address, [field.key]: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-dark"
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Alamat Lengkap
                  </label>
                  <textarea
                    placeholder="Jalan, nomor rumah, RT/RW, patokan..."
                    value={address.alamat}
                    onChange={(e) => setAddress({ ...address, alamat: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-dark resize-none"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (!address.nama || !address.alamat) {
                    addToast("Lengkapi alamat pengiriman", "error");
                    return;
                  }
                  setStep(2);
                }}
                className="mt-6 px-8 py-3 bg-emerald-dark text-white font-bold rounded-xl hover:bg-emerald-dark/90 transition-colors"
              >
                Lanjut ke Pengiriman
              </button>
            </div>
          )}

          {/* Step 2: Shipping & Payment */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              {/* Courier Selection */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-serif font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-emerald-dark" />
                  Pilih Pengiriman
                </h2>
                <div className="space-y-3">
                  {COURIERS.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedCourier(i)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all",
                        selectedCourier === i
                          ? "border-emerald-dark bg-emerald-dark/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div>
                        <p className="font-bold text-gray-800">
                          {c.name} {c.service}
                        </p>
                        <p className="text-sm text-gray-500">Estimasi: {c.estimate}</p>
                      </div>
                      <p className="font-bold text-gold">{formatRupiah(c.cost)}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Selection */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-serif font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-emerald-dark" />
                  Metode Pembayaran
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedPayment(m.id)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all",
                        selectedPayment === m.id
                          ? "border-emerald-dark bg-emerald-dark/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div>
                        <p className="font-bold text-gray-800">{m.name}</p>
                        <p className="text-sm text-gray-500">{m.desc}</p>
                      </div>
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                          selectedPayment === m.id
                            ? "border-emerald-dark bg-emerald-dark"
                            : "border-gray-300"
                        )}
                      >
                        {selectedPayment === m.id && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Kembali
                </button>
                <button
                  onClick={() => {
                    if (!selectedPayment) {
                      addToast("Pilih metode pembayaran", "error");
                      return;
                    }
                    setStep(3);
                  }}
                  className="flex-1 px-6 py-3 bg-emerald-dark text-white font-bold rounded-xl hover:bg-emerald-dark/90 transition-colors"
                >
                  Review Pesanan
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-serif font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-emerald-dark" />
                  Review Pesanan
                </h2>

                {/* Address Summary */}
                <div className="mb-6 p-4 bg-cream rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Alamat Pengiriman</p>
                  <p className="font-bold text-gray-800">{address.nama}</p>
                  <p className="text-sm text-gray-600">
                    {address.alamat}, {address.kecamatan}, {address.kota}, {address.provinsi}{" "}
                    {address.kodePos}
                  </p>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-emerald-dark/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-dark font-bold text-xs">
                          {item.nama.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800 truncate">{item.nama}</p>
                        <p className="text-xs text-gray-500">
                          {item.warna} / {item.ukuran} × {item.qty}
                        </p>
                      </div>
                      <p className="font-bold text-sm text-gold">
                        {formatRupiah(item.harga * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Courier & Payment */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Pengiriman</p>
                    <p className="font-bold text-sm">
                      {COURIERS[selectedCourier]?.name} {COURIERS[selectedCourier]?.service}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Pembayaran</p>
                    <p className="font-bold text-sm">
                      {PAYMENT_METHODS.find((m) => m.id === selectedPayment)?.name}
                    </p>
                  </div>
                </div>

                {/* Catatan */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Catatan Pesanan (opsional)
                  </label>
                  <textarea
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Contoh: warna kalau bisa yang senada, kirim segera..."
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-dark resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Kembali
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-gold text-white font-bold rounded-xl hover:bg-gold-light transition-colors text-base disabled:opacity-50"
                >
                  {loading ? "Memproses..." : "Buat Pesanan & Bayar"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Order Summary Sidebar ─────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-28">
            <h3 className="font-serif font-bold text-lg text-gray-800 mb-4">
              Ringkasan Pesanan
            </h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({cartCount()} item)</span>
                <span className="font-medium">{formatRupiah(cartSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ongkir</span>
                <span className="font-medium">{formatRupiah(ongkir)}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-xl text-gold">{formatRupiah(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
