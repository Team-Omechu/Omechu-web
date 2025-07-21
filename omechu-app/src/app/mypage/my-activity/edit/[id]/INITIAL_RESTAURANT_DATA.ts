type RestaurantInitialData = {
  id: number;
  restaurantName: string;
  menus: string[];
  selectedDays: string[];
  startTime: string;
  endTime: string;
  address: string;
  detailAddress: string;
  imageUrl: string;
};

const initialRestaurantData: RestaurantInitialData[] = [
  {
    id: 1,
    restaurantName: "삼겹살집 우주",
    menus: ["삼겹살", "목살", "된장찌개"],
    selectedDays: ["월", "화", "수", "목", "금"],
    startTime: "11:30",
    endTime: "22:00",
    address: "서울시 송파구 가락동 123-45",
    detailAddress: "3층 301호",
    imageUrl: "/images/test-samgyeopsal.jpg",
  },
  {
    id: 2,
    restaurantName: "그린샐러드하우스",
    menus: ["닭가슴살 샐러드", "연어 샐러드"],
    selectedDays: ["월", "화", "수", "목", "금"],
    startTime: "10:00",
    endTime: "20:00",
    address: "서울시 강남구 삼성동 42-1",
    detailAddress: "2층",
    imageUrl: "/images/salad.jpg",
  },
  {
    id: 3,
    restaurantName: "데일리브런치",
    menus: ["프렌치토스트", "팬케이크", "아메리카노"],
    selectedDays: ["토", "일"],
    startTime: "09:00",
    endTime: "15:00",
    address: "서울시 마포구 연남동 99-2",
    detailAddress: "1층",
    imageUrl: "/images/brunch.jpg",
  },
  {
    id: 4,
    restaurantName: "우주의 야식천국",
    menus: ["불닭볶음면", "치즈김밥", "떡볶이"],
    selectedDays: ["금", "토", "일"],
    startTime: "18:00",
    endTime: "03:00",
    address: "서울시 관악구 신림동 28-11",
    detailAddress: "지하 1층",
    imageUrl: "/images/snack.jpg",
  },
];

export default initialRestaurantData;
