// File untuk halaman login, menampilkan form login dan informasi akun demo

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E6]">
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mb-4 text-3xl font-bold text-[#174C4F]">WIS MADANG?</div>

            <h1 className="text-2xl font-bold text-gray-900">Masuk ke WIS MADANG</h1>

            <p className="mt-2 text-sm text-gray-500">Nek Luwe madang lurr!</p>
          </div>

          <LoginForm />

          <div className="mt-6 rounded-xl bg-[#EAF2ED] p-4 text-sm text-gray-600">
            <p className="font-semibold">Akun Demo</p>

            <p className="mt-2">Admin: admin@wismadang.com / admin123</p>

            <p>Kasir: budi@wismadang.com / budi123</p>

            <p>Pelanggan: nyuk@gmail.com/ Nyuk123</p>
          </div>
        </div>
      </div>
    </main>
  );
}
