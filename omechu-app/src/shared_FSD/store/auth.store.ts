import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LoginSuccessData } from "@/lib/api/auth";

const AUTH_STORAGE_KEY = "auth-storage";

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

type PersistedAuthState = Pick<
  AuthStoreState,
  "isLoggedIn" | "user" | "accessToken" | "refreshToken"
>;

function normalizePersistedAuthState(input: unknown): PersistedAuthState {
  if (!input || typeof input !== "object") {
    return {
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    };
  }

  const obj = input as Record<string, unknown>;

  return {
    isLoggedIn: typeof obj.isLoggedIn === "boolean" ? obj.isLoggedIn : false,
    user: (obj.user ?? null) as LoginSuccessData | null,
    accessToken: typeof obj.accessToken === "string" ? obj.accessToken : null,
    refreshToken:
      typeof obj.refreshToken === "string" ? obj.refreshToken : null,
  };
}

export const useAuthStore = create<
  AuthStore,
  [["zustand/persist", PersistedAuthState]]
>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      password: "",

      login: ({
        accessToken,
        refreshToken,
        user,
        password,
      }: {
        accessToken: string;
        refreshToken: string;
        user: LoginSuccessData;
        password?: string;
      }) =>
        set({
          isLoggedIn: true,
          accessToken,
          refreshToken,
          user,
          password,
        }),

      logout: () => {
        set({
          isLoggedIn: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          password: "",
        });

        try {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        } catch {}
      },

      setUser: (user: LoginSuccessData) => set({ user }),
      setAccessToken: (token: string | null) => set({ accessToken: token }),
      setRefreshToken: (token: string | null) => set({ refreshToken: token }),
      setPassword: (password: string) => set({ password }),
    }),
    {
      name: AUTH_STORAGE_KEY,

      // locks the persisted shape -> prevents `unknown` from spreading
      storage: createJSONStorage<PersistedAuthState>(() => localStorage),

      version: 1,

      partialize: (state: AuthStore): PersistedAuthState => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),

      migrate: (
        persistedState: unknown,
        _version: number,
      ): PersistedAuthState => normalizePersistedAuthState(persistedState),
    },
  ),
);
