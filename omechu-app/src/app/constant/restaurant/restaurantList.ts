// mockData
export const restaurantList = [
  {
    id: 1,
    name: "오레노 라멘 합정 본점",
    category: "라멘",
    images: [
      "/restaurant_blank.png",
      "/restaurant_blank.png",
      "/restaurant_blank.png",
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
    name: "삼거리 포차 성수점",
    category: "포장마차",
    images: ["/restaurant_blank.png", "/restaurant_blank.png"],
    address: {
      road: "서울 성동구 성수일로 123",
      jibun: "서울 성동구 성수동2가 321-4",
      postalCode: "06789",
    },
    timetable: [
      { days_of_the_week: "월", time: "17:00 - 02:00" },
      { days_of_the_week: "화", time: "17:00 - 02:00" },
      { days_of_the_week: "수", time: "17:00 - 02:00" },
      { days_of_the_week: "목", time: "17:00 - 02:00" },
      { days_of_the_week: "금", time: "17:00 - 03:00" },
      { days_of_the_week: "토", time: "17:00 - 03:00" },
      { days_of_the_week: "일", time: "휴일" },
    ],
  },
];
