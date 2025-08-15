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
  tag?: string; // 예: "아침식사"
  location?: string; // 예: "서울 강남구 신사동"
  cursor: number; // required by API
  limit: number; // required by API
}

function mapApiToRestaurant(apiData: any): Restaurant {
  const menus = apiData.repre_menu?.map((i: any) => i.menu) ?? [];
  return {
    id: Number(apiData.id),
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
  // 1) 빈 값 제거 + 문자열 정리
  const params: Record<string, string> = {
    cursor: String(p.cursor ?? 1),
    limit: String(p.limit ?? 8),
  };
  // 파라미터 정리
  const menu = p.menu?.trim();
  const tag = p.tag?.trim();
  const location = p.location?.trim();
  const cursor = String(p.cursor ?? 1);
  const limit = String(p.limit ?? 8);

  // 순서대로 URL 직접 생성
  const query = new URLSearchParams();
  if (menu) query.append("menu", menu);
  if (Array.isArray(p.tag)) {
    p.tag.forEach((t) => {
      const trimmed = t.trim();
      if (trimmed) query.append("tag", trimmed);
    });
  }
  if (Array.isArray(p.location)) {
    p.location.forEach((loc) => {
      const trimmed = loc.trim();
      if (trimmed) query.append("location", trimmed);
    });
  }
  query.append("cursor", cursor);
  query.append("limit", limit);

  const url = `/place/search?${query.toString()}`;
  console.log("GET", axiosInstance.defaults.baseURL + url);

  // 2) 요청 (타임아웃은 선택)
  const res = await axiosInstance.get<SearchResponse>(url, {
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
  });

  // 3) 성공/실패 분기
  const body = res.data;
  if (body?.resultType !== "SUCCESS") {
    // 서버가 에러 메시지를 내려주면 같이 throw
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

  // 4) 데이터 매핑
  const items = (s.restData ?? []).map(mapApiToRestaurant);

  // 5) nextCursor 정규화 (string -> number, null 허용)
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
  const [cursor, setCursor] = useState<number>(1);
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
