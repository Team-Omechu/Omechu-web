import { create } from "zustand";
// 기본 상태 입력 정보 Local Storage 임시 저장을 위해 persist 미들웨어 추가
import { persist } from "zustand/middleware";

type OnboardingState = {
  nickname: string;
  gender: "여성" | "남성" | null;
  workoutStatus: string | null;
  preferredFood: string[];
  constitution: string[];
  allergies: string[];
  currentStep: number;
};

type OnboardingActions = {
  setNickname: (nickname: string) => void;
  setGender: (gender: "여성" | "남성" | null) => void;
  setWorkoutStatus: (status: string | null) => void;
  togglePreferredFood: (food: string) => void;
  toggleConstitution: (item: string) => void;
  toggleAllergy: (allergy: string) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
  resetGender: () => void;
  resetWorkoutStatus: () => void;
  resetPreferredFood: () => void;
  resetConstitution: () => void;
  resetAllergies: () => void;
};

const initialState: OnboardingState = {
  nickname: "",
  gender: null,
  workoutStatus: null,
  preferredFood: [],
  constitution: [],
  allergies: [],
  currentStep: 1,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setNickname: (nickname) => set({ nickname }),
      setGender: (gender) => set({ gender }),
      setWorkoutStatus: (status) => set({ workoutStatus: status }),
      setPreferredFood: (foods) => set({ preferredFood: foods }),

      togglePreferredFood: (food) => {
        const exists = get().preferredFood.includes(food);
        const current = get().preferredFood;

        if (exists)
          return set({ preferredFood: current.filter((f) => f !== food) });
        if (current.length >= 2) return;
        return set({ preferredFood: [...current, food] });
      },

      toggleConstitution: (item) => {
        const exists = get().constitution.includes(item);
        return set({ constitution: exists ? [] : [item] });
      },

      toggleAllergy: (allergy) => {
        const exists = get().allergies.includes(allergy);
        const current = get().allergies;

        if (exists)
          return set({ allergies: current.filter((a) => a !== allergy) });
        if (current.length >= 2) return;
        return set({ allergies: [...current, allergy] });
      },

      setCurrentStep: (step) => set({ currentStep: step }),

      // 전체 초기화
      reset: () => {
        set(initialState);
        localStorage.removeItem("onboarding-storage");
      },

      // 상태별 초기화
      resetGender: () => set({ gender: null }),
      resetWorkoutStatus: () => set({ workoutStatus: null }),
      resetPreferredFood: () => set({ preferredFood: [] }),
      resetConstitution: () => set({ constitution: [] }),
      resetAllergies: () => set({ allergies: [] }),
    }),
    {
      name: "onboarding-storage",
    },
  ),
);
