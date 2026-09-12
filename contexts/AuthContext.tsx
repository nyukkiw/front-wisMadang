// File untuk menyimpan context untuk autentikasi pengguna (token, nama, peran, Login(), logout())

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Role = "admin" | "kasir" | "pelanggan";

interface UserSession {
  token: string;
  nama: string;
  peran: Role;
}

interface AuthContextType {
  session: UserSession | null;
  login: (nama: string, peran: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);

  // Mengambil session dari localStorage ketika aplikasi pertama kali dibuka
  useEffect(() => {
    const savedSession = localStorage.getItem("wis-madang-session");

    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  const login = (nama: string, peran: Role) => {
    const newSession: UserSession = {
      token: `dummy-token-${Date.now()}`,
      nama,
      peran,
    };

    setSession(newSession);

    // Simpan session tiruan di browser
    localStorage.setItem("wis-madang-session", JSON.stringify(newSession));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("wis-madang-session");
  };

  return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }

  return context;
}
