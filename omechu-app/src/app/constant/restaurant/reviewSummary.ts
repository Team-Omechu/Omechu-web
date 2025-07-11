// mockData
type ReviewSummary = {
  averageRating: number;
  reviewCount: number;
};

export const reviewSummary: Record<number, ReviewSummary> = {
  1: {
    averageRating: 4.3,
    reviewCount: 3,
  },
  2: {
    averageRating: 3.8,
    reviewCount: 2,
  },
};

export const reviewTags: Record<number, string[]> = {
  1: [
    "저녁식사(16)",
    "혼밥(12)",
    "조용한(9)",
    "아침식사(8)",
    "다같이(19)",
    "시끄러운(9)",
  ],
  2: [
    "점심식사(4)",
    "데이트(3)",
    "고급스러운(1)",
    "저녁식사(16)",
    "혼밥(12)",
    "조용한(9)",
  ],
};
