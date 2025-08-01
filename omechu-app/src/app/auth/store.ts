import { create } from "zustand";
import { persist } from "zustand/middleware"; // persist는 사용자 정보를 새로고침 시 유지하기 위해 여전히 유용합니다.

import type { LoginSuccessData } from "../../lib/api/auth";

interface AuthState {
  isLoggedIn: boolean;
  user: LoginSuccessData | null;
  // user 정보만 설정하거나 초기화하는 액션만 남깁니다.
  setUser: (user: LoginSuccessData | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      setUser: (user) => set({ user, isLoggedIn: !!user }),
    }),
    {
      name: "auth-user-storage", // localStorage에 저장될 키 이름
    },
  ),
);
