// Restaurant 관련 공용 타입 정의
// FSD: 순수 타입은 shared에 위치

export type Restaurant = {
  id: number;
  name: string;
  address: string;
  rating: number;
  images: string[];
  rest_tag: { tag: string; count?: number }[];
  google_place_id: string;
  menus: string[];
  like: boolean;
  reviews: number;
};

export interface OpeningHour {
  days_of_the_week: string; // ex) "월", "화"
  time: string; // ex) "11:00-19:00"
}

export interface ReviewImage {
  id: number;
  link: string;
}

export interface RepreMenu {
  menu: string;
}

export interface RestaurantDetail {
  id: number;
  name: string;
  address: string;
  addressJibeon: string;
  postalCode: string;
  repreMenu: RepreMenu[];
  rating: number;
  currentOpeningHours: OpeningHour[];
  googlePlaceId: string | null;
  reviewImages: ReviewImage[];
  zzim: boolean;
}
