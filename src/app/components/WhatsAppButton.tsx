"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const message = encodeURIComponent("Halo NAQI WEAR, saya butuh bantuan :)");
  return (
    <a
      href={`https://wa.me/6281234567890?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors hover:scale-110"
      aria-label="Chat WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
}
