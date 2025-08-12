// resultData.ts
export interface RecommendMenuRequest {
  mealTime: number | null;
  purpose: number | null;
  mood: number | null;
  with: number | null;
  budget: number | null;
  exceptions: string[] | null;
  weather?: string;
}

export interface RandomMenuRequest {
  addition: string[] | null;
}

export type RandomMenu = {
  name: string;
  image_link: string;
};

export type MenuItem = {
  id: number;
  menu: string;
  calory: number;
  protein: number;
  carbo: number;
  fat: number;
  sodium: number;
  vitamin: string[];
  allergic: string[];
  description: string;
  image_link: string;
};

export type MenuDetail = {
  name: string;
  description: string;
  calory: number;
  protein: number;
  carbo: number;
  fat: number;
  sodium: number;
  vitamin: string[];
  allergic: string[];
  image_link: string;
};

export type MenuListResponse = {
  menus: MenuItem[];
};

export type TagData = {
  tag: string;
  description: string;
};

export type menuType = {
  id: number;
  title: string;
  description: string;
  image: string;
  nutrition: number;
  allergens: string[];
  recipeUrl: string;
};

export const menus1: MenuItem[] = [];
