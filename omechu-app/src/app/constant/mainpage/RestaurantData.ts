// app/constant/mainpage/restaurantData.ts

export interface Restaurant {
  name: string;
  rating: number;
  reviews: number;
  address: string;
  menu: string;
  tags: string[];
  image: string;
}

export const restaurantList: Restaurant[] = [
  {
    name: "pier 23",
    rating: 3.2,
    reviews: 24,
    address: "서울특별시 무슨구 무슨동 000-0",
    menu: "짜장면",
    tags: ["아침식사", "데이트", "기념일"],
    image: "/logo/logo.png",
  },
  {
    name: "sushi house",
    rating: 4.1,
    reviews: 57,
    address: "서울특별시 강남구 테헤란로 123",
    menu: "초밥",
    tags: ["점심식사", "혼밥", "신선한"],
    image: "/logo/logo.png",
  },
  {
    name: "비스트로 88",
    rating: 4.5,
    reviews: 102,
    address: "서울특별시 종로구 삼청동 456",
    menu: "스테이크",
    tags: ["저녁식사", "분위기좋음", "데이트"],
    image: "/logo/logo.png",
  },
];
