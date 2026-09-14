// File untuk menampilkan form login dan memanfaatkan context autentikasi

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { dummyUsers } from "@/data/dummyData";
import { useAuth } from "./AuthProvider";

export default function LoginForm() {
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
    setLoading(true);

    // Simulasi proses login
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = dummyUsers.find((item) => item.email === identifier && item.password === password);

    if (!user) {
      setError("Username/email atau password yang Anda masukkan salah.");

      setLoading(false);
      return;
    }

    const session = {
      token: `dummy-token-${user.id}-${Date.now()}`,
      nama: user.name,
      peran: user.role as "admin" | "kasir" | "pelanggan",
    };

    login(session);

    setLoading(false);

    // Redirect halaman dashboard berdasarkan role
    if (user.role === "admin") {
      router.push("/admin");
    } else if (user.role === "kasir") {
      router.push("/admin/kasir");
    } else {
      router.push("/pelanggan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
      <div>
        <label htmlFor="identifier" className="mb-2 block text-sm font-medium">
          Email
        </label>

        <input
          id="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Masukkan email"
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-teal-700"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan password"
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-teal-700"
        />
      </div>

      <div className="flex items-center gap-2">
        <input id="remember" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4" />

        <label htmlFor="remember" className="text-sm text-gray-600">
          Ingat saya
        </label>
      </div>

      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#E9785F] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
