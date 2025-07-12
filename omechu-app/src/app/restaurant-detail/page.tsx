// app/restaurant-detail/page.tsx
import dynamic from "next/dynamic";

const RestaurantDetailClient = dynamic(
  () => import("./RestaurantDetailClient"), // 실제 클라이언트 컴포넌트
  { ssr: false }
);

export default function RestaurantDetailPage() {
  return <RestaurantDetailClient />;
}
