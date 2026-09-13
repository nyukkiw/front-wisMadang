"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "./AuthProvider";

export default function BuyerAuth() {
  const router = useRouter();

  const { login } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");

  const [nama, setNama] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (mode === "register" && !nama.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    if (!email.includes("@")) {
      setError("Format email tidak valid.");
      return;
    }

    if (!password.trim()) {
      setError("Password wajib diisi.");
      return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    /*
     * Dummy buyer authentication.
     *
     * Nanti iganti dengan API Laravel.
     */

    const buyerName = mode === "register" ? nama : "Pelanggan WIS MADANG";

    const session = {
      token: `dummy-buyer-token-${Date.now()}`,

      nama: buyerName,

      peran: "pelanggan" as const,

      email,
    };

    login(session);

    setLoading(false);

    router.push("/");
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
      <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
        <button onClick={() => setMode("login")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium ${mode === "login" ? "bg-white shadow-sm" : "text-gray-500"}`}>
          Masuk
        </button>

        <button onClick={() => setMode("register")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium ${mode === "register" ? "bg-white shadow-sm" : "text-gray-500"}`}>
          Daftar
        </button>
      </div>

      <h2 className="text-2xl font-bold text-[#174C4F]">{mode === "login" ? "Selamat datang kembali" : "Buat akun WIS MADANG"}</h2>

      <p className="mt-2 text-sm text-gray-500">{mode === "login" ? "Masuk untuk melihat pesanan dan ulasan Anda." : "Daftar untuk menyimpan aktivitas pesanan Anda."}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === "register" && <input type="text" placeholder="Nama lengkap" value={nama} onChange={(e) => setNama(e.target.value)} className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#174C4F]/20" />}

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#174C4F]/20" />

        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#174C4F]/20" />

        {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#E9785F] px-4 py-3 font-semibold text-white disabled:opacity-60">
          {loading ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
        </button>
      </form>
    </div>
  );
}
