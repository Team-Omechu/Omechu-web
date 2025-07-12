// app/restaurant-detail/page.tsx
import dynamic from "next/dynamic";

// 클라이언트 컴포넌트를 SSR 없이 불러오기
const RestaurantDetailClient = dynamic(
  () => import("./RestaurantDetailClient"),
  { ssr: false }
);

export default function RestaurantDetailPage() {
  return <RestaurantDetailClient />;
}
