// File untuk halaman dashboard admin, menampilkan ringkasan bisnis WIS MADANG

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#174C4F]">Dashboard</h1>

      <p className="mt-2 text-gray-500">Ringkasan bisnis WIS MADANG hari ini.</p>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Omzet Hari Ini</p>

          <h2 className="mt-2 text-2xl font-bold">Rp2.450.000</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Pesanan</p>

          <h2 className="mt-2 text-2xl font-bold">48</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Customer Rating</p>

          <h2 className="mt-2 text-2xl font-bold">★ 4.8</h2>
        </div>
      </div>
    </div>
  );
}
