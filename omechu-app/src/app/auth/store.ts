import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { LoginSuccessData } from "@/lib/api/auth";

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  password?: string; // password 필드 추가
  user: LoginSuccessData | null;
  login: (data: {
    accessToken: string;
    user: LoginSuccessData;
    password?: string;
  }) => void;
  logout: () => void;
  setUser: (user: LoginSuccessData) => void;
  setPassword: (password: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      user: null,
      password: "",
      login: (data) =>
        set({
          isLoggedIn: true,
          accessToken: data.accessToken,
          user: data.user,
          password: data.password,
        }),
      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          accessToken: null,
          password: "",
        }),
      setUser: (user) => set({ user }),
      setPassword: (password) => set({ password }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
