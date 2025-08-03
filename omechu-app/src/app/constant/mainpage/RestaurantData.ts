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
  rating: number;
  userRatingCount: number;
  id2: string;
}

export type restaurantList = Restaurant[];
