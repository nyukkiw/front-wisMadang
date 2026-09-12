// File untuk menyimpan data dummy sebelum ada data aseli

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { Session } from "@/lib/auth";

interface AuthContextType {
  session: Session | null;
  login: (session: Session) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem("wis_madang_session");

    if (savedSession) {
      try {
        const parsedSession: Session = JSON.parse(savedSession);
        setSession(parsedSession);
      } catch {
        localStorage.removeItem("wis_madang_session");
      }
    }

    setLoading(false);
  }, []);

  const login = (newSession: Session) => {
    setSession(newSession);

    localStorage.setItem("wis_madang_session", JSON.stringify(newSession));

    // Cookie untuk Middleware
    document.cookie = `wis_madang_token=${newSession.token}; path=/; max-age=86400; SameSite=Lax`;

    document.cookie = `wis_madang_role=${newSession.peran}; path=/; max-age=86400; SameSite=Lax`;
  };

  const logout = () => {
    setSession(null);

    localStorage.removeItem("wis_madang_session");

    document.cookie = "wis_madang_token=; path=/; max-age=0";

    document.cookie = "wis_madang_role=; path=/; max-age=0";
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        logout,
        loading,
      }}
    >
      {children}
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
