"use client";

import { StoreProvider } from "@/app/lib/store-context";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import BottomNav from "@/app/components/BottomNav";
import ToastContainer from "@/app/components/Toast";
import WhatsAppButton from "@/app/components/WhatsAppButton";
import TrakteerWidget from "@/app/components/TrakteerWidget";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
        <ToastContainer />
        <WhatsAppButton />
        <TrakteerWidget />
      </div>
    </StoreProvider>
  );
}
