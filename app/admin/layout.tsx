// Layout untuk halaman seller, termasuk Sidebar dan Navbar

"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/seller");
    }
  }, [loading, router, session]);

  if (loading || !session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FCF9F6] text-[#2C2520]">
      <Sidebar role={session.peran} isOpen={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />

      <div className={`transition-[margin] duration-300 ${sidebarOpen ? "md:ml-56" : "md:ml-0"}`}>
        <Navbar role={session.peran} nama={session.nama} sidebarOpen={sidebarOpen} onMenuToggle={() => setSidebarOpen((open) => !open)} />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
