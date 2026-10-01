# Wis Madang — Frontend

Aplikasi web untuk Wis Madang (cafe & catering), dibangun dengan Next.js 16 (App Router). Mencakup halaman pelanggan (katalog, keranjang, checkout, ulasan), halaman kasir/POS, dan halaman admin (dashboard, kelola menu, analisis ulasan).

Frontend ini **butuh backend yang sudah jalan** untuk bisa dipakai — semua data (menu, pesanan, dll) diambil dari sana. Backend-nya ada di repo terpisah: **[back-wisMadang](https://github.com/nyukkiw/back-wisMadang)**. Jalankan backend itu dulu, baru lanjut ke langkah di bawah.

## Yang dibutuhkan sebelum mulai

- Node.js 20 atau lebih baru
- Backend [back-wisMadang](https://github.com/nyukkiw/back-wisMadang) sudah jalan di `http://127.0.0.1:8000` (ikuti README di repo tersebut)

## 1. Install dependency

```bash
npm install
```

## 2. Siapkan file environment

```bash
cp .env.example .env.local
```

Buka `.env.local`, isi `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` dengan Client Key Midtrans Sandbox yang **sama persis** dengan `MIDTRANS_CLIENT_KEY` di `.env` backend. `NEXT_PUBLIC_API_URL` bisa dibiarkan default kalau backend dijalankan dengan cara standar (`php artisan serve`).

## 3. Jalankan aplikasi

```bash
npm run dev
```

Buka `http://localhost:3000` di browser. **Pastikan tetap di port 3000** — pengaturan CORS di backend cuma mengizinkan alamat ini.

## Mulai dari mana?

- **Sebagai pelanggan**: buka halaman utama, klik "Masuk / Daftar", lalu daftar akun baru.
- **Sebagai penjual (admin/kasir)**: login pakai akun contoh `penjual@wismadang.com` / `penjual123` (akun ini dibuat otomatis lewat seeder backend — lihat README backend). Setelah login akan diarahkan ke dashboard admin, bisa akses Kelola Menu, Kasir, Analisis Ulasan, dll lewat sidebar.

## Catatan

- Pembayaran memakai Midtrans Sandbox — tidak ada transaksi uang asli. Kartu uji & cara simulasinya ada di README backend.
- Fitur analisis sentimen & insight AI pada ulasan butuh `EDGEONE_AI_API_KEY` terisi di backend. Kalau tidak diisi, aplikasi tetap jalan normal, cuma bagian AI-nya kosong.
