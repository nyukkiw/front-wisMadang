// File untuk layout admin, membungkus konten halaman admin dengan komponen AdminLayout

import { ReactNode } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

