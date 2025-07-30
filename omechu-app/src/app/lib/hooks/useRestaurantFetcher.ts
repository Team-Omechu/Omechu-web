import { useCallback, useState } from "react";
import { Restaurant } from "../types/restaurant";

export function useRestaurantFetcher(filters: string[], keywords: string[]) {
  const [restaurantList, setRestaurantList] = useState<Restaurant[]>([]);
  const [cursor, setCursor] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchRestaurants = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    const res = await fetch(`/api/place?cursor=${cursor}&limit=18`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        location: filters,
        keyword: keywords,
      }),
    });

    const data = await res.json();
    const fetched = data.restdata ?? [];

    setRestaurantList((prev) => [...prev, ...fetched]);
    if (fetched.length < 18) setHasMore(false);
    else setCursor(fetched[fetched.length - 1]?.id ?? "");

    setIsLoading(false);
  }, [cursor, filters, keywords, isLoading, hasMore]);

  const reset = () => {
    setRestaurantList([]);
    setCursor("");
    setHasMore(true);
  };

  return {
    restaurantList,
    fetchRestaurants,
    isLoading,
    hasMore,
    reset,
  };
}
