// File untuk layout halaman pelanggan, termasuk sidebar dan navbar

"use client";

import { useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((open) => !open);
  };

  return (
    <div className="min-h-screen bg-[#FCF9F6] text-[#2C2520]">
      <Sidebar role="pelanggan" isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className={`transition-[margin] duration-300 ${sidebarOpen ? "md:ml-56" : "md:ml-0"}`}>
        <Navbar role="pelanggan" nama={session?.nama} sidebarOpen={sidebarOpen} onMenuToggle={toggleSidebar} />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
