import { create } from "zustand";
// 기본 상태 입력 정보 Local Storage 임시 저장을 위해 persist 미들웨어 추가
import { persist } from "zustand/middleware";

type OnboardingState = {
  nickname: string;
  profileImageUrl: string | null;
  gender: "남성" | "여성" | null;
  exercise: string | null;
  prefer: string[];
  bodyType: string[];
  allergy: string[];
  currentStep: number;
};

type OnboardingActions = {
  setNickname: (nickname: string) => void;
  setProfileImageUrl: (url: string) => void;
  setGender: (gender: "남성" | "여성" | null) => void;
  setExercise: (exercise: string | null) => void;
  setPrefer: (prefer: string[]) => void; // 타입 정의 추가
  togglePrefer: (prefer: string) => void;
  toggleBodyType: (item: string) => void;
  toggleAllergy: (allergy: string) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
  resetGender: () => void;
  resetExercise: () => void;
  resetPrefer: () => void;
  resetBodyType: () => void;
  resetAllergy: () => void;
};

const initialState: OnboardingState = {
  nickname: "",
  profileImageUrl: null,
  gender: null,
  exercise: null,
  prefer: [],
  bodyType: [],
  allergy: [],
  currentStep: 1,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setNickname: (nickname) => set({ nickname }),
      setProfileImageUrl: (url) => set({ profileImageUrl: url }),
      setGender: (gender) => set({ gender }),
      setExercise: (exercise) => set({ exercise }),
      setPrefer: (prefer) => set({ prefer }),
      setBodyType: (bodyType: string[]) => set({ bodyType }),
      setAllergy: (allergy: string[]) => set({ allergy }),

      togglePrefer: (prefer) => {
        const exists = get().prefer.includes(prefer);
        const current = get().prefer;

        if (exists) return set({ prefer: current.filter((f) => f !== prefer) });
        if (current.length >= 2) return;
        return set({ prefer: [...current, prefer] });
      },

      toggleBodyType: (item) => {
        const exists = get().bodyType.includes(item);
        return set({ bodyType: exists ? [] : [item] });
      },

      toggleAllergy: (allergy) => {
        const exists = get().allergy.includes(allergy);
        const current = get().allergy;

        if (exists)
          return set({ allergy: current.filter((a) => a !== allergy) });
        if (current.length >= 2) return;
        return set({ allergy: [...current, allergy] });
      },

      setCurrentStep: (step) => set({ currentStep: step }),

      // 전체 초기화
      reset: () => {
        set(initialState);
        localStorage.removeItem("onboarding-storage");
      },

      // 상태별 초기화
      resetGender: () => set({ gender: null }),
      resetExercise: () => set({ exercise: null }),
      resetPrefer: () => set({ prefer: [] }),
      resetBodyType: () => set({ bodyType: [] }),
      resetAllergy: () => set({ allergy: [] }),
    }),
    {
      name: "onboarding-storage",
    },
  ),
);
