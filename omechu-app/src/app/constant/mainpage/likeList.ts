export type HeartItem = {
  id: string;
  userId: string;
  restaurantId: string; // ← 문자열
  created_at: string;
  restaurant: {
    id: string | null;
    name: string | null;
    address: string | null;
    rating: number;
    reviewCount: number;
    representativeMenus: string[];
    tags: { tag: string; count: number }[];
    rest_image: string | null;
  };
};

export type HeartResponse = {
  resultType: "SUCCESS" | "FAIL";
  error: unknown | null;
  success: {
    data: HeartItem[];
    hasNextPage: boolean;
    nextCursor: string | null;
  } | null;
};
