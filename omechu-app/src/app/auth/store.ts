import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { User } from "@/lib/api/auth"; // 경로 확인

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  user: User | null; // 타입을 User로 변경
  login: (data: { accessToken: string; user: User }) => void; // 타입을 User로 변경
  logout: () => void;
  setUser: (user: User) => void; // 타입을 User로 변경
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
