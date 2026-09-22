// File untuk mendefinisikan tipe data yang digunakan dalam autentikasi pengguna

export type UserRole = "penjual" | "pelanggan";

export interface Session {
  token: string;
  nama: string;
  peran: UserRole;
  email?: string;
}
