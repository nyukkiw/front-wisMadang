"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { dummyUsers } from "@/data/dummyData";
import { useAuth } from "./AuthProvider";

export default function SellerLoginForm() {
  const router = useRouter();

  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");

  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    /*
     * Validasi field
     */

    if (!identifier.trim()) {
      setError("Email atau username wajib diisi.");
      return;
    }

    if (!password.trim()) {
      setError("Password wajib diisi.");
      return;
    }

    setLoading(true);

    /*
     * Simulasi request API.
     * Nantinya diganti:
     * POST /auth/seller/login
     */

    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = dummyUsers.find((item) => (item.name === identifier || item.email === identifier) && item.password === password);
    /*
     * Pastikan hanya seller yang boleh
     * menggunakan halaman ini.
     */

    if (!user || (user.role !== "admin" && user.role !== "kasir")) {
      setError("Akun seller tidak ditemukan atau data login salah.");

      setLoading(false);
      return;
    }

    const session = {
      token: `dummy-seller-token-${user.id}-${Date.now()}`,

      nama: user.name,

      peran: user.role as "admin" | "kasir",

      email: user.email,
    };

    login(session);

    setLoading(false);

    router.push("/admin");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="identifier" className="mb-2 block text-sm font-medium text-gray-700">
          Email / Username
        </label>

        <input
          id="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Masukkan email atau username"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#174C4F] focus:ring-2 focus:ring-[#174C4F]/20"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan password"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#174C4F] focus:ring-2 focus:ring-[#174C4F]/20"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-2">
        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4" />

        <span className="text-sm text-gray-600">Ingat saya</span>
      </label>

      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#E9785F] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
