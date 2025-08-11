// resultData.ts
export interface RecommendMenuRequest {
  mealTime: number | null;
  purpose: number | null;
  mood: number | null;
  with: number | null;
  budget: number | null;
  exceptions: string[] | null;
  weather: "맑음";
}

export type MenuItem = {
  id?: number;
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

export type menuType = {
  id: number;
  title: string;
  description: string;
  image: string;
  nutrition: number;
  allergens: string[];
  recipeUrl: string;
};

export const menus1: MenuItem[] = [
  {
    menu: "카레라이스",
    description:
      "매콤한 향신료와 따뜻한 밥이 어우러져 기분을 북돋아주고 활력을 주는 한 그릇 요리",
    calories: 500,
    carbohydrates: 90,
    protein: 10,
    fat: 8,
    sodium: 900,
    vitamins: ["비타민 A", "비타민 C"],
    allergies: ["땅콩", "달걀"],
    image_link: "/logo/logo.png",
  },
  {
    menu: "연어 아보카도 샌드위치",
    description:
      "오메가3가 풍부한 연어와 기분을 안정시켜주는 아보카도 조합, 비주얼도 예쁘서 기분 전환",
    calories: 600,
    carbohydrates: 72,
    protein: 18,
    fat: 16,
    sodium: 700,
    vitamins: ["비타민 D", "비타민 E"],
    allergies: ["연어", "밀"],
    image_link: "/logo/logo.png",
  },
  {
    menu: "된장찌개와 보리밥",
    description:
      "구수한 된장향과 따뜻한 국물이 마음을 안정시키고 든든한 에너지를 채워주는 전통 한식 조합",
    calories: 500,
    carbohydrates: 82,
    protein: 13,
    fat: 6,
    sodium: 800,
    vitamins: ["비타민 B2"],
    allergies: ["대두", "밀"],
    image_link: "/logo/logo.png",
  },
  {
    menu: "냉모밀 정식",
    description: "시원한 냉모밀과 깔끔한 곁들임으로 여름철 입맛 돋움",
    calories: 500,
    carbohydrates: 90,
    protein: 12,
    fat: 3,
    sodium: 600,
    vitamins: ["비타민 K"],
    allergies: ["메밀", "계란"],
    image_link: "/logo/logo.png",
  },
  {
    menu: "치킨 케사디야",
    description: "바삭한 또띠아 속 풍미 가득한 치킨, 가벼운 식사에 제격",
    calories: 500,
    carbohydrates: 60,
    protein: 20,
    fat: 15,
    sodium: 750,
    vitamins: ["비타민 B6"],
    allergies: ["닭고기", "유제품"],
    image_link: "/logo/logo.png",
  },
  {
    menu: "떡갈비 도시락",
    description: "달콤짭짤한 떡갈비와 다양한 반찬이 조화로운 든든한 구성",
    calories: 500,
    carbohydrates: 82,
    protein: 16,
    fat: 8,
    sodium: 800,
    vitamins: ["비타민 B12"],
    allergies: ["소고기", "대두", "밀"],
    image_link: "/logo/logo.png",
  },
  {
    menu: "짜장면",
    description: "상큼한 토마토 소스가 입맛을 돋우는 이탈리안 스타일 파스타",
    calories: 500,
    carbohydrates: 88,
    protein: 9,
    fat: 7,
    sodium: 900,
    vitamins: ["비타민 C"],
    allergies: ["밀", "유제품"],
    image_link: "/logo_3d.png",
  },
  {
    menu: "김치볶음밥",
    description: "매콤한 김치와 고소한 밥이 어우러진 국민 인기 메뉴",
    calories: 500,
    carbohydrates: 87,
    protein: 8,
    fat: 5,
    sodium: 1100,
    vitamins: ["비타민 C"],
    allergies: ["대두", "계란"],
    image_link: "/logo_3d.png",
  },
  {
    menu: "그릭 요거트 볼",
    description: "신선한 과일과 그래놀라가 어우러진 가볍고 건강한 디저트",
    calories: 500,
    carbohydrates: 45,
    protein: 10,
    fat: 14,
    sodium: 100,
    vitamins: ["비타민 D"],
    allergies: ["유제품", "견과류"],
    image_link: "/logo_3d.png",
  },
  {
    menu: "스시 정식",
    description: "신선한 생선과 밥이 조화를 이루는 정갈한 일식 한상",
    calories: 500,
    carbohydrates: 74,
    protein: 19,
    fat: 8,
    sodium: 800,
    vitamins: ["비타민 B12"],
    allergies: ["생선", "대두"],
    image_link: "/logo_3d.png",
  },
  {
    menu: "비빔국수",
    description: "매콤달콤한 양념과 탱글한 면발이 입맛을 돋우는 여름 별미",
    calories: 500,
    carbohydrates: 95,
    protein: 9,
    fat: 3,
    sodium: 900,
    vitamins: ["비타민 B1"],
    allergies: ["밀", "계란"],
    image_link: "/logo_3d.png",
  },
];

export const menus: menuType[] = [
  {
    id: 1,
    title: "카레라이스",
    description:
      "매콤한 향신료와 따뜻한 밥이 어우러져 기분을 북돋아주고 활력을 주는 한 그릇 요리",
    image: "/logo/logo.png",
    nutrition: 500,
    allergens: ["땅콩", "달걀"],
    recipeUrl: "#",
  },
  {
    id: 2,
    title: "연어 아보카도 샌드위치",
    description:
      "오메가3가 풍부한 연어와 기분을 안정시켜주는 아보카도 조합, 비주얼도 예쁘서 기분 전환",
    image: "/logo/logo.png",
    nutrition: 600,
    allergens: ["연어", "밀"],
    recipeUrl: "#",
  },
  // ...기존 메뉴들...

  {
    id: 3,
    title: "된장찌개와 보리밥",
    description:
      "구수한 된장향과 따뜻한 국물이 마음을 안정시키고 든든한 에너지를 채워주는 전통 한식 조합",
    image: "/logo/logo.png",
    nutrition: 500,
    allergens: ["대두", "밀"],
    recipeUrl: "#",
  },
  {
    id: 4,
    title: "냉모밀 정식",
    description: "시원한 냉모밀과 깔끔한 곁들임으로 여름철 입맛 돋움",
    image: "/logo/logo.png",
    nutrition: 500,
    allergens: ["메밀", "계란"],
    recipeUrl: "#",
  },
  {
    id: 5,
    title: "치킨 케사디야",
    description: "바삭한 또띠아 속 풍미 가득한 치킨, 가벼운 식사에 제격",
    image: "/logo/logo.png",
    nutrition: 500,
    allergens: ["닭고기", "유제품"],
    recipeUrl: "#",
  },
  {
    id: 6,
    title: "떡갈비 도시락",
    description: "달콤짭짤한 떡갈비와 다양한 반찬이 조화로운 든든한 구성",
    image: "/logo/logo.png",
    nutrition: 500,
    allergens: ["소고기", "대두", "밀"],
    recipeUrl: "#",
  },
  {
    id: 8,
    title: "짜장면",
    description: "상큼한 토마토 소스가 입맛을 돋우는 이탈리안 스타일 파스타",
    image: "/logo_3d.png",
    nutrition: 500,
    allergens: ["밀", "유제품"],
    recipeUrl: "#",
  },
  {
    id: 9,
    title: "김치볶음밥",
    description: "매콤한 김치와 고소한 밥이 어우러진 국민 인기 메뉴",
    image: "/logo_3d.png",
    nutrition: 500,
    allergens: ["대두", "계란"],
    recipeUrl: "#",
  },
  {
    id: 10,
    title: "그릭 요거트 볼",
    description: "신선한 과일과 그래놀라가 어우러진 가볍고 건강한 디저트",
    image: "/logo_3d.png",
    nutrition: 500,
    allergens: ["유제품", "견과류"],
    recipeUrl: "#",
  },
  {
    id: 11,
    title: "스시 정식",
    description: "신선한 생선과 밥이 조화를 이루는 정갈한 일식 한상",
    image: "/logo_3d.png",
    nutrition: 500,
    allergens: ["생선", "대두"],
    recipeUrl: "#",
  },
  {
    id: 12,
    title: "비빔국수",
    description: "매콤달콤한 양념과 탱글한 면발이 입맛을 돋우는 여름 별미",
    image: "/logo_3d.png",
    nutrition: 500,
    allergens: ["밀", "계란"],
    recipeUrl: "#",
  },
];
