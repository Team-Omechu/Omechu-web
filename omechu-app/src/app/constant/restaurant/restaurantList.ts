// restuarant 리스트에 사용되는 음식 아이템 데이터입니다.
// 이 데이터는 더미 데이터로, 실제 API 호출로 대체될 수 있어서 interface를 적용하진 않았습니다.
// 각 음식 아이템은 이름, 평점, 리뷰 수, 주소, 메뉴, 태그, 이미지 URL을 포함하며,
// 음식 아이템의 정보를 표시하는 데 사용됩니다.

export type RestaurantType = {
  id?: number;
  name: string;
  category?: string;
  rating: number;
  reviews: number;
  address: string;
  menu: string;
  tags: string[];
  image: string;
  images?: string[];
  addressDetail?: {
    road: string;
    jibun: string;
    postalCode: string;
  };
  timetable?: {
    days_of_the_week: string;
    time: string;
  }[];
};

export const Restaurants: RestaurantType[] = [
  {
    id: 1,
    name: "오레노 라멘 합정 본점 ♥︎",
    category: "라멘",
    rating: 4.6,
    reviews: 85,
    address: "서울 성동구 왕십리로 36 104호",
    menu: "쇼유라멘",
    tags: ["혼밥", "라멘", "가성비"],
    image: "/restaurant_blank.png",
    images: ["/restaurant_blank.png", "/restaurant_blank.png", "/restaurant_blank.png"],
    addressDetail: {
      road: "서울 성동구 왕십리로 36 104호",
      jibun: "서울 성동구 성수동 123-1 1층",
      postalCode: "12345",
    },
    timetable: [
      { days_of_the_week: "월", time: "휴일" },
      { days_of_the_week: "화", time: "11:00 - 19:00" },
      { days_of_the_week: "수", time: "11:00 - 19:00" },
      { days_of_the_week: "목", time: "11:00 - 19:00" },
      { days_of_the_week: "금", time: "11:00 - 19:00" },
      { days_of_the_week: "토", time: "11:00 - 19:00" },
      { days_of_the_week: "일", time: "11:00 - 19:00" },
    ],
  },
  {
    id: 2,
    name: "더모닝 브런치 성수점",
    category: "브런치",
    rating: 4.2,
    reviews: 61,
    address: "서울 성동구 연무장5길 12",
    menu: "프렌치토스트",
    tags: ["데이트", "아침식사", "디저트"],
    image: "/restaurant_blank.png",
    images: ["/restaurant_blank.png", "/restaurant_blank.png", "/restaurant_blank.png"],
    addressDetail: {
      road: "서울 성동구 연무장5길 12",
      jibun: "서울 성동구 성수동2가 333-7",
      postalCode: "04567",
    },
    timetable: [
      { days_of_the_week: "월", time: "08:00 - 15:00" },
      { days_of_the_week: "화", time: "08:00 - 15:00" },
      { days_of_the_week: "수", time: "08:00 - 15:00" },
      { days_of_the_week: "목", time: "08:00 - 15:00" },
      { days_of_the_week: "금", time: "08:00 - 15:00" },
      { days_of_the_week: "토", time: "09:00 - 16:00" },
      { days_of_the_week: "일", time: "09:00 - 16:00" },
    ],
  },
  {
    name: "pier 23",
    rating: 3.2,
    reviews: 24,
    address: "서울특별시 마포구 합정동 123-45",
    menu: "짜장면",
    tags: ["아침식사", "데이트", "기념일"],
    image: "/오메추-로고-보라색버전-모자4 1.png",
  },
  {
    name: "맛있는김밥",
    rating: 4.5,
    reviews: 102,
    address: "서울특별시 강남구 역삼동 23-1",
    menu: "김밥",
    tags: ["점심식사", "혼밥", "테이크아웃"],
    image: "/오메추-로고-보라색버전-모자4 1.png",
  },
  {
    name: "치킨하우스",
    rating: 4.0,
    reviews: 87,
    address: "서울특별시 서초구 반포동 456-78",
    menu: "양념치킨",
    tags: ["야식", "배달", "회식"],
    image: "/오메추-로고-보라색버전-모자4 1.png",
  },
  {
    name: "카레포차",
    rating: 3.8,
    reviews: 35,
    address: "서울특별시 종로구 혜화동 77-2",
    menu: "일본식카레",
    tags: ["점심식사", "데이트", "저녁식사"],
    image: "/오메추-로고-보라색버전-모자4 1.png",
  },
  {
    name: "제주돈까스",
    rating: 4.3,
    reviews: 54,
    address: "서울특별시 송파구 문정동 88-8",
    menu: "등심돈까스",
    tags: ["혼밥", "데이트", "가성비"],
    image: "/오메추-로고-보라색버전-모자4 1.png",
  },
];