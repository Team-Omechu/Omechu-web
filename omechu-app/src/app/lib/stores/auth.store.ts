import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { LoginSuccessData } from "@/lib/api/auth";

interface AuthStoreState {
  isLoggedIn: boolean;
  user: LoginSuccessData | null;
  accessToken: string | null;
  refreshToken: string | null;
  password?: string;
}

interface AuthStoreActions {
  login: (data: {
    accessToken: string;
    refreshToken: string;
    user: LoginSuccessData;
    password?: string;
  }) => void;
  logout: () => void;
  setUser: (user: LoginSuccessData) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setPassword: (password: string) => void;
}

type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      password: "",
      login: ({ accessToken, refreshToken, user, password }) =>
        set({
          isLoggedIn: true,
          accessToken,
          refreshToken,
          user,
          password,
        }),
      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          password: "",
        }),
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setPassword: (password) => set({ password }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      migrate: (persistedState: any, version: number) => {
        // persistedState here is the previously saved store state (not wrapped)
        if (version === 0 && persistedState) {
          const { password: _pw, ...rest } = persistedState;
          return rest;
        }
        return persistedState;
      },
    },
  ),
);
