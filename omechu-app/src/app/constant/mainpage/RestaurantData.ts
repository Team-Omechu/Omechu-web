export interface RestaurantRequest {
  latitude: number | null;
  longitude: number | null;
  radius: number | null;
  keyword: string | null;
  pageSize: number; // 맛집 데이터를 몇개 줄 지 정하는 타입. 
}

export interface Restaurant {
  address_name: string; // 전체 지번 주소
  category_group_code: string; // 카테고리 그룹 코드
  category_group_name: string; // 카테고리 그룹 이름
  category_name: string; // 카테고리 상세
  distance: number; // 현위치에서의 거리(미터), string으로 내려옴
  id: number; // 장소 고유 ID
  phone: string; // 전화번호
  place_name: string; // 장소명
  place_url: string; // 카카오 맵 장소 URL
  road_address_name: string; // 전체 도로명 주소
  x: number; // 경도
  y: number; // 위도
}

export type restaurantList = Restaurant[];
