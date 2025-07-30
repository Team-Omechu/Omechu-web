export type Restaurant = {
  id: number;
  name: string;
  rating: number;
  reviews?: number; // 개수
  like?: boolean; // 맛집 좋아요 상태
  menu?: string; // 대표 메뉴
  tags?: string[]; // 문자열 배열
  rest_tag?: { tag: string; count: number }[];
  address: string; // 도로명 주소 전체 문자열
  images?: string[]; // 썸네일 이미지
};
