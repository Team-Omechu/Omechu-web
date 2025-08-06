import { TagData } from "@/constant/mainpage/resultData";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TagState = {
  tagData: TagData[];
};

type TagActions = {
  setTagData: (tags: TagData[]) => void;
  addTag: (tag: string, description: string) => void;
  removeTag: (tag: string) => void;
  tagDataReset: () => void;
};

const initialTagData: TagData[] = []; // 초기엔 빈 배열, 필요하면 기본값

export const useTagStore = create<TagState & TagActions>()(
  persist(
    (set, get) => ({
      tagData: initialTagData,
      setTagData: (tags) => set({ tagData: tags }),
      addTag: (tag, description) =>
        set({ tagData: [...get().tagData, { tag, description }] }),
      removeTag: (tag) =>
        set({ tagData: get().tagData.filter((t) => t.tag !== tag) }),
      tagDataReset: () => set({ tagData: initialTagData }),
    }),
    {
      name: "tag-data-storage", // localStorage에 저장될 key
      storage: createJSONStorage(() => localStorage), // localStorage를 사용
    },
  ),
);
