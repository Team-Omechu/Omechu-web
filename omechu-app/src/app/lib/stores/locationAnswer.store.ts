import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type LocationAnswerState = {
  x: number | null;
  y: number | null;
  radius: number | null;
  keyword: string | null;
};

type LocationAnswerActions = {
  setX: (x: number) => void;
  setY: (y: number) => void;
  setRadius: (radius: number) => void;
  setKeyword: (keyword: string) => void;
  locationReset: () => void;
};

const initialState: LocationAnswerState = {
  x: null,
  y: null,
  radius: 500,
  keyword: null,
};

export const useLocationAnswerStore = create<
  LocationAnswerState & LocationAnswerActions
>()(
  persist(
    (set) => ({
      ...initialState,
      setX: (x) => set({ x }),
      setY: (y) => set({ y }),
      setRadius: (radius) => set({ radius }),
      setKeyword: (keyword) => set({ keyword }),
      locationReset: () => set(initialState),
    }),
    {
      name: "location-answer-storage", // localStorage에 저장될 key
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
