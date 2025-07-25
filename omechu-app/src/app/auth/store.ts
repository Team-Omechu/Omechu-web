import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { LoginSuccessData } from "./api/auth";

interface AuthState {
  isLoggedIn: boolean;
  // 소셜 로그인을 위해 accessToken 필드를 다시 추가하되, nullable로 유지합니다.
  accessToken: string | null;
  // TODO: Add user profile type
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
      login: (data: { accessToken: string; user: LoginSuccessData }) =>
        set({
          isLoggedIn: true,
          accessToken: data.accessToken,
          user: data.user,
        }),
      logout: () => set({ isLoggedIn: false, user: null, accessToken: null }),
      setUser: (user: LoginSuccessData) => set({ user }),
    }),
    {
      name: "auth-storage", // 로컬 스토리지에 저장될 때 사용될 키
      storage: createJSONStorage(() => localStorage), // localStorage를 사용
    },
  ),
);
