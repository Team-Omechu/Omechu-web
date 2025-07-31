import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { LoginSuccessData } from "@/lib/api/auth";

interface AuthStore {
  user: LoginSuccessData | null;
  setUser: (user: LoginSuccessData) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: "auth-store" }, // localStorage key
  ),
);
