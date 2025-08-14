// /mainpage/hooks/useHeart.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addHeart, deleteHeart, getMyHeartsIds } from "../api/api";
import { useAuthStore } from "@/lib/stores/auth.store";

export const HEARTS_KEY = ["hearts", "list"] as const;

export default function useLikedList() {
  const { isLoggedIn } = useAuthStore();
  return useQuery({
    queryKey: HEARTS_KEY,
    queryFn: getMyHeartsIds,
    enabled: isLoggedIn, // 비로그인 상태면 호출 안 함
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function usePostHeart(restaurantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => addHeart(restaurantId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: HEARTS_KEY }); // 최종 동기화
    },
  });
}

export function useDeleteHeart(restaurantId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteHeart(restaurantId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: HEARTS_KEY });
    },
  });
}
