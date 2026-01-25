export interface RestaurantRequest {
  latitude: number | null;
  longitude: number | null;
  radius: number | null;
  keyword: string | null;
  pageSize: number; // 맛집 데이터를 몇개 줄 지 정하는 타입.
  page: number;
}

export interface RestaurantPhotoAuthorAttribution {
  displayName: string;
  uri: string;
  photoUri: string;
}

export interface RestaurantPhoto {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: RestaurantPhotoAuthorAttribution[];
  flagContentUri: string;
  googleMapsUri: string;
}

export interface RestaurantDisplayName {
  text: string;
  languageCode: string;
}

export interface RestaurantLocation {
  latitude: number;
  longitude: number;
}

export interface Restaurant {
  id: string;
  formattedAddress: string;
  location: RestaurantLocation;
  priceLevel: string;
  displayName: RestaurantDisplayName;
  primaryType: string;
  photo: RestaurantPhoto | null;
  distance: number;
}

export interface RestaurantListResponse {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: Restaurant[];
}

// 필요하면 편의 타입
export type RestaurantList = Restaurant[];
