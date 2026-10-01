// File untuk memanggil endpoint backend Laravel (auth)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export type ApiPeran = "pelanggan" | "penjual";

export interface ApiPengguna {
  id: number;
  nama: string;
  email: string;
  no_telepon: string | null;
  peran: ApiPeran;
  dibuat_pada: string;
}
export interface RegisterPayload {
  nama: string;
  email: string;
  kata_sandi: string;
  peran: ApiPeran;
  no_telepon?: string;
}

interface AuthResponse {
  pesan: string;
  pengguna: ApiPengguna;
  token: string;
}

interface ApiErrorBody {
  pesan?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorBody = body as ApiErrorBody;
    const message = errorBody.pesan ?? errorBody.message ?? "Terjadi kesalahan pada server.";

    throw new ApiError(message, response.status, errorBody.errors);
  }

  return body as T;
}

// Susun header request pakai token yang sudah ada, dipakai untuk endpoint yang wajib login
export function susunHeaderPakaiToken(token: string) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function loginRequest(identifier: string, kataSandi: string) {
  const trimmedIdentifier = identifier.trim();
  const isEmail = trimmedIdentifier.includes("@");

  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      [isEmail ? "email" : "nama"]: trimmedIdentifier,
      kata_sandi: kataSandi,
    }),
  });

  return handleResponse<AuthResponse>(response);
}



export async function registerRequest(payload: RegisterPayload) {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse<AuthResponse>(response);
}

export async function logoutKeServer(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/logout`, {
    method: "POST",
    headers: susunHeaderPakaiToken(token),
  });

  return handleResponse<{ pesan: string }>(response);
}

export interface ApiKategori {
  id: number;
  nama_kategori: string;
}

export async function ambilDaftarKategori() {
  const response = await fetch(`${API_BASE_URL}/api/kategori`, {
    headers: { Accept: "application/json" },
  });

  return handleResponse<ApiKategori[]>(response);
}

export interface ApiMenu {
  id: number;
  kategori_id: number;
  nama_menu: string;
  harga: string;
  deskripsi: string | null;
  status_stok: "tersedia" | "habis";
  kategori: {
    id: number;
    nama_kategori: string;
  };
  gambar_url: string | null;
  // Cuma ada kalau diambil dari GET /api/menu (bukan pas nempel di detail pesanan)
  ulasan_avg_rating?: string | null;
  ulasan_count?: number;
}

export async function ambilDaftarMenu() {
  const response = await fetch(`${API_BASE_URL}/api/menu`, {
    headers: { Accept: "application/json" },
  });

  return handleResponse<ApiMenu[]>(response);
}

export interface ApiPaketCatering {
  id: number;
  nama_paket: string;
  harga_paket: string;
  porsi: number;
  deskripsi: string | null;
  gambar_url: string | null;
  status_stok: "tersedia" | "habis";
  // Cuma ada kalau diambil dari GET /api/paket-catering (bukan pas nempel di detail pesanan)
  ulasan_avg_rating?: string | null;
  ulasan_count?: number;
}

export async function ambilDaftarPaketCatering() {
  const response = await fetch(`${API_BASE_URL}/api/paket-catering`, {
    headers: { Accept: "application/json" },
  });

  return handleResponse<ApiPaketCatering[]>(response);
}

export interface MenuPayload {
  kategori_id?: number;
  nama_menu?: string;
  harga?: number;
  deskripsi?: string;
  status_stok?: "tersedia" | "habis";
}

export async function buatMenu(token: string, payload: MenuPayload) {
  const response = await fetch(`${API_BASE_URL}/api/menu`, {
    method: "POST",
    headers: susunHeaderPakaiToken(token),
    body: JSON.stringify(payload),
  });

  return handleResponse<ApiMenu>(response);
}

export async function ubahMenu(token: string, id: number, payload: MenuPayload) {
  const response = await fetch(`${API_BASE_URL}/api/menu/${id}`, {
    method: "PUT",
    headers: susunHeaderPakaiToken(token),
    body: JSON.stringify(payload),
  });

  return handleResponse<ApiMenu>(response);
}

export async function hapusMenu(token: string, id: number) {
  const response = await fetch(`${API_BASE_URL}/api/menu/${id}`, {
    method: "DELETE",
    headers: susunHeaderPakaiToken(token),
  });

  return handleResponse<{ pesan: string }>(response);
}

export interface PaketCateringPayload {
  nama_paket?: string;
  harga_paket?: number;
  deskripsi?: string;
  porsi?: number;
  status_stok?: "tersedia" | "habis";
}

export async function buatPaketCatering(token: string, payload: PaketCateringPayload) {
  const response = await fetch(`${API_BASE_URL}/api/paket-catering`, {
    method: "POST",
    headers: susunHeaderPakaiToken(token),
    body: JSON.stringify(payload),
  });

  return handleResponse<ApiPaketCatering>(response);
}

export async function ubahPaketCatering(token: string, id: number, payload: PaketCateringPayload) {
  const response = await fetch(`${API_BASE_URL}/api/paket-catering/${id}`, {
    method: "PUT",
    headers: susunHeaderPakaiToken(token),
    body: JSON.stringify(payload),
  });

  return handleResponse<ApiPaketCatering>(response);
}

export async function hapusPaketCatering(token: string, id: number) {
  const response = await fetch(`${API_BASE_URL}/api/paket-catering/${id}`, {
    method: "DELETE",
    headers: susunHeaderPakaiToken(token),
  });

  return handleResponse<{ pesan: string }>(response);
}

// File gambar dikirim lewat FormData, jadi header-nya gak boleh ada Content-Type
// (browser yang otomatis ngisi itu sendiri, lengkap dengan boundary-nya)
function susunHeaderUploadFile(token: string) {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function uploadGambarMenu(token: string, id: number, file: File) {
  const formData = new FormData();
  formData.append("gambar", file);

  const response = await fetch(`${API_BASE_URL}/api/menu/${id}/gambar`, {
    method: "POST",
    headers: susunHeaderUploadFile(token),
    body: formData,
  });

  return handleResponse<ApiMenu>(response);
}

export async function uploadGambarPaketCatering(token: string, id: number, file: File) {
  const formData = new FormData();
  formData.append("gambar", file);

  const response = await fetch(`${API_BASE_URL}/api/paket-catering/${id}/gambar`, {
    method: "POST",
    headers: susunHeaderUploadFile(token),
    body: formData,
  });

  return handleResponse<ApiPaketCatering>(response);
}

export interface ApiIsiKeranjang {
  id: number;
  keranjang_id: number;
  menu_id: number | null;
  paket_id: number | null;
  jumlah: number;
  menu: ApiMenu | null;
  paket_catering: ApiPaketCatering | null;
}

interface ApiResponseKeranjang {
  success: boolean;
  message: string;
  data:
    | []
    | {
        id: number;
        pengguna_id: number;
        diperbarui_pada: string;
        isi_keranjang: ApiIsiKeranjang[];
      };
}

export async function ambilKeranjang(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/keranjang`, {
    headers: susunHeaderPakaiToken(token),
  });

  const hasil = await handleResponse<ApiResponseKeranjang>(response);

  return Array.isArray(hasil.data) ? [] : hasil.data.isi_keranjang;
}

export type AksiKeranjang = "tambah" | "kurangi" | "hapus";

export interface UbahKeranjangPayload {
  menu_id?: number;
  paket_id?: number;
  jumlah: number;
  aksi: AksiKeranjang;
}

interface ApiResponseUbahKeranjang {
  success: boolean;
  message: string;
  data?: ApiIsiKeranjang;
}

export async function ubahKeranjang(token: string, payload: UbahKeranjangPayload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/keranjang/simpan`, {
    method: "POST",
    headers: susunHeaderPakaiToken(token),
    body: JSON.stringify(payload),
  });

  return handleResponse<ApiResponseUbahKeranjang>(response);
}

export interface HasilCheckout {
  nomor_pesanan: string;
  subtotal: number;
  pajak_10: number;
  total_akhir: number;
  snap_token: string;
}

interface ApiResponseCheckout {
  success: boolean;
  message: string;
  data: HasilCheckout;
}

// Langkah 1: cuma hitung total & minta Snap Token, belum menyimpan pesanan apapun.
// Metode pembayaran belum ditentukan di sini - baru dipilih pengguna di dalam popup Midtrans.
export async function checkoutRequest(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/pesanan/checkout`, {
    method: "POST",
    headers: susunHeaderPakaiToken(token),
  });

  const hasil = await handleResponse<ApiResponseCheckout>(response);

  return hasil.data;
}

export type StatusKonfirmasiPembayaran = "diproses" | "menunggu_pembayaran";

// Langkah 2: baru dipanggil setelah popup Midtrans bilang sukses/pending. Ini yang beneran menyimpan pesanan & mengosongkan keranjang.
export async function konfirmasiPembayaranRequest(token: string, nomorPesanan: string, metodePembayaran: string, status: StatusKonfirmasiPembayaran) {
  const response = await fetch(`${API_BASE_URL}/api/v1/pesanan/konfirmasi`, {
    method: "POST",
    headers: susunHeaderPakaiToken(token),
    body: JSON.stringify({ nomor_pesanan: nomorPesanan, metode_pembayaran: metodePembayaran, status }),
  });

  return handleResponse<{ success: boolean; message: string }>(response);
}

export interface ApiDetailPesanan {
  id: number;
  pesanan_id: string;
  menu_id: number | null;
  paket_id: number | null;
  jumlah: number;
  harga_satuan_saat_transaksi: string;
  menu: ApiMenu | null;
  paket_catering: ApiPaketCatering | null;
}

export interface ApiUlasan {
  id: number;
  pesanan_id: string;
  menu_id: number | null;
  paket_id: number | null;
  rating: number;
  komentar: string | null;
  sentimen_ai: string | null;
  dibuat_pada: string;
}

export interface ApiPesanan {
  id: string;
  subtotal: string;
  pajak_10: string;
  total_bayar: string;
  metode_pembayaran: string;
  status_pesanan: string;
  dibuat_pada: string;
  detail_pesanan: ApiDetailPesanan[];
  ulasan: ApiUlasan[];
}

export async function ambilRiwayatPesanan(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/pesanan`, {
    headers: susunHeaderPakaiToken(token),
  });

  const hasil = await handleResponse<{ success: boolean; data: ApiPesanan[] }>(response);

  return hasil.data;
}

// Bentuk ulasan yang dipakai khusus di dashboard admin - lengkap sama info menu/paket & nama pelanggan
export interface ApiUlasanLengkap extends ApiUlasan {
  menu: ApiMenu | null;
  paket_catering: ApiPaketCatering | null;
  pesanan: {
    id: string;
    pengguna: ApiPengguna;
  };
}

// Khusus penjual (admin): lihat semua ulasan dari semua pelanggan, buat dashboard AI Insight
export async function ambilSemuaUlasan(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/ulasan`, {
    headers: susunHeaderPakaiToken(token),
  });

  const hasil = await handleResponse<{ success: boolean; data: ApiUlasanLengkap[] }>(response);

  return hasil.data;
}

export interface InsightAi {
  topik_utama: string;
  ringkasan: string;
  sinyal_utama: string;
  saran_aksi: string;
}

// Khusus penjual (admin): minta AI bikin ringkasan, sinyal utama, & saran aksi dari semua ulasan sekaligus.
// Balikin null kalau belum cukup data / AI-nya gagal (bukan error, biar frontend bisa tampilin pesan yang sesuai).
export async function ambilInsightAi(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/ulasan/insight`, {
    headers: susunHeaderPakaiToken(token),
  });

  const hasil = await handleResponse<{ success: boolean; message?: string; data?: InsightAi }>(response);

  return hasil.success ? (hasil.data ?? null) : null;
}

export interface RingkasanDashboard {
  omzet_hari_ini: number;
  total_pesanan_hari_ini: number;
}

// Khusus penjual (admin): ringkasan omzet & jumlah pesanan hari ini, buat kartu statistik dashboard
export async function ambilRingkasanDashboard(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/ringkasan`, {
    headers: susunHeaderPakaiToken(token),
  });

  const hasil = await handleResponse<{ success: boolean; data: RingkasanDashboard }>(response);

  return hasil.data;
}

export interface UlasanItemPayload {
  menu_id?: number;
  paket_id?: number;
  rating: number;
  komentar?: string;
}

export async function kirimUlasanRequest(token: string, pesananId: string, ulasan: UlasanItemPayload[]) {
  const response = await fetch(`${API_BASE_URL}/api/v1/ulasan`, {
    method: "POST",
    headers: susunHeaderPakaiToken(token),
    body: JSON.stringify({ pesanan_id: pesananId, ulasan }),
  });

  return handleResponse<{ success: boolean; message: string }>(response);
}
