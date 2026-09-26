// File untuk menampilkan modal login, memanfaatkan context autentikasi, dan menampilkan form login

"use client";

import { X } from "lucide-react";
import Image from "next/image";

import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginModal() {
  const { loginModalOpen, closeLogin } = useAuth();

  if (!loginModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
      <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button type="button" onClick={closeLogin} className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900" aria-label="Tutup login">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="mb-6 pr-8">
          <Image src="/IMG Wis Madang/Wis Madang Logo.jpg" alt="Logo WIS MADANG" width={64} height={64} className="mb-4 h-16 w-16 rounded-2xl object-cover" priority />
          <h2 id="login-modal-title" className="mt-2 text-2xl font-bold text-gray-900">Masuk untuk melanjutkan</h2>
          <p className="mt-2 text-sm text-gray-500">Login diperlukan untuk menggunakan aktivitas pelanggan.</p>
        </div>

        <LoginForm onSuccess={closeLogin} onRegister={closeLogin} />
      </div>
    </div>
  );
}
