// File untuk menampilkan form login dan memanfaatkan context autentikasi

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, Role } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [nama, setNama] = useState("");
  const [peran, setPeran] = useState<Role>("pelanggan");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!nama.trim()) {
      alert("Nama harus diisi");
      return;
    }

    login(nama, peran);

    if (peran === "pelanggan") {
      router.push("/pelanggan");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-700">Wis Madang</h1>

          <p className="mt-2 text-sm text-gray-500">Silakan masuk untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Nama</label>

            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Masuk sebagai</label>

            <select value={peran} onChange={(e) => setPeran(e.target.value as Role)} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100">
              <option value="pelanggan">Pelanggan</option>
              <option value="kasir">Kasir</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Button */}
          <button type="submit" className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 active:scale-[0.99]">
            Masuk
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">Demo autentikasi — belum menggunakan backend</p>
      </div>
    </div>
  );
}
