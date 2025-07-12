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
      // get은 필요할 때 쓰일 수 있으니 그대로 유지
      ...initialState,
      setNickname: (nickname) => set({ nickname }),
      setGender: (gender) => set({ gender }),
      setWorkoutStatus: (status) => set({ workoutStatus: status }),
      togglePreferredFood: (food) =>
        set((state) => ({
          preferredFood: state.preferredFood.includes(food)
            ? state.preferredFood.filter((f) => f !== food)
            : [...state.preferredFood, food],
        })),
      toggleConstitution: (item) =>
        set((state) => ({
          constitution: state.constitution.includes(item)
            ? state.constitution.filter((c) => c !== item)
            : [...state.constitution, item],
        })),
      toggleAllergy: (allergy) =>
        set((state) => ({
          allergies: state.allergies.includes(allergy)
            ? state.allergies.filter((a) => a !== allergy)
            : [...state.allergies, allergy],
        })),
      setCurrentStep: (step) => set({ currentStep: step }),
      reset: () => {
        set(initialState);
        // persist된 값도 초기화하려면 다음도 필요:
        localStorage.removeItem("onboarding-storage");
      },
    }),
    {
      name: "onboarding-storage", // localStorage에 저장될 key
      // optional: storage: sessionStorage 등으로 바꾸기도 가능
    }
  )
);
