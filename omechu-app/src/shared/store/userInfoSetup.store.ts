// TODO: FSD 위반 - shared 레이어에 도메인 store가 있으면 안 됨
// entities/user/model/userInfoSetup.store.ts로 이동 필요
import { create } from "zustand";

type UserInfoSetupState = {
  gender: "여성" | "남성" | null;
  exercise: string | null;
  prefer: string[];
  bodyType: string[];
  allergy: string[];
  currentStep: number;
};

type UserInfoSetupActions = {
  setGender: (gender: "여성" | "남성") => void;
  setExercise: (exercise: string) => void;
  togglePrefer: (prefer: string) => void;
  toggleBodyType: (item: string) => void;
  toggleAllergy: (allergy: string) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
};

const initialState: UserInfoSetupState = {
  gender: null,
  exercise: null,
  prefer: [],
  bodyType: [],
  allergy: [],
  currentStep: 1,
};

export const useUserInfoSetupStore = create<
  UserInfoSetupState & UserInfoSetupActions
>((set) => ({
  ...initialState,
  setGender: (gender) => set({ gender }),
  setExercise: (exercise) => set({ exercise }),
  togglePrefer: (prefer) =>
    set((state) => ({
      prefer: state.prefer.includes(prefer)
        ? state.prefer.filter((f) => f !== prefer)
        : [...state.prefer, prefer],
    })),
  toggleBodyType: (item) =>
    set((state) => ({
      bodyType: state.bodyType.includes(item)
        ? state.bodyType.filter((c) => c !== item)
        : [...state.bodyType, item],
    })),
  toggleAllergy: (allergy) =>
    set((state) => ({
      allergy: state.allergy.includes(allergy)
        ? state.allergy.filter((a) => a !== allergy)
        : [...state.allergy, allergy],
    })),
  setCurrentStep: (step) => set({ currentStep: step }),
  reset: () => set(initialState),
}));
