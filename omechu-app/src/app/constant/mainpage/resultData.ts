// resultData.ts
export interface RecommendMenuRequest  {
  mealTime: number|null;
  purpose: number|null;
  mood: number|null;
  with: number|null;
  budget: number|null;
  exceptions: string[]|null;
  weather?: string;
  session?: string;
};

export interface MenuItem {
  menu: string;
  description: string;
  calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  sodium: number;
  vitamins: string[];
  allergies: string[];
  image_link: string;
}

export interface MenuListResponse {
  menus: MenuItem[]
}

export const tagData = [
  { tag: "아침", description: "간단하고 속에 편한 음식" },
  {
    tag: "든든한 한 끼 식사",
    description: "활기찬 기분을 유지할 수 있도록 하는 음식",
  },
  { tag: "들뜨고 신나요", description: "혼자서도 부담 없이 즐길 수 있는 음식" },
  { tag: "혼자", description: "활기찬 기분을 유지할 수 있도록 하는 음식" },
  { tag: "중간", description: "혼자서도 부담 없이 즐길 수 있는 음식" },
];
