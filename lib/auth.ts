// File untuk mendefinisikan tipe data yang digunakan dalam autentikasi pengguna

export type PeranPengguna = "penjual" | "pelanggan";

export interface Sesi {
  token: string;
  nama: string;
  peran: PeranPengguna;
  email?: string;
}
