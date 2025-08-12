// /mainpage/hooks/useGetMenuDetail.ts
import { useQuery } from "@tanstack/react-query";
import { getMenuDetail } from "../api/api";
import type { MenuDetail } from "@/constant/mainpage/resultData";

export default function useGetMenuDetail(menuName?: string) {
  return useQuery<MenuDetail>({
    queryKey: ["menuDetail", (menuName ?? "").trim()],
    queryFn: ({ queryKey, signal }) =>
      getMenuDetail(queryKey[1] as string, { signal }),
    enabled: !!menuName,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    retry: 0,
    gcTime: 5 * 60 * 1000,
  });
}
