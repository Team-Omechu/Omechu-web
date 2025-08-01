// restuarant 리스트에 사용되는 음식 아이템 데이터입니다.
// 이 데이터는 더미 데이터로, 실제 API 호출로 대체될 수 있어서 interface를 적용하진 않았습니다.
// 각 음식 아이템은 이름, 평점, 리뷰 수, 주소, 메뉴, 태그, 이미지 URL을 포함하며,
// 음식 아이템의 정보를 표시하는 데 사용됩니다.

export type RestaurantType = {
  id: number;
  name: string;
  category?: string;
  rating: number;
  reviews: number;
  isLiked: boolean;
  menu: string;
  tags: string[];
  images: string[];
  address: {
    road: string;
    jibun: string;
    postalCode: string;
  };
  timetable: {
    days_of_the_week: string;
    time: string;
  }[];
};

export const Restaurants: RestaurantType[] = [
  {
    id: 1,
    name: "오레노 라멘 합정 본점",
    category: "라멘",
    rating: 4.6,
    reviews: 85,
    isLiked: true,
    menu: "쇼유라멘",
    tags: ["혼밥", "라멘", "가성비"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
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
    isLiked: true,
    menu: "프렌치토스트",
    tags: ["데이트", "아침식사", "디저트"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
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
    id: 3,
    name: "pier 23",
    rating: 3.2,
    reviews: 24,
    isLiked: false,
    menu: "짜장면",
    tags: ["아침식사", "데이트", "기념일"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 강남구 테헤란로 23길 12",
      jibun: "서울특별시 강남구 역삼동 23-1",
      postalCode: "06164",
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
    id: 4,
    name: "맛있는김밥",
    rating: 4.5,
    reviews: 102,
    isLiked: false,
    menu: "김밥",
    tags: ["점심식사", "혼밥", "테이크아웃"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 마포구 월드컵북로 123",
      jibun: "서울특별시 마포구 연남동 456-7",
      postalCode: "03999",
    },
    timetable: [
      { days_of_the_week: "월", time: "10:00 - 20:00" },
      { days_of_the_week: "화", time: "10:00 - 20:00" },
      { days_of_the_week: "수", time: "10:00 - 20:00" },
      { days_of_the_week: "목", time: "10:00 - 20:00" },
      { days_of_the_week: "금", time: "10:00 - 20:00" },
      { days_of_the_week: "토", time: "10:00 - 20:00" },
      { days_of_the_week: "일", time: "10:00 - 20:00" },
    ],
  },
  {
    id: 5,
    name: "성수동 떡볶이",
    rating: 4.0,
    reviews: 75,
    isLiked: false,
    menu: "떡볶이",
    tags: ["간식", "야식", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 123",
      jibun: "서울특별시 성동구 성수동1가 789-10",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 22:00" },
      { days_of_the_week: "화", time: "11:00 - 22:00" },
      { days_of_the_week: "수", time: "11:00 - 22:00" },
      { days_of_the_week: "목", time: "11:00 - 22:00" },
      { days_of_the_week: "금", time: "11:00 - 22:00" },
      { days_of_the_week: "토", time: "12:00 - 23:00" },
      { days_of_the_week: "일", time: "12:00 - 23:00" },
    ],
  },
  {
    id: 6,
    name: "성수동 카페",
    rating: 4.3,
    reviews: 50,
    isLiked: false,
    menu: "아메리카노",
    tags: ["카페", "디저트", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 456",
      jibun: "서울특별시 성동구 성수동2가 123-45",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "09:00 - 21:00" },
      { days_of_the_week: "화", time: "09:00 - 21:00" },
      { days_of_the_week: "수", time: "09:00 - 21:00" },
      { days_of_the_week: "목", time: "09:00 - 21:00" },
      { days_of_the_week: "금", time: "09:00 - 22:00" },
      { days_of_the_week: "토", time: "10:00 - 22:00" },
      { days_of_the_week: "일", time: "10:00 - 22:00" },
    ],
  },
  {
    id: 7,
    name: "성수동 피자",
    rating: 4.1,
    reviews: 90,
    isLiked: false,
    menu: "마르게리타 피자",
    tags: ["피자", "테이크아웃", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 789",
      jibun: "서울특별시 성동구 성수동3가 678-90",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 22:00" },
      { days_of_the_week: "화", time: "11:00 - 22:00" },
      { days_of_the_week: "수", time: "11:00 - 22:00" },
      { days_of_the_week: "목", time: "11:00 - 22:00" },
      { days_of_the_week: "금", time: "11:00 - 23:00" },
      { days_of_the_week: "토", time: "12:00 - 23:00" },
      { days_of_the_week: "일", time: "12:00 - 23:00" },
    ],
  },
  {
    id: 8,
    name: "성수동 스시",
    rating: 4.7,
    reviews: 120,
    isLiked: false,
    menu: "초밥",
    tags: ["스시", "혼밥", "가성비"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 101",
      jibun: "서울특별시 성동구 성수동4가 111-22",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 21:00" },
      { days_of_the_week: "화", time: "11:00 - 21:00" },
      { days_of_the_week: "수", time: "11:00 - 21:00" },
      { days_of_the_week: "목", time: "11:00 - 21:00" },
      { days_of_the_week: "금", time: "11:00 - 22:00" },
      { days_of_the_week: "토", time: "12:00 - 22:00" },
      { days_of_the_week: "일", time: "12:00 - 22:00" },
    ],
  },
  {
    id: 9,
    name: "성수동 베이커리",
    rating: 4.4,
    reviews: 65,
    isLiked: false,
    menu: "크루아상",
    tags: ["베이커리", "디저트", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 202",
      jibun: "서울특별시 성동구 성수동5가 333-44",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "08:00 - 20:00" },
      { days_of_the_week: "화", time: "08:00 - 20:00" },
      { days_of_the_week: "수", time: "08:00 - 20:00" },
      { days_of_the_week: "목", time: "08:00 - 20:00" },
      { days_of_the_week: "금", time: "08:00 - 21:00" },
      { days_of_the_week: "토", time: "09:00 - 21:00" },
      { days_of_the_week: "일", time: "09:00 - 21:00" },
    ],
  },
  {
    id: 10,
    name: "성수동 치킨",
    rating: 4.8,
    reviews: 150,
    isLiked: true,
    menu: "후라이드 치킨",
    tags: ["치킨", "야식", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 303",
      jibun: "서울특별시 성동구 성수동6가 555-66",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 23:00" },
      { days_of_the_week: "화", time: "11:00 - 23:00" },
      { days_of_the_week: "수", time: "11:00 - 23:00" },
      { days_of_the_week: "목", time: "11:00 - 23:00" },
      { days_of_the_week: "금", time: "11:00 - 24:00" },
      { days_of_the_week: "토", time: "12:00 - 24:00" },
      { days_of_the_week: "일", time: "12:00 - 24:00" },
    ],
  },
  {
    id: 11,
    name: "성수동 아이스크림",
    rating: 4.5,
    reviews: 80,
    isLiked: false,
    menu: "아이스크림",
    tags: ["디저트", "간식", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 404",
      jibun: "서울특별시 성동구 성수동7가 777-88",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "10:00 - 20:00" },
      { days_of_the_week: "화", time: "10:00 - 20:00" },
      { days_of_the_week: "수", time: "10:00 - 20:00" },
      { days_of_the_week: "목", time: "10:00 - 20:00" },
      { days_of_the_week: "금", time: "10:00 - 21:00" },
      { days_of_the_week: "토", time: "11:00 - 21:00" },
      { days_of_the_week: "일", time: "11:00 - 21:00" },
    ],
  },
  {
    id: 12,
    name: "성수동 스테이크",
    rating: 4.9,
    reviews: 200,
    isLiked: false,
    menu: "스테이크",
    tags: ["스테이크", "데이트", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 505",
      jibun: "서울특별시 성동구 성수동8가 999-00",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 22:00" },
      { days_of_the_week: "화", time: "11:00 - 22:00" },
      { days_of_the_week: "수", time: "11:00 - 22:00" },
      { days_of_the_week: "목", time: "11:00 - 22:00" },
      { days_of_the_week: "금", time: "11:00 - 23:00" },
      { days_of_the_week: "토", time: "12:00 - 23:00" },
      { days_of_the_week: "일", time: "12:00 - 23:00" },
    ],
  },
  {
    id: 13,
    name: "성수동 파스타",
    rating: 4.6,
    reviews: 110,
    isLiked: true,
    menu: "까르보나라",
    tags: ["파스타", "혼밥", "가성비"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 606",
      jibun: "서울특별시 성동구 성수동9가 111-22",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 21:00" },
      { days_of_the_week: "화", time: "11:00 - 21:00" },
      { days_of_the_week: "수", time: "11:00 - 21:00" },
      { days_of_the_week: "목", time: "11:00 - 21:00" },
      { days_of_the_week: "금", time: "11:00 - 22:00" },
      { days_of_the_week: "토", time: "12:00 - 22:00" },
      { days_of_the_week: "일", time: "12:00 - 22:00" },
    ],
  },
  {
    id: 14,
    name: "성수동 샐러드",
    rating: 4.3,
    reviews: 95,
    isLiked: false,
    menu: "그린 샐러드",
    tags: ["샐러드", "건강식", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 707",
      jibun: "서울특별시 성동구 성수동10가 333-44",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "10:00 - 20:00" },
      { days_of_the_week: "화", time: "10:00 - 20:00" },
      { days_of_the_week: "수", time: "10:00 - 20:00" },
      { days_of_the_week: "목", time: "10:00 - 20:00" },
      { days_of_the_week: "금", time: "10:00 - 21:00" },
      { days_of_the_week: "토", time: "11:00 - 21:00" },
      { days_of_the_week: "일", time: "11:00 - 21:00" },
    ],
  },
  {
    id: 15,
    name: "성수동 버거",
    rating: 4.4,
    reviews: 130,
    isLiked: false,
    menu: "수제버거",
    tags: ["버거", "테이크아웃", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 808",
      jibun: "서울특별시 성동구 성수동11가 555-66",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 22:00" },
      { days_of_the_week: "화", time: "11:00 - 22:00" },
      { days_of_the_week: "수", time: "11:00 - 22:00" },
      { days_of_the_week: "목", time: "11:00 - 22:00" },
      { days_of_the_week: "금", time: "11:00 - 23:00" },
      { days_of_the_week: "토", time: "12:00 - 23:00" },
      { days_of_the_week: "일", time: "12:00 - 23:00" },
    ],
  },
  {
    id: 16,
    name: "성수동 타코",
    rating: 4.2,
    reviews: 70,
    isLiked: false,
    menu: "타코",
    tags: ["타코", "혼밥", "가성비"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 909",
      jibun: "서울특별시 성동구 성수동12가 777-88",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 21:00" },
      { days_of_the_week: "화", time: "11:00 - 21:00" },
      { days_of_the_week: "수", time: "11:00 - 21:00" },
      { days_of_the_week: "목", time: "11:00 - 21:00" },
      { days_of_the_week: "금", time: "11:00 - 22:00" },
      { days_of_the_week: "토", time: "12:00 - 22:00" },
      { days_of_the_week: "일", time: "12:00 - 22:00" },
    ],
  },
  {
    id: 17,
    name: "성수동 커리",
    rating: 4.1,
    reviews: 85,
    isLiked: false,
    menu: "인도 커리",
    tags: ["커리", "혼밥", "가성비"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 1010",
      jibun: "서울특별시 성동구 성수동13가 999-00",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 22:00" },
      { days_of_the_week: "화", time: "11:00 - 22:00" },
      { days_of_the_week: "수", time: "11:00 - 22:00" },
      { days_of_the_week: "목", time: "11:00 - 22:00" },
      { days_of_the_week: "금", time: "11:00 - 23:00" },
      { days_of_the_week: "토", time: "12:00 - 23:00" },
      { days_of_the_week: "일", time: "12:00 - 23:00" },
    ],
  },
  {
    id: 18,
    name: "성수동 피쉬앤칩스",
    rating: 4.5,
    reviews: 60,
    isLiked: false,
    menu: "피쉬앤칩스",
    tags: ["피쉬앤칩스", "혼밥", "가성비"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 1111",
      jibun: "서울특별시 성동구 성수동14가 111-22",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 21:00" },
      { days_of_the_week: "화", time: "11:00 - 21:00" },
      { days_of_the_week: "수", time: "11:00 - 21:00" },
      { days_of_the_week: "목", time: "11:00 - 21:00" },
      { days_of_the_week: "금", time: "11:00 - 22:00" },
      { days_of_the_week: "토", time: "12:00 - 22:00" },
      { days_of_the_week: "일", time: "12:00 - 22:00" },
    ],
  },
  {
    id: 19,
    name: "성수동 브런치카페",
    rating: 4.0,
    reviews: 40,
    isLiked: false,
    menu: "브런치",
    tags: ["브런치", "디저트", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 1212",
      jibun: "서울특별시 성동구 성수동15가 333-44",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "09:00 - 20:00" },
      { days_of_the_week: "화", time: "09:00 - 20:00" },
      { days_of_the_week: "수", time: "09:00 - 20:00" },
      { days_of_the_week: "목", time: "09:00 - 20:00" },
      { days_of_the_week: "금", time: "09:00 - 21:00" },
      { days_of_the_week: "토", time: "10:00 - 21:00" },
      { days_of_the_week: "일", time: "10:00 - 21:00" },
    ],
  },
  {
    id: 20,
    name: "성수동 디저트카페",
    rating: 4.8,
    reviews: 150,
    isLiked: true,
    menu: "케이크",
    tags: ["디저트", "카페", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 1313",
      jibun: "서울특별시 성동구 성수동16가 555-66",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "10:00 - 20:00" },
      { days_of_the_week: "화", time: "10:00 - 20:00" },
      { days_of_the_week: "수", time: "10:00 - 20:00" },
      { days_of_the_week: "목", time: "10:00 - 20:00" },
      { days_of_the_week: "금", time: "10:00 - 21:00" },
      { days_of_the_week: "토", time: "11:00 - 21:00" },
      { days_of_the_week: "일", time: "11:00 - 21:00" },
    ],
  },
  {
    id: 21,
    name: "성수동 스무디",
    rating: 4.3,
    reviews: 55,
    isLiked: false,
    menu: "스무디",
    tags: ["스무디", "건강식", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 1414",
      jibun: "서울특별시 성동구 성수동17가 777-88",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "10:00 - 20:00" },
      { days_of_the_week: "화", time: "10:00 - 20:00" },
      { days_of_the_week: "수", time: "10:00 - 20:00" },
      { days_of_the_week: "목", time: "10:00 - 20:00" },
      { days_of_the_week: "금", time: "10:00 - 21:00" },
      { days_of_the_week: "토", time: "11:00 - 21:00" },
      { days_of_the_week: "일", time: "11:00 - 21:00" },
    ],
  },
  {
    id: 22,
    name: "성수동 와플",
    rating: 4.4,
    reviews: 65,
    isLiked: false,
    menu: "와플",
    tags: ["디저트", "간식", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 1515",
      jibun: "서울특별시 성동구 성수동18가 999-00",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "10:00 - 20:00" },
      { days_of_the_week: "화", time: "10:00 - 20:00" },
      { days_of_the_week: "수", time: "10:00 - 20:00" },
      { days_of_the_week: "목", time: "10:00 - 20:00" },
      { days_of_the_week: "금", time: "10:00 - 21:00" },
      { days_of_the_week: "토", time: "11:00 - 21:00" },
      { days_of_the_week: "일", time: "11:00 - 21:00" },
    ],
  },
  {
    id: 23,
    name: "성수동 핫도그",
    rating: 4.0,
    reviews: 45,
    isLiked: false,
    menu: "핫도그",
    tags: ["간식", "야식", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 1616",
      jibun: "서울특별시 성동구 성수동19가 111-22",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "10:00 - 20:00" },
      { days_of_the_week: "화", time: "10:00 - 20:00" },
      { days_of_the_week: "수", time: "10:00 - 20:00" },
      { days_of_the_week: "목", time: "10:00 - 20:00" },
      { days_of_the_week: "금", time: "10:00 - 21:00" },
      { days_of_the_week: "토", time: "11:00 - 21:00" },
      { days_of_the_week: "일", time: "11:00 - 21:00" },
    ],
  },
  {
    id: 24,
    name: "성수동 퓨전요리",
    rating: 4.6,
    reviews: 80,
    isLiked: false,
    menu: "퓨전 요리",
    tags: ["퓨전", "혼밥", "가성비"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 1717",
      jibun: "서울특별시 성동구 성수동20가 333-44",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 22:00" },
      { days_of_the_week: "화", time: "11:00 - 22:00" },
      { days_of_the_week: "수", time: "11:00 - 22:00" },
      { days_of_the_week: "목", time: "11:00 - 22:00" },
      { days_of_the_week: "금", time: "11:00 - 23:00" },
      { days_of_the_week: "토", time: "12:00 - 23:00" },
      { days_of_the_week: "일", time: "12:00 - 23:00" },
    ],
  },
  {
    id: 25,
    name: "성수동 국수집",
    rating: 4.2,
    reviews: 70,
    isLiked: false,
    menu: "칼국수",
    tags: ["국수", "혼밥", "가성비"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 1818",
      jibun: "서울특별시 성동구 성수동21가 555-66",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 21:00" },
      { days_of_the_week: "화", time: "11:00 - 21:00" },
      { days_of_the_week: "수", time: "11:00 - 21:00" },
      { days_of_the_week: "목", time: "11:00 - 21:00" },
      { days_of_the_week: "금", time: "11:00 - 22:00" },
      { days_of_the_week: "토", time: "12:00 - 22:00" },
      { days_of_the_week: "일", time: "12:00 - 22:00" },
    ],
  },
  {
    id: 26,
    name: "성수동 떡집",
    rating: 4.5,
    reviews: 90,
    isLiked: false,
    menu: "전통 떡",
    tags: ["떡", "디저트", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 1919",
      jibun: "서울특별시 성동구 성수동22가 777-88",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "10:00 - 20:00" },
      { days_of_the_week: "화", time: "10:00 - 20:00" },
      { days_of_the_week: "수", time: "10:00 - 20:00" },
      { days_of_the_week: "목", time: "10:00 - 20:00" },
      { days_of_the_week: "금", time: "10:00 - 21:00" },
      { days_of_the_week: "토", time: "11:00 - 21:00" },
      { days_of_the_week: "일", time: "11:00 - 21:00" },
    ],
  },
  {
    id: 27,
    name: "성수동 김치찌개",
    rating: 4.1,
    reviews: 55,
    isLiked: false,
    menu: "김치찌개",
    tags: ["찌개", "혼밥", "가성비"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 2020",
      jibun: "서울특별시 성동구 성수동23가 999-00",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 22:00" },
      { days_of_the_week: "화", time: "11:00 - 22:00" },
      { days_of_the_week: "수", time: "11:00 - 22:00" },
      { days_of_the_week: "목", time: "11:00 - 22:00" },
      { days_of_the_week: "금", time: "11:00 - 23:00" },
      { days_of_the_week: "토", time: "12:00 - 23:00" },
      { days_of_the_week: "일", time: "12:00 - 23:00" },
    ],
  },
  {
    id: 28,
    name: "성수동 찜닭",
    rating: 4.4,
    reviews: 80,
    isLiked: false,
    menu: "찜닭",
    tags: ["찜닭", "혼밥", "가성비"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 2121",
      jibun: "서울특별시 성동구 성수동24가 111-22",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 21:00" },
      { days_of_the_week: "화", time: "11:00 - 21:00" },
      { days_of_the_week: "수", time: "11:00 - 21:00" },
      { days_of_the_week: "목", time: "11:00 - 21:00" },
      { days_of_the_week: "금", time: "11:00 - 22:00" },
      { days_of_the_week: "토", time: "12:00 - 22:00" },
      { days_of_the_week: "일", time: "12:00 - 22:00" },
    ],
  },
  {
    id: 29,
    name: "성수동 족발집",
    rating: 4.7,
    reviews: 100,
    isLiked: false,
    menu: "족발",
    tags: ["족발", "야식", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 2222",
      jibun: "서울특별시 성동구 성수동25가 333-44",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 22:00" },
      { days_of_the_week: "화", time: "11:00 - 22:00" },
      { days_of_the_week: "수", time: "11:00 - 22:00" },
      { days_of_the_week: "목", time: "11:00 - 22:00" },
      { days_of_the_week: "금", time: "11:00 - 23:00" },
      { days_of_the_week: "토", time: "12:00 - 23:00" },
      { days_of_the_week: "일", time: "12:00 - 23:00" },
    ],
  },
  {
    id: 30,
    name: "성수동 만두집",
    rating: 4.3,
    reviews: 65,
    isLiked: false,
    menu: "김치만두",
    tags: ["만두", "혼밥", "가성비"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 2323",
      jibun: "서울특별시 성동구 성수동26가 555-66",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 21:00" },
      { days_of_the_week: "화", time: "11:00 - 21:00" },
      { days_of_the_week: "수", time: "11:00 - 21:00" },
      { days_of_the_week: "목", time: "11:00 - 21:00" },
      { days_of_the_week: "금", time: "11:00 - 22:00" },
      { days_of_the_week: "토", time: "12:00 - 22:00" },
      { days_of_the_week: "일", time: "12:00 - 22:00" },
    ],
  },
  {
    id: 31,
    name: "성수동 떡볶이",
    rating: 4.5,
    reviews: 75,
    isLiked: true,
    menu: "떡볶이",
    tags: ["분식", "혼밥", "가성비"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 2424",
      jibun: "서울특별시 성동구 성수동27가 777-88",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 22:00" },
      { days_of_the_week: "화", time: "11:00 - 22:00" },
      { days_of_the_week: "수", time: "11:00 - 22:00" },
      { days_of_the_week: "목", time: "11:00 - 22:00" },
      { days_of_the_week: "금", time: "11:00 - 23:00" },
      { days_of_the_week: "토", time: "12:00 - 23:00" },
      { days_of_the_week: "일", time: "12:00 - 23:00" },
    ],
  },
  {
    id: 32,
    name: "성수동 김밥집",
    rating: 4.2,
    reviews: 50,
    isLiked: false,
    menu: "김밥",
    tags: ["김밥", "혼밥", "가성비"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 2525",
      jibun: "서울특별시 성동구 성수동28가 111-22",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 21:00" },
      { days_of_the_week: "화", time: "11:00 - 21:00" },
      { days_of_the_week: "수", time: "11:00 - 21:00" },
      { days_of_the_week: "목", time: "11:00 - 21:00" },
      { days_of_the_week: "금", time: "11:00 - 22:00" },
      { days_of_the_week: "토", time: "12:00 - 22:00" },
      { days_of_the_week: "일", time: "12:00 - 22:00" },
    ],
  },
  {
    id: 33,
    name: "성수동 피자",
    rating: 4.6,
    reviews: 90,
    isLiked: false,
    menu: "마르게리타 피자",
    tags: ["피자", "테이크아웃", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 2626",
      jibun: "서울특별시 성동구 성수동29가 333-44",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 22:00" },
      { days_of_the_week: "화", time: "11:00 - 22:00" },
      { days_of_the_week: "수", time: "11:00 - 22:00" },
      { days_of_the_week: "목", time: "11:00 - 22:00" },
      { days_of_the_week: "금", time: "11:00 - 23:00" },
      { days_of_the_week: "토", time: "12:00 - 23:00" },
      { days_of_the_week: "일", time: "12:00 - 23:00" },
    ],
  },
  {
    id: 34,
    name: "성수동 스시",
    rating: 4.8,
    reviews: 120,
    isLiked: false,
    menu: "초밥",
    tags: ["스시", "혼밥", "가성비"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 2727",
      jibun: "서울특별시 성동구 성수동30가 555-66",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 22:00" },
      { days_of_the_week: "화", time: "11:00 - 22:00" },
      { days_of_the_week: "수", time: "11:00 - 22:00" },
      { days_of_the_week: "목", time: "11:00 - 22:00" },
      { days_of_the_week: "금", time: "11:00 - 23:00" },
      { days_of_the_week: "토", time: "12:00 - 23:00" },
      { days_of_the_week: "일", time: "12:00 - 23:00" },
    ],
  },
  {
    id: 35,
    name: "성수동 브런치",
    rating: 4.4,
    reviews: 85,
    isLiked: false,
    menu: "에그 베네딕트",
    tags: ["브런치", "디저트", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 2828",
      jibun: "서울특별시 성동구 성수동31가 777-88",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "09:00 - 20:00" },
      { days_of_the_week: "화", time: "09:00 - 20:00" },
      { days_of_the_week: "수", time: "09:00 - 20:00" },
      { days_of_the_week: "목", time: "09:00 - 20:00" },
      { days_of_the_week: "금", time: "09:00 - 21:00" },
      { days_of_the_week: "토", time: "10:00 - 21:00" },
      { days_of_the_week: "일", time: "10:00 - 21:00" },
    ],
  },
  {
    id: 36,
    name: "성수동 디저트",
    rating: 4.7,
    reviews: 95,
    isLiked: false,
    menu: "마카롱",
    tags: ["디저트", "카페", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 2929",
      jibun: "서울특별시 성동구 성수동32가 999-00",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "10:00 - 20:00" },
      { days_of_the_week: "화", time: "10:00 - 20:00" },
      { days_of_the_week: "수", time: "10:00 - 20:00" },
      { days_of_the_week: "목", time: "10:00 - 20:00" },
      { days_of_the_week: "금", time: "10:00 - 21:00" },
      { days_of_the_week: "토", time: "11:00 - 21:00" },
      { days_of_the_week: "일", time: "11:00 - 21:00" },
    ],
  },
  {
    id: 37,
    name: "성수동 스무디",
    rating: 4.3,
    reviews: 60,
    isLiked: false,
    menu: "과일 스무디",
    tags: ["스무디", "건강식", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 3030",
      jibun: "서울특별시 성동구 성수동33가 111-22",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "10:00 - 20:00" },
      { days_of_the_week: "화", time: "10:00 - 20:00" },
      { days_of_the_week: "수", time: "10:00 - 20:00" },
      { days_of_the_week: "목", time: "10:00 - 20:00" },
      { days_of_the_week: "금", time: "10:00 - 21:00" },
      { days_of_the_week: "토", time: "11:00 - 21:00" },
      { days_of_the_week: "일", time: "11:00 - 21:00" },
    ],
  },
  {
    id: 38,
    name: "성수동 와플",
    rating: 4.4,
    reviews: 70,
    isLiked: false,
    menu: "과일 와플",
    tags: ["디저트", "간식", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 3131",
      jibun: "서울특별시 성동구 성수동34가 333-44",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "10:00 - 20:00" },
      { days_of_the_week: "화", time: "10:00 - 20:00" },
      { days_of_the_week: "수", time: "10:00 - 20:00" },
      { days_of_the_week: "목", time: "10:00 - 20:00" },
      { days_of_the_week: "금", time: "10:00 - 21:00" },
      { days_of_the_week: "토", time: "11:00 - 21:00" },
      { days_of_the_week: "일", time: "11:00 - 21:00" },
    ],
  },
  {
    id: 39,
    name: "성수동 핫도그",
    rating: 4.0,
    reviews: 50,
    isLiked: false,
    menu: "치즈 핫도그",
    tags: ["간식", "야식", "혼밥"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 3232",
      jibun: "서울특별시 성동구 성수동35가 555-66",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "10:00 - 20:00" },
      { days_of_the_week: "화", time: "10:00 - 20:00" },
      { days_of_the_week: "수", time: "10:00 - 20:00" },
      { days_of_the_week: "목", time: "10:00 - 20:00" },
      { days_of_the_week: "금", time: "10:00 - 21:00" },
      { days_of_the_week: "토", time: "11:00 - 21:00" },
      { days_of_the_week: "일", time: "11:00 - 21:00" },
    ],
  },
  {
    id: 40,
    name: "성수동 퓨전요리",
    rating: 4.6,
    reviews: 80,
    isLiked: true,
    menu: "퓨전 파스타",
    tags: ["퓨전", "혼밥", "가성비"],
    images: [
      "/image/image_empty.svg",
      "/image/image_empty.svg",
      "/image/image_empty.svg",
    ],
    address: {
      road: "서울특별시 성동구 성수이로 3333",
      jibun: "서울특별시 성동구 성수동36가 777-88",
      postalCode: "04789",
    },
    timetable: [
      { days_of_the_week: "월", time: "11:00 - 22:00" },
      { days_of_the_week: "화", time: "11:00 - 22:00" },
      { days_of_the_week: "수", time: "11:00 - 22:00" },
      { days_of_the_week: "목", time: "11:00 - 22:00" },
      { days_of_the_week: "금", time: "11:00 - 23:00" },
      { days_of_the_week: "토", time: "12:00 - 23:00" },
      { days_of_the_week: "일", time: "12:00 - 23:00" },
    ],
  },
];
