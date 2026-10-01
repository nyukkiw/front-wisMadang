// File untuk mengelola sesi login pengguna (token, nama, peran) di seluruh aplikasi

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { Session, UserRole } from "@/lib/auth";
import { logoutKeServer } from "@/lib/api";
import LoginModal from "@/components/auth/LoginModal";

interface AuthContextType {
  session: Session | null;
  login: (session: Session, ingatSaya?: boolean) => void;
  logout: () => Promise<void>;
  loginModalOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "wis_madang_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);

      if (savedSession) {
        // peran disimpan sebagai string bebas karena sesi lama bisa saja masih berisi role lama ("admin"/"kasir")
        const parsed = JSON.parse(savedSession) as Omit<Session, "peran"> & { peran: string };
        const migratedRole: UserRole = parsed.peran === "admin" || parsed.peran === "kasir" ? "penjual" : (parsed.peran as UserRole);

        setSession({ ...parsed, peran: migratedRole });

        const penyimpanan = localStorage.getItem(SESSION_KEY) ? localStorage : sessionStorage;
        penyimpanan.setItem(SESSION_KEY, JSON.stringify({ ...parsed, peran: migratedRole }));
      }
    } catch (error) {
      console.error("Gagal membaca session:", error);

      localStorage.removeItem(SESSION_KEY);
    }

    setLoading(false);
  }, []);

  const login = (newSession: Session, ingatSaya: boolean = true) => {
    setSession(newSession);

    // "Ingat saya" dicentang -> localStorage (tetap tersimpan walau browser ditutup).
    // Tidak dicentang -> sessionStorage (hilang begitu tab/browser ditutup).
    const penyimpanan = ingatSaya ? localStorage : sessionStorage;
    const penyimpananLain = ingatSaya ? sessionStorage : localStorage;

    penyimpananLain.removeItem(SESSION_KEY);
    penyimpanan.setItem(SESSION_KEY, JSON.stringify(newSession));

    /*
     * Cookie ini digunakan oleh Middleware.
     * Middleware tidak dapat membaca React Context
     * atau localStorage/sessionStorage.
     * Tanpa "ingat saya", cookie dibuat jadi session cookie (ikut hilang saat browser ditutup).
     */

    const umurCookie = ingatSaya ? "max-age=86400; " : "";

    document.cookie = `wis_madang_token=${newSession.token}; path=/; ${umurCookie}SameSite=Lax`;

    document.cookie = `wis_madang_role=${newSession.peran}; path=/; ${umurCookie}SameSite=Lax`;

    setWelcomeMessage(`Selamat datang di Wis Madang, ${newSession.nama}!`);
    window.setTimeout(() => setWelcomeMessage(""), 3500);
  };

  const logout = async () => {
    if (session) {
      try {
        await logoutKeServer(session.token);
      } catch (error) {
        console.error("Gagal memberitahu server soal logout:", error);
      }
    }

    setSession(null);

    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);

    document.cookie = "wis_madang_token=; path=/; max-age=0";

    document.cookie = "wis_madang_role=; path=/; max-age=0";
  };

  const openLogin = () => setLoginModalOpen(true);
  const closeLogin = () => setLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        logout,
        loginModalOpen,
        openLogin,
        closeLogin,
        loading,
      }}
    >
      {children}
      <LoginModal />
      {welcomeMessage && (
        <div className="fixed right-4 top-20 z-50 max-w-sm rounded-xl bg-[#174C4F] px-5 py-4 text-sm font-semibold text-white shadow-xl" role="status">
          {welcomeMessage}
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }

  return context;
}
