// File untuk halaman login, menampilkan form login dan memanfaatkan context autentikasi

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <LoginForm />
    </main>
  );
}
