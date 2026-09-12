// File untuk halaman pelanggan, menampilkan konten khusus untuk pelanggan

"use client";

import { useAuth } from "@/context/AuthContext";

export default function PelangganPage() {
  const { session, logout } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Halo, {session?.nama}! 👋</h1>

        <p className="mt-2 text-gray-600">Selamat datang di Wis Madang.</p>

        <button onClick={logout} className="mt-6 rounded-lg bg-red-500 px-5 py-2 text-white hover:bg-red-600">
          Logout
        </button>
      </div>
    </main>
  );
}
