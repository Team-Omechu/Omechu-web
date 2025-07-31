import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { LoginSuccessData } from "@/lib/api/auth"; // 경로 확인

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  user: LoginSuccessData | null;
  login: (data: { accessToken: string; user: LoginSuccessData }) => void;
  logout: () => void;
  setUser: (user: LoginSuccessData) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      user: null,
      login: (data) =>
        set({
          isLoggedIn: true,
          accessToken: data.accessToken,
          user: data.user,
        }),
      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          accessToken: null,
        }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
