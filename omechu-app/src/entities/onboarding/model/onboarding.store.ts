import { create } from "zustand";
// 기본 상태 입력 정보 Local Storage 임시 저장을 위해 persist 미들웨어 추가
import { persist } from "zustand/middleware";

// ── Normalizers (UI/store 라벨을 스펙 라벨로 통일) ───────────────────────────
const normGender = (v?: string | null) => {
  const s = (v ?? "").trim();
  if (!s) return null;
  const u = s.toUpperCase();
  if (u === "F" || s === "여성") return "여성" as const;
  if (u === "M" || s === "남성") return "남성" as const;
  return s as "여성" | "남성" | null; // 이미 라벨일 가능성
};
const normExercise = (v?: string | null) => {
  const s = (v ?? "").trim();
  if (!s) return null;
  const u = s.toUpperCase();
  if (u === "DIET" || s.includes("다이어트")) return "다이어트 중";
  if (u === "BULK" || s.includes("증량")) return "증량 중";
  if (u === "MAINTAIN" || s.includes("유지")) return "유지 중";
  return s; // 이미 라벨일 가능성
};
const normBodyType = (v?: string | null) => {
  const s = (v ?? "").replace(/\s+/g, "");
  if (!s) return null;
  if (s.includes("더위")) return "더위잘탐";
  if (s.includes("추위")) return "추위잘탐";
  if (s.includes("감기")) return "감기";
  if (s.includes("소화")) return "소화불량";
  return v ?? null;
};
const normPrefer = (v?: string | null) => {
  const s = (v ?? "").trim();
  if (!s) return null;
  if (["한식", "양식", "중식", "일식", "다른나라"].includes(s)) return s;
  const u = s.toUpperCase();
  if (u === "KOR") return "한식";
  if (u === "WES" || u === "WESTERN") return "양식";
  if (u === "CHI" || u === "CHINESE") return "중식";
  if (u === "JPN" || u === "JAPANESE") return "일식";
  if (s.includes("다른나라")) return "다른나라";
  return s; // 최대한 보존
};
const normAllergy = (v?: string | null) => {
  const s = (v ?? "").replace(/\s+/g, "");
  if (!s) return null;
  if (s.includes("달걀") || s.includes("난류")) return "달걀(난류) 알레르기";
  if (s.includes("우유") || s.includes("유제품")) return "우유 알레르기";
  if (s.includes("갑각류")) return "갑각류 알레르기";
  if (s.includes("해산물")) return "해산물 알레르기";
  if (s.includes("견과")) return "견과류 알레르기";
  return v ?? null;
};
const uniq = <T>(arr: T[]) => Array.from(new Set(arr));
const toArray = (v: any) => (Array.isArray(v) ? v : v ? [v] : []);

type OnboardingState = {
  nickname: string;
  gender: "남성" | "여성" | null;
  exercise: string | null;
  prefer: string[];
  bodyType: string[];
  allergy: string[];
  currentStep: number;
  preferHydrateBlocked: boolean;
};

type OnboardingActions = {
  setNickname: (nickname: string) => void;
  setGender: (gender: "남성" | "여성" | null) => void;
  setExercise: (exercise: string | null) => void;
  setPrefer: (prefer: string[]) => void;
  setBodyType: (bodyType: string[]) => void;
  setAllergy: (allergy: string[]) => void;
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
  hydrateFromProfile: (raw: unknown) => void;
  blockPreferHydrate: () => void;
  softReset: () => void;
  hardReset: () => void;
};

const initialState: OnboardingState = {
  nickname: "",
  gender: null,
  exercise: null,
  prefer: [],
  bodyType: [],
  allergy: [],
  currentStep: 1,
  preferHydrateBlocked: false,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setNickname: (nickname) => set({ nickname }),
      setGender: (gender) => set({ gender }),
      setExercise: (exercise) => set({ exercise }),
      setPrefer: (prefer) => set({ prefer }),
      setBodyType: (bodyType: string[]) => set({ bodyType }),
      setAllergy: (allergy: string[]) => set({ allergy }),

      hydrateFromProfile: (raw: unknown) => {
        const profile = raw as Record<string, unknown> | null;
        const nickname =
          (profile?.nickname as string) ?? (profile?.name as string) ?? "";

        const gender = normGender(
          (profile?.gender as string) ?? (profile?.sex as string) ?? null,
        );
        const exercise = normExercise(
          (profile?.exercise as string) ?? (profile?.state as string) ?? null,
        );

        const preferArr = uniq(
          toArray(profile?.prefer)
            .map((v) => normPrefer(v as string)!)
            .filter(Boolean) as string[],
        ).slice(0, 2);

        const bodyTypeFirst = normBodyType(
          (profile?.bodyType as string) ??
            (profile?.body_type as string) ??
            null,
        );
        const bodyType = bodyTypeFirst ? [bodyTypeFirst] : [];

        const allergy = uniq(
          toArray(profile?.allergy)
            .map((v) => normAllergy(v as string)!)
            .filter(Boolean) as string[],
        );

        set({
          nickname,
          gender: gender as OnboardingState["gender"],
          exercise,
          prefer: preferArr,
          bodyType,
          allergy,
        });
      },

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
        const current = get().allergy;
        const exists = current.includes(allergy);
        return set({
          allergy: exists
            ? current.filter((a) => a !== allergy)
            : [...current, allergy],
        });
      },

      setCurrentStep: (step) => set({ currentStep: step }),

      blockPreferHydrate: () => set({ preferHydrateBlocked: true }),

      softReset: () => {
        const { nickname } = get();
        set({
          nickname,
          gender: null,
          exercise: null,
          prefer: [],
          bodyType: [],
          allergy: [],
          currentStep: 1,
          preferHydrateBlocked: false,
        });
      },

      hardReset: () => {
        set({
          ...initialState,
          preferHydrateBlocked: false,
        });
        try {
          localStorage.removeItem("onboarding-storage");
        } catch {
          //
        }
      },

      reset: () => {
        // alias for backward compatibility (hard reset)
        get().hardReset();
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
