// File untuk menyimpan data dummy sebelum ada data aseli

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { Session } from "@/lib/auth";
import LoginModal from "@/components/auth/LoginModal";

interface AuthContextType {
  session: Session | null;
  login: (session: Session) => void;
  logout: () => void;
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
      const savedSession = localStorage.getItem(SESSION_KEY);

      if (savedSession) {
        const parsed: Session = JSON.parse(savedSession);
        const migratedRole = parsed.peran === "admin" || parsed.peran === "kasir" ? "penjual" : parsed.peran;

        setSession({ ...parsed, peran: migratedRole });
        localStorage.setItem(SESSION_KEY, JSON.stringify({ ...parsed, peran: migratedRole }));
      }
    } catch (error) {
      console.error("Gagal membaca session:", error);

      localStorage.removeItem(SESSION_KEY);
    }

    setLoading(false);
  }, []);

  const login = (newSession: Session) => {
    setSession(newSession);

    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));

    /*
     * Cookie ini digunakan oleh Middleware.
     * Middleware tidak dapat membaca React Context
     * atau localStorage.
     */

    document.cookie = `wis_madang_token=${newSession.token}; ` + `path=/; max-age=86400; SameSite=Lax`;

    document.cookie = `wis_madang_role=${newSession.peran}; ` + `path=/; max-age=86400; SameSite=Lax`;

    setWelcomeMessage(`Selamat datang di Wis Madang, ${newSession.nama}!`);
    window.setTimeout(() => setWelcomeMessage(""), 3500);
  };

  const logout = () => {
    setSession(null);

    localStorage.removeItem(SESSION_KEY);

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
