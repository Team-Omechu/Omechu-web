import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { LoginSuccessData } from "@/lib/api/auth";

interface AuthStore {
  user: LoginSuccessData | null;
  accessToken: string;
  setUser: (user: LoginSuccessData) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: "", // 토큰을 위한 상태 추가
      setUser: (user) =>
        set({
          user,
          accessToken: user.accessToken,
        }),
      setAccessToken: (token) => set({ accessToken: token }),
      logout: () => set({ user: null, accessToken: "" }),
    }),
    // LocalStorage에 저장되는 key 이름 통일
    { name: "auth-storage" },
  ),
);
