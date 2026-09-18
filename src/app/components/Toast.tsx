"use client";

import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useStore } from "@/app/lib/store-context";
import { cn } from "@/app/lib/utils";

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "animate-toast-in flex items-start gap-3 p-4 rounded-xl shadow-lg border bg-white",
            toast.type === "success" && "border-green-200",
            toast.type === "error" && "border-red-200",
            toast.type === "info" && "border-blue-200"
          )}
        >
          {toast.type === "success" && (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          )}
          {toast.type === "error" && (
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          {toast.type === "info" && (
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm text-gray-700 flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
