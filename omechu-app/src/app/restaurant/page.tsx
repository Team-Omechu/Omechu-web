import { Suspense } from "react";
import RestaurantPage from "@/restaurant/components/RestaurantPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RestaurantPage />
    </Suspense>
  );
}
