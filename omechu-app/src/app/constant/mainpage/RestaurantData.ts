export interface RestaurantRequest {
  latitude: number | null;
  longitude: number | null;
  radius: number | null;
  keyword: string | null;
  pageSize: number; // 맛집 데이터를 몇개 줄 지 정하는 타입.
}

export interface Restaurant {
  id: string;
  displayName: {
    text: string;
  };
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  userRatingCount: number;
  priceLevel: "PRICE_LEVEL_INEXPENSIVE" | "PRICE_LEVEL_MODERATE" | "PRICE_LEVEL_EXPENSIVE" | "PRICE_LEVEL_VERY_EXPENSIVE" | string;
  businessStatus: "OPERATIONAL" | "CLOSED_TEMPORARILY" | "CLOSED_PERMANENTLY" | string;
}

export type restaurantList = Restaurant[];
