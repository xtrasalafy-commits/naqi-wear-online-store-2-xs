"use client";

import { useState, useEffect } from "react";
import { Users, Mail, Phone } from "lucide-react";
import { formatDate } from "@/app/lib/utils";

interface Customer {
  id: number;
  nama: string;
  email: string | null;
  nomorWa: string | null;
  role: string;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(() => {
        // For now, we use a simple approach - we need a dedicated endpoint
        // Let's use the stats endpoint for demo
      })
      .finally(() => setLoading(false));
  }, []);

  // Sample data for demo
  const sampleCustomers: Customer[] = [
    { id: 2, nama: "Siti Rahmawati", email: "siti@email.com", nomorWa: "081234567891", role: "customer", createdAt: new Date().toISOString() },
    { id: 3, nama: "Ahmad Fauzi", email: "ahmad@email.com", nomorWa: "081234567892", role: "customer", createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 4, nama: "Fatimah Azzahra", email: "fatimah@email.com", nomorWa: "081234567893", role: "customer", createdAt: new Date(Date.now() - 172800000).toISOString() },
  ];

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-gray-800 mb-6">Manajemen Pelanggan</h1>

      {loading ? (
        <div className="bg-white rounded-2xl p-6 skeleton h-64" />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Pelanggan</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Kontak</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Role</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-500">Bergabung</th>
                </tr>
              </thead>
              <tbody>
                {sampleCustomers.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-dark/10 rounded-full flex items-center justify-center">
                          <span className="text-emerald-dark font-bold text-sm">
                            {c.nama.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{c.nama}</p>
                          <p className="text-xs text-gray-400">ID: {c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-600 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> {c.email}
                      </p>
                      {c.nomorWa && (
                        <p className="text-gray-600 flex items-center gap-1 mt-1">
                          <Phone className="w-3.5 h-3.5" /> {c.nomorWa}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          c.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {c.role === "admin" ? "Admin" : "Pelanggan"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-xs">
                      {formatDate(c.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
