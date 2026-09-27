// File untuk menampilkan form login dan memanfaatkan context autentikasi

"use client";

import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { dummyUsers } from "@/data/dummyData";
import { useAuth } from "./AuthProvider";

interface LoginFormProps {
  onSuccess?: () => void;
  onRegister?: () => void;
}

export default function LoginForm({ onSuccess, onRegister }: LoginFormProps) {
  const router = useRouter();

  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    // Simulasi proses login
    await new Promise((resolve) => setTimeout(resolve, 800));

    const registeredUsers = JSON.parse(localStorage.getItem("wis-madang-registered-users") ?? "[]");
    const users = [...dummyUsers, ...registeredUsers];
    const user = users.find((item) => (item.email === identifier.trim() || item.name.toLowerCase() === identifier.trim().toLowerCase()) && item.password === password);

    if (!user) {
      setError("Username/email atau password yang Anda masukkan salah.");

      setLoading(false);
      return;
    }

    const session = {
      token: `dummy-token-${user.id}-${Date.now()}`,
      nama: user.name,
      peran: user.role as "penjual" | "pelanggan",
      email: user.email,
    };

    login(session);

    setLoading(false);

    if (onSuccess) {
      onSuccess();
      return;
    }

    if (user.role === "penjual") {
      router.push("/admin");
    } else {
      router.push("/pelanggan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
      <div>
        <label htmlFor="identifier" className="mb-2 block text-sm font-semibold text-gray-800">
          Email atau nama pengguna
        </label>

        <input
          id="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Masukkan email atau nama pengguna"
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-teal-700"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-800">
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-900 placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-teal-700"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 hover:text-gray-800"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
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

      <p className="text-center text-sm text-gray-600">
        Belum punya akun?{" "}
        <Link href="/register" onClick={onRegister} className="font-semibold text-[#174C4F] hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
}
