import axiosInstance from "@/lib/api/axios";
import { Restaurant, RestaurantDetail } from "@/lib/types/restaurant";
import { useCallback, useRef, useState } from "react";

interface OpeningHour {
  [key: string]: string; // 예: "monday": "11:00-19:00"
}

export interface RegisterRestaurantPayload {
  imageUrl?: string;
  name: string;
  repre_menu: string[];
  opening_hour: OpeningHour;
  address: string;
}

function mapApiToRestaurant(apiData: any): Restaurant {
  const menus = Array.isArray(apiData.repre_menu)
    ? apiData.repre_menu.map((item: any) => item.menu)
    : [];

  return {
    id: Number(apiData.id),
    name: apiData.name,
    address: apiData.address,
    rating: apiData.rating,
    images: [apiData.rest_image],
    rest_tag: apiData.rest_tag ?? [],
    menus: menus,
    like: apiData.zzim ?? false,
    reviews: apiData._count?.review ?? 0,
  };
}

export function useRestaurantList() {
  const [restaurantList, setRestaurantList] = useState<Restaurant[]>([]);
  const [cursor, setCursor] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetchingRef = useRef(false);
  const lastCursorRef = useRef<number | null>(null);

  const fetchRestaurants = useCallback(async () => {
    if (isLoading || !hasMore || isFetchingRef.current) return;
    if (lastCursorRef.current === cursor) return; // 같은 커서 재요청 방지

    try {
      isFetchingRef.current = true;
      setIsLoading(true);

      const res = await axiosInstance.get("/place", {
        params: {
          cursor: cursor.toString(),
          limit: "8",
        },
      });

      const data = res.data?.success;
      console.log("🍽️ 맛집 리스트 로딩:", data);

      const mapped = (data.restData ?? []).map(mapApiToRestaurant);
      const seenInPage = new Set<number>();
      const fetched = mapped.filter((r: Restaurant) => {
        if (seenInPage.has(r.id)) return false;
        seenInPage.add(r.id);
        return true;
      });
      console.log("🍽️ 맛집 리스트 매핑 완료:", fetched);

      setRestaurantList((prev) => {
        const map = new Map<number, Restaurant>();
        for (const it of prev) map.set(it.id, it);
        for (const it of fetched) map.set(it.id, it);
        return Array.from(map.values());
      });

      const next =
        data.nextCursor === null || data.nextCursor === undefined
          ? null
          : Number(data.nextCursor);

      const hasNext = Boolean(data.hasNextPage);
      if (hasNext && Number.isFinite(next as number)) {
        lastCursorRef.current = cursor;
        setCursor(next as number);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("🍽️ 맛집 리스트 로딩 오류:", error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [cursor, isLoading, hasMore]);

  const reset = () => {
    setRestaurantList([]);
    setCursor(1);
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

export const registerRestaurant = async (
  payload: RegisterRestaurantPayload,
) => {
  const response = await axiosInstance.post(`/place`, payload, {
    withCredentials: true, // ✅ 쿠키 포함
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

function mapApiToRestaurantDetail(apiData: any): RestaurantDetail {
  return {
    id: Number(apiData.id),
    name: apiData.name,
    address: apiData.address,
    addressJibeon: apiData.address_jibeon,
    postalCode: apiData.postal_code,
    repreMenu: Array.isArray(apiData.repreMenu)
      ? apiData.repreMenu.map((m: any) => ({ menu: m?.menu ?? "" }))
      : [],
    rating: apiData.rating,
    currentOpeningHours: apiData.currentOpeningHours ?? [],
    googlePlaceId: apiData.googlePlaceId,
    reviewImages: (apiData.reviewImage ?? []).map((img: any) => ({
      id: Number(img.id),
      link: img.link,
    })),
    zzim: apiData.zzim ?? false,
  };
}

export async function getRestaurantDetail(
  id: number,
): Promise<RestaurantDetail> {
  const res = await axiosInstance.get(`/place/detail/${id}`);
  const json = res.data;
  console.log("맛집 상세 정보 로딩:", json);
  return mapApiToRestaurantDetail(json);
}
