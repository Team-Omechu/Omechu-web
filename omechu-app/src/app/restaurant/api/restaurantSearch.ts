import axiosInstance from "@/lib/api/axios";
import type { Restaurant } from "@/lib/types/restaurant";

// 서버 응답 타입
interface SearchSuccess {
  restData: any[];
  hasNextPage: boolean;
  nextCursor: number | null;
}
interface SearchResponse {
  resultType: "SUCCESS" | "FAIL";
  error: any | null;
  success: SearchSuccess;
}

export interface SearchParams {
  menu?: string; // 예: "스파게티"
  tag?: string | string[]; // ✅ 배열 가능
  location?: string | string[]; // ✅ 배열 가능
  cursor: number; // required by API
  limit: number; // required by API
}

function mapApiToRestaurant(apiData: any): Restaurant {
  const menus = apiData.repre_menu?.map((i: any) => i.menu) ?? [];
  return {
    id: Number(apiData.id),
    google_place_id: apiData.google_place_id ?? "",
    name: apiData.name,
    address: apiData.address,
    rating: apiData.rating,
    images: [apiData.rest_image],
    rest_tag: apiData.rest_tag ?? [],
    menus,
    like: apiData.zzim ?? false,
    reviews: apiData._count?.review ?? 0,
  };
}

export async function searchRestaurants(p: SearchParams) {
  const menu = p.menu?.trim();
  const cursor = String(p.cursor ?? 1);
  const limit = String(p.limit ?? 8);

  const query = new URLSearchParams();

  if (menu) query.append("menu", menu);

  // ✅ tag 여러 개 처리
  if (p.tag) {
    const tags = Array.isArray(p.tag) ? p.tag : [p.tag];
    tags.forEach((t) => {
      const trimmed = t.trim();
      if (trimmed) query.append("tag", trimmed);
    });
  }

  // ✅ location 여러 개 처리
  if (p.location) {
    const locations = Array.isArray(p.location) ? p.location : [p.location];
    locations.forEach((loc) => {
      const trimmed = loc.trim();
      if (trimmed) query.append("location", trimmed);
    });
  }

  query.append("cursor", cursor);
  query.append("limit", limit);

  const url = `/place/search?${query.toString()}`;
  console.log("GET", axiosInstance.defaults.baseURL + url);

  const res = await axiosInstance.get<SearchResponse>(url, {
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
  });

  const body = res.data;
  if (body?.resultType !== "SUCCESS") {
    const msg =
      (body?.error && (body.error.message || body.error)) ||
      "검색 요청에 실패했습니다.";
    throw new Error(String(msg));
  }

  const s = body.success ?? {
    restData: [],
    hasNextPage: false,
    nextCursor: null,
  };

  const items = (s.restData ?? []).map(mapApiToRestaurant);

  const parsedNext =
    s.nextCursor === null || s.nextCursor === undefined
      ? null
      : Number(s.nextCursor);

  return {
    items,
    hasNextPage: Boolean(s.hasNextPage),
    nextCursor: Number.isFinite(parsedNext as number)
      ? (parsedNext as number)
      : null,
  };
}

// 무한스크롤 훅
import { useCallback, useRef, useState } from "react";

export function useRestaurantSearch(
  initial: Omit<SearchParams, "cursor" | "limit">,
) {
  const [items, setItems] = useState<Restaurant[]>([]);
  const [cursor, setCursor] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isError, setIsError] = useState(false);

  const isFetchingRef = useRef(false);
  const lastCursorRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    setItems([]);
    setCursor(1);
    setHasMore(true);
    setIsError(false);
    isFetchingRef.current = false;
    lastCursorRef.current = null;
  }, []);

  const fetchNext = useCallback(async () => {
    if (isLoading || !hasMore || isFetchingRef.current) return;
    if (lastCursorRef.current === cursor) return; // 같은 커서 재요청 방지
    lastCursorRef.current = cursor;

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      setIsError(false);

      const {
        items: fetched,
        hasNextPage,
        nextCursor,
      } = await searchRestaurants({
        ...initial,
        cursor,
        limit: 8,
      });

      // ✅ dedupe 병합
      setItems((prev) => {
        const map = new Map<number, Restaurant>();
        for (const it of prev) map.set(it.id, it);
        for (const it of fetched) map.set(it.id, it);
        return Array.from(map.values());
      });

      setHasMore(Boolean(hasNextPage));
      if (typeof nextCursor === "number") setCursor(nextCursor);
      else setHasMore(false);
    } catch (err) {
      console.error("검색 실패:", err);
      setIsError(true);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [initial, cursor, isLoading, hasMore]);

  return { items, fetchNext, isLoading, hasMore, reset, isError };
}
