import { create } from "zustand";

type QuestionAnswerState = {
  mealTime: number | null;
  purpose: number | null;
  mood: number | null;
  who: number | null;
  budget: number | null;
  exceptions: string[];   // 빈 배열로 초기화
  currentStep: number;
};

type QuestionAnswerActions = {
  setMealTime: (mealTime: number) => void;
  setPurpose: (purpose: number) => void;
  setMood: (mood: number) => void;
  setWho: (who: number) => void;
  setBudget: (budget: number) => void;
  setCurrentStep: (step: number) => void;
  addException: (exception: string) => void;
  removeException: (exception: string) => void;
  reset: () => void;
};

const initialState: QuestionAnswerState = {
  mealTime: null,
  purpose: null,
  mood: null,
  who: null,
  budget: null,
  exceptions: [],
  currentStep: 1,
};

export const useQuestionAnswerStore = create<
  QuestionAnswerState & QuestionAnswerActions
>((set, get) => ({
  ...initialState,
  setMealTime: (mealTime) => set({ mealTime }),
  setPurpose: (purpose) => set({ purpose }),
  setMood: (mood) => set({ mood }),
  setWho: (who) => set({ who }),
  setBudget: (budget) => set({ budget }),
  setCurrentStep: (step) => set({ currentStep: step }),
  addException: (exception) => {
    const { exceptions } = get();
    if (!exceptions.includes(exception)) {
      set({ exceptions: [...exceptions, exception] });
    }
  },
  removeException: (exception) => {
    const { exceptions } = get();
    set({ exceptions: exceptions.filter((e) => e !== exception) });
  },
  reset: () => set(initialState),
}));
