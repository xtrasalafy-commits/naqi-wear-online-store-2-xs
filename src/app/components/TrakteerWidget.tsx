"use client";

import { useState, useEffect } from "react";
import { Heart, X, Download, Coffee, Smartphone } from "lucide-react";
import { cn } from "@/app/lib/utils";

const DONATION_AMOUNTS = [6000, 10000, 20000, 50000];
const TRAKTEER_URL = process.env.NEXT_PUBLIC_TRAKTEER_URL || "https://trakteer.id/perpus_opera/";
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(TRAKTEER_URL)}`;
const DOWNLOAD_URL = process.env.NEXT_PUBLIC_DOWNLOAD_URL || TRAKTEER_URL;

export default function TrakteerWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed z-40 w-14 h-14 bg-emerald-dark rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-dark/90 hover:scale-110 transition-all duration-300",
          open ? "opacity-0 pointer-events-none scale-50" : "opacity-100 scale-100"
        )}
        style={{ bottom: "8rem", right: "1rem" }}
        aria-label="Trakteer"
      >
        <Heart className="w-6 h-6 text-gold fill-gold" />
      </button>

      {/* Modal Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-emerald-dark p-6 text-center">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Coffee className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-serif font-bold text-white text-lg leading-snug">
                Web app ini gratis & bebas iklan
              </h3>
              <p className="text-white/80 text-sm mt-1">
                Kopi kecil, server tetap jalan
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Donation Amounts */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Pilih nominal traktiran:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {DONATION_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setSelectedAmount(amount)}
                      className={cn(
                        "py-2 px-2 rounded-xl text-sm font-bold border-2 transition-all",
                        selectedAmount === amount
                          ? "border-emerald-dark bg-emerald-dark text-white"
                          : "border-gray-200 hover:border-emerald-dark text-gray-700 hover:bg-emerald-dark/5"
                      )}
                    >
                      Rp{(amount / 1000).toFixed(0)}K
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <div className="inline-block p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <img
                    src={QR_CODE_URL}
                    alt="QR Code Trakteer"
                    className="w-40 h-40 mx-auto"
                    loading="lazy"
                  />
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    Scan untuk traktir langsung
                  </p>
                </div>
              </div>

              {/* Trakteer Link */}
              <a
                href={TRAKTEER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-full py-3 bg-gold text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gold-light transition-colors text-sm",
                  selectedAmount && "bg-gold/90"
                )}
              >
                <Smartphone className="w-4 h-4" />
                Trakteer via Website
                {selectedAmount && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    Rp{(selectedAmount / 1000).toFixed(0)}K
                  </span>
                )}
              </a>

              {/* Download Source */}
              <div className="border-t border-gray-100 pt-4">
                <a
                  href={DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 border-2 border-gray-200 text-gray-600 font-medium rounded-xl flex items-center justify-center gap-2 hover:border-emerald-dark hover:text-emerald-dark transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Source Code
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 text-center">
              <p className="text-xs text-gray-400">
                Terima kasih atas dukungan Anda 🙏
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
