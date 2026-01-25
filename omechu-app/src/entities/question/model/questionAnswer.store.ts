import { create } from "zustand";

type QuestionAnswerState = {
  mealTime: string | null;
  purpose: string | null;
  mood: string | null;
  who: string | null;
  budget: string | null;
  exceptions: string[];
  addition: string[];
  currentStep: number;
};

type QuestionAnswerActions = {
  setMealTime: (mealTime: string) => void;
  setPurpose: (purpose: string) => void;
  setMood: (mood: string) => void;
  setWho: (who: string) => void;
  setBudget: (budget: string) => void;
  setCurrentStep: (step: number) => void;

  addException: (exception: string) => void;
  removeException: (exception: string) => void;

  addAddition: (addition: string) => void;
  removeAddition: (addition: string) => void;

  questionReset: () => void;
};

const initialState: QuestionAnswerState = {
  mealTime: null,
  purpose: null,
  mood: null,
  who: null,
  budget: null,
  exceptions: [],
  addition: [],
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

  addAddition: (addition) => {
    const { addition: currentAddition } = get();
    if (!currentAddition.includes(addition)) {
      set({ addition: [...currentAddition, addition] });
    }
  },
  removeAddition: (addition) => {
    const { addition: currentAddition } = get();
    set({ addition: currentAddition.filter((a) => a !== addition) });
  },

  questionReset: () => set(initialState),
}));
