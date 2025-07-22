// resultData.ts

export type menuType = {
  id: number;
  title: string;
  description: string;
  image: string;
  nutrition: {
    calories: string;
    carbs: string;
    protein: string;
    fat: string;
    vitamin: string;
  };
  allergens: string[];
  recipeUrl: string;
};

export const menus: menuType[] = [
  {
    id: 1,
    title: "카레라이스",
    description:
      "매콤한 향신료와 따뜻한 밥이 어우러져 기분을 북돋아주고 활력을 주는 한 그릇 요리",
    image: "/logo/logo.svg",
    nutrition: {
      calories: "950 kcal",
      carbs: "120 g",
      protein: "20 g",
      fat: "35 g",
      vitamin: "비타민 B군",
    },
    allergens: ["땅콩", "달걀"],
    recipeUrl: "#",
  },
  {
    id: 2,
    title: "연어 아보카도 샌드위치",
    description:
      "오메가3가 풍부한 연어와 기분을 안정시켜주는 아보카도 조합, 비주얼도 예쁘서 기분 전환",
    image: "/logo/logo.svg",
    nutrition: {
      calories: "780 kcal",
      carbs: "70 g",
      protein: "25 g",
      fat: "40 g",
      vitamin: "비타민 D, E",
    },
    allergens: ["연어", "밀"],
    recipeUrl: "#",
  },
  {
    id: 3,
    title: "된장찌개와 보리밥",
    description:
      "구수한 된장향과 따뜻한 국물이 마음을 안정시키고 든든한 에너지를 채워주는 전통 한식 조합",
    image: "/logo/logo.svg",
    nutrition: {
      calories: "820 kcal",
      carbs: "100 g",
      protein: "22 g",
      fat: "25 g",
      vitamin: "비타민 B2",
    },
    allergens: ["대두", "밀"],
    recipeUrl: "#",
  },
  {
    id: 4,
    title: "냉모밀 정식",
    description: "시원한 냉모밀과 깔끔한 곁들임으로 여름철 입맛 돋움",
    image: "/logo/logo.svg",
    nutrition: {
      calories: "670 kcal",
      carbs: "85 g",
      protein: "15 g",
      fat: "20 g",
      vitamin: "비타민 C",
    },
    allergens: ["메밀", "계란"],
    recipeUrl: "#",
  },
  {
    id: 5,
    title: "치킨 케사디야",
    description: "바삭한 또띠아 속 풍미 가득한 치킨, 가벼운 식사에 제격",
    image: "/logo/logo.svg",
    nutrition: {
      calories: "880 kcal",
      carbs: "90 g",
      protein: "28 g",
      fat: "38 g",
      vitamin: "비타민 A",
    },
    allergens: ["닭고기", "유제품"],
    recipeUrl: "#",
  },
  {
    id: 6,
    title: "떡갈비 도시락",
    description: "달콤짭짤한 떡갈비와 다양한 반찬이 조화로운 든든한 구성",
    image: "/logo/logo.svg",
    nutrition: {
      calories: "990 kcal",
      carbs: "110 g",
      protein: "30 g",
      fat: "40 g",
      vitamin: "비타민 B1",
    },
    allergens: ["소고기", "대두"],
    recipeUrl: "#",
  },
];

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
