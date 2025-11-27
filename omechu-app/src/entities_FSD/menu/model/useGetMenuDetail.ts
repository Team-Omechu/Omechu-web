// /mainpage/hooks/useGetMenuDetail.ts
import { MenuDetail } from "@/lib/types/menu";
import { useQuery } from "@tanstack/react-query";
import { getMenuDetail } from "../api/getMenuDetail";

export function useGetMenuDetail(menuName?: string) {
  return useQuery<MenuDetail>({
    queryKey: ["menuDetail", (menuName ?? "").trim()],
    queryFn: ({ queryKey, signal }) =>
      getMenuDetail(queryKey[1] as string, { signal }),
    enabled: !!menuName,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    refetchOnWindowFocus: false,
    retry: 0,
    gcTime: 5 * 60 * 1000,
  });
}
