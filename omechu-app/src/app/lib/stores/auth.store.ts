import { create } from "zustand";
import type { LoginSuccessData } from "@/lib/api/auth";

// 타입 정의
interface AuthState {
  user: LoginSuccessData | null;
  setUser: (user: LoginSuccessData) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
