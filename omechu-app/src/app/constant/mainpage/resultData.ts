// resultData.ts
export interface RecommendMenuRequest {
  mealTime: number | null;
  purpose: number | null;
  mood: number | null;
  with: number | null;
  budget: number | null;
  exceptions: string[] | null;
  weather?: string;
  session?: string;
}

export type MenuItem = {
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
};

export type MenuListResponse = {
  menus: MenuItem[];
};

export type TagData = {
  tag: string;
  description: string;
};
