import { TagData } from "../../menu";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TagState = {
  mealTimeTag: TagData | null;
  purposeTag: TagData | null;
  moodTag: TagData | null;
  whoTag: TagData | null;
  budgetTag: TagData | null;
};

type TagActions = {
  setMealTimeTag: (tag: string, description: string) => void;
  setPurposeTag: (tag: string, description: string) => void;
  setMoodTag: (tag: string, description: string) => void;
  setWhoTag: (tag: string, description: string) => void;
  setBudgetTag: (tag: string, description: string) => void;
  tagDataReset: () => void;
};

const initialTagData: TagState = {
  mealTimeTag: null,
  purposeTag: null,
  moodTag: null,
  whoTag: null,
  budgetTag: null,
};
// 초기엔 빈 배열, 필요하면 기본값

export const useTagStore = create<TagState & TagActions>()(
  persist(
    (set) => ({
      ...initialTagData,
      setMealTimeTag: (tag: string, description: string) =>
        set({ mealTimeTag: { tag, description } }),
      setPurposeTag: (tag: string, description: string) =>
        set({ purposeTag: { tag, description } }),
      setMoodTag: (tag: string, description: string) =>
        set({ moodTag: { tag, description } }),
      setWhoTag: (tag: string, description: string) =>
        set({ whoTag: { tag, description } }),
      setBudgetTag: (tag: string, description: string) =>
        set({ budgetTag: { tag, description } }),
      tagDataReset: () => set(initialTagData),
    }),
    {
      name: "tag-data-storage", // localStorage에 저장될 key
      storage: createJSONStorage(() => localStorage), // localStorage를 사용
    },
  ),
);
