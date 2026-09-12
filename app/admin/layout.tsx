// Layout untuk halaman admin, termasuk Sidebar dan Navbar

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="md:ml-64">
        <Navbar />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
