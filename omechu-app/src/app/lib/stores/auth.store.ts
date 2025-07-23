import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  // TODO: Add user profile type
  user: any | null;
  login: (accessToken: string, user: any) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      user: null,
      login: (accessToken, user) =>
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
      name: "auth-storage", // 로컬 스토리지에 저장될 때 사용될 키 이름
      storage: createJSONStorage(() => localStorage), // (optional) 로컬 스토리지를 사용
    },
  ),
);

export default useAuthStore;
