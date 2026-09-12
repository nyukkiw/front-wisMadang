// File untuk layout admin, mengatur tampilan sidebar dan navbar untuk halaman admin

import { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F0E6]">
      <Sidebar />

      <div className="md:ml-64">
        <Navbar />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
