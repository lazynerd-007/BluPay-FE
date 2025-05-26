"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { redirect } from "next/navigation";

export type UserRole = "admin" | "merchant" | null;

interface User {
  email: string;
  role: UserRole;
  name?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, userType: "admin" | "merchant") => Promise<void>;
  logout: () => void;
  clearError: () => void;
  requestPasswordReset: (email: string, userType: "admin" | "merchant") => Promise<void>;
}

// Mock API function for authentication
const mockAuthenticate = async (
  email: string, 
  password: string, 
  userType: "admin" | "merchant"
): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Validate credentials (this is just a mock)
  if (password.length < 6) {
    throw new Error("Invalid credentials. Password must be at least 6 characters.");
  }
  
  // In a real app, this would validate against a backend
  if (userType === "admin" && !email.includes("admin")) {
    throw new Error("Invalid admin credentials");
  }
  
  return {
    email,
    role: userType,
    name: email.split("@")[0]
  };
};

// Mock API function for password reset
const mockRequestPasswordReset = async (
  email: string,
  userType: "admin" | "merchant"
): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would send a reset link via email
  // For this mock, we'll just check if the email exists
  if (!email.includes("@")) {
    throw new Error("Invalid email format");
  }
  
  // Additional validation for admin emails if needed
  if (userType === "admin" && !email.includes("admin")) {
    throw new Error("Email not found in admin records");
  }
  
  // Success - in a real app this would trigger an email sending process
  return;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      
      login: async (email, password, userType) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await mockAuthenticate(email, password, userType);
          set({ user, isLoading: false });
          
          // Wait for authentication to complete
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // For admin login, show the toast notification using the dedicated component
          if (userType === "admin") {
            // Dynamic import to avoid JSX in store file
            const { showAdminLoginToast } = await import('@/components/admin/admin-login-toast');
            await showAdminLoginToast(user);
            
            // Navigate to admin dashboard
            window.location.href = "/admin/dashboard";
          } else {
            // Navigate to merchant dashboard
            window.location.href = "/merchant/dashboard";
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An unknown error occurred", 
            isLoading: false 
          });
        }
      },
      
      logout: () => {
        const userRole = get().user?.role;
        set({ user: null });
        
        // Redirect to the appropriate login page based on the user's role
        if (userRole === "admin") {
          window.location.href = "/login/admin";
        } else {
          window.location.href = "/login/merchant";
        }
      },
      
      clearError: () => set({ error: null }),
      
      requestPasswordReset: async (email, userType) => {
        set({ isLoading: true, error: null });
        
        try {
          await mockRequestPasswordReset(email, userType);
          set({ isLoading: false });
          // In a real app, we might set a success message or redirect
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to process reset request",
            isLoading: false
          });
        }
      }
    }),
    {
      name: "blupay-auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
); 