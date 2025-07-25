import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  // 소셜 로그인을 위해 accessToken 필드를 다시 추가하되, nullable로 유지합니다.
  accessToken: string | null;
  // TODO: Add user profile type
  user: any | null;
  // 로그인 시 accessToken은 선택적으로 받도록 수정합니다.
  login: (user: any, accessToken?: string | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      user: null,
      login: (user, accessToken = null) =>
        set({
          isLoggedIn: true,
          accessToken,
          user,
        }),
      logout: () =>
        set({
          isLoggedIn: false,
          accessToken: null,
          user: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAuthStore;
