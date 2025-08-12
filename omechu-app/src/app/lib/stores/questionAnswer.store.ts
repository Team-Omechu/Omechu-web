import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type QuestionAnswerState = {
  mealTime: number | null;
  purpose: number | null;
  mood: number | null;
  who: number | null;
  budget: number | null;
  exceptions: string[]; // 빈 배열로 초기화
  addition: string[]
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
  addAddition: (addition: string) => void; // 추가된 메서드
  removeAddition: (addition: string) => void; // 추가된 메서드
  questionReset: () => void;
};

const initialState: QuestionAnswerState = {
  mealTime: null,
  purpose: null,
  mood: null,
  who: null,
  budget: null,
  exceptions: [],
  addition: [], // 초기값을 null로 설정
  currentStep: 1,
};

export const useQuestionAnswerStore = create<
  QuestionAnswerState & QuestionAnswerActions
>()(
  persist(
    (set, get) => ({
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
          set({ addition: [...(currentAddition), addition] });
        }
      },
      removeAddition: (addition) => {
        const { addition: currentAddition } = get();
        set({ addition: currentAddition.filter((a) => a !== addition) });
      },
      questionReset: () => set(initialState),
    }),
    {
      name: "question-answer-storage", // localStorage에 저장될 key
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
