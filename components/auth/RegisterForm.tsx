"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { dummyUsers } from "@/data/dummyData";
import { useAuth } from "@/components/auth/AuthProvider";

interface RegisteredUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "pelanggan";
}

export default function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!name.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!normalizedEmail.includes("@")) {
      setError("Format email tidak valid.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    const savedUsers: RegisteredUser[] = JSON.parse(localStorage.getItem("wis-madang-registered-users") ?? "[]");
    const emailExists = [...dummyUsers, ...savedUsers].some((user) => user.email.toLowerCase() === normalizedEmail);

    if (emailExists) {
      setError("Email sudah terdaftar. Silakan gunakan email lain atau masuk.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    const newUser: RegisteredUser = {
      id: Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "pelanggan",
    };

    localStorage.setItem("wis-madang-registered-users", JSON.stringify([...savedUsers, newUser]));
    login({
      token: `dummy-token-${newUser.id}`,
      nama: newUser.name,
      peran: newUser.role,
      email: newUser.email,
    });
    setLoading(false);
    router.push("/pelanggan");
  };

  return (
    <main className="min-h-screen bg-[#F5F0E6] px-6 py-12">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <Image src="/IMG Wis Madang/Wis Madang Logo.jpg" alt="Logo WIS MADANG" width={80} height={80} className="mx-auto mb-4 h-20 w-20 rounded-3xl object-cover" priority />
          <h1 className="text-2xl font-bold text-gray-900">Buat akun WIS MADANG</h1>
          <p className="mt-2 text-sm text-gray-500">Daftar untuk menyimpan aktivitas pesanan Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="register-name" className="mb-2 block text-sm font-semibold text-gray-800">Nama lengkap</label>
            <input id="register-name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Masukkan nama lengkap" required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-teal-700" />
          </div>

          <div>
            <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-gray-800">Email</label>
            <input id="register-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Masukkan email" required className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-teal-700" />
          </div>

          <div>
            <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-gray-800">Password</label>
            <div className="relative">
              <input id="register-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimal 6 karakter" required className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-900 outline-none focus:ring-2 focus:ring-teal-700" />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 hover:text-gray-800" aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}>
                {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="register-password-confirmation" className="mb-2 block text-sm font-semibold text-gray-800">Konfirmasi password</label>
            <div className="relative">
              <input id="register-password-confirmation" type={showPasswordConfirmation ? "text" : "password"} value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} placeholder="Ulangi password" required className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-900 outline-none focus:ring-2 focus:ring-teal-700" />
              <button type="button" onClick={() => setShowPasswordConfirmation((visible) => !visible)} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 hover:text-gray-800" aria-label={showPasswordConfirmation ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}>
                {showPasswordConfirmation ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#E9785F] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun? <Link href="/login" className="font-semibold text-[#174C4F] hover:underline">Masuk sekarang</Link>
        </p>
      </div>
    </main>
  );
}
