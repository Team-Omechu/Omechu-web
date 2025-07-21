import { create } from "zustand";

type UserInfoSetupState = {
  gender: "여성" | "남성" | null;
  workoutStatus: string | null;
  preferredFood: string[];
  constitution: string[];
  allergies: string[];
  currentStep: number;
};

type UserInfoSetupActions = {
  setGender: (gender: "여성" | "남성") => void;
  setWorkoutStatus: (status: string) => void;
  togglePreferredFood: (food: string) => void;
  toggleConstitution: (item: string) => void;
  toggleAllergy: (allergy: string) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
};

const initialState: UserInfoSetupState = {
  gender: null,
  workoutStatus: null,
  preferredFood: [],
  constitution: [],
  allergies: [],
  currentStep: 1,
};

export const useUserInfoSetupStore = create<
  UserInfoSetupState & UserInfoSetupActions
>((set) => ({
  ...initialState,
  setGender: (gender) => set({ gender }),
  setWorkoutStatus: (workoutStatus) => set({ workoutStatus }),
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
  reset: () => set(initialState),
}));
