import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfile } from "../api/profile";
import { ProfileType } from "../types/profileType";

export function useProfileQuery() {
  const qc = useQueryClient();

  return useQuery<ProfileType, Error>({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        return await fetchProfile();
      } catch (e: any) {
        // Axios/fetch 래퍼가 304를 에러로 throw 하는 경우 대비
        const status = e?.code ?? e?.response?.status;
        if (status === 304) {
          const cached = qc.getQueryData<ProfileType>(["profile"]);
          if (cached) return cached; // 캐시가 있으면 그대로 반환 → 로딩 종료
        }
        throw e;
      }
    },
    // 기존 옵션 유지 + 리페치 루프/깜빡임 방지
    staleTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    placeholderData: (prev) => prev, // 이전 데이터 유지하며 refetch 시 레이아웃 안정화
  });
}
