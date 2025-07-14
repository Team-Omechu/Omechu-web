import { create } from "zustand";

type QuestionAnswerState = {
  mealTime: string | null;
  purpose: string | null;
  mood: string | null;
  who: string | null;
  budget: string | null;
  currentStep: number;
};

type QuestionAnswerActions = {
  setMealTime: (mealTime: string) => void;
  setPurpose: (purpose: string) => void;
  setMood: (mood: string) => void;
  setWho: (who: string) => void;
  setBudget: (budget: string) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
};

const initialState: QuestionAnswerState = {
  mealTime: null,
  purpose: null,
  mood: null,
  who: null,
  budget: null,
  currentStep: 1,
};

export const useQuestionAnswerStore = create<
  QuestionAnswerState & QuestionAnswerActions
>((set) => ({
  ...initialState,
  setMealTime: (mealTime) => set({ mealTime }),
  setPurpose: (purpose) => set({ purpose }),
  setMood: (mood) => set({ mood }),
  setWho: (who) => set({ who }),
  setBudget: (budget) => set({ budget }),
  setCurrentStep: (step) => set({ currentStep: step }),
  reset: () => set(initialState),
}));
