// File untuk menampilkan halaman login seller (kasir)

import SellerLoginForm from "@/components/auth/SellerLoginForm";

export default function SellerLoginPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E6]">
      <div className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
          {/* Branding */}
          <div className="hidden bg-[#174C4F] p-10 text-white md:flex md:flex-col md:justify-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-white/60">Seller Panel</p>

            <h1 className="text-4xl font-bold">WIS MADANG</h1>

            <p className="mt-4 leading-relaxed text-white/70">Kelola pesanan, menu, transaksi, dan insight bisnis kuliner Anda dalam satu tempat.</p>
          </div>

          {/* Login */}
          <div className="p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Masuk ke WIS MADANG</h2>

              <p className="mt-2 text-sm text-gray-500">Masuk sebagai Admin atau Kasir.</p>
            </div>

            <SellerLoginForm />

            <div className="mt-6 rounded-xl bg-[#EAF2ED] p-4 text-sm text-gray-600">
              <p className="font-semibold">Akun Demo</p>

              <p className="mt-2">Admin: admin@wismadang.com / admin123</p>

              <p>Kasir: budi@wismadang.com / budi123</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
