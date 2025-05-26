"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAuthStore } from "@/lib/store";

interface AuthContextType {
  user: {
    email: string;
    role: "admin" | "merchant" | null;
  } | null;
  login: (email: string, password: string, userType: "admin" | "merchant") => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, login, logout, isLoading, error } = useAuthStore();
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 