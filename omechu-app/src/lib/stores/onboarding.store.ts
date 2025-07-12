import { create } from "zustand";

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
  (set) => ({
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
    },
  })
);
