import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfile } from "@/mypage/api/profile";
import { ProfileType } from "../types/profileType";

// 보장된 종료를 위한 타임아웃 가드
function withTimeout<T>(p: Promise<T>, ms = 7000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => {
      const err: any = new Error("PROFILE_TIMEOUT");
      err.code = "TIMEOUT";
      reject(err);
    }, ms);
    p.then((v) => {
      clearTimeout(id);
      resolve(v);
    }).catch((e) => {
      clearTimeout(id);
      reject(e);
    });
  });
}

export function useProfileQuery() {
  const qc = useQueryClient();

  return useQuery<ProfileType, Error>({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const res = await withTimeout(fetchProfile());
        // 응답 유효성 최소 보장
        if (!res || typeof res !== "object") {
          const err: any = new Error("EMPTY_PROFILE");
          err.code = "EMPTY";
          throw err;
        }
        return res as ProfileType;
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
    // 리페치 루프/깜빡임 방지 및 안정화 옵션
    staleTime: 60 * 1000, // 1분 간 fresh
    retry: 0, // 무한 재시도 방지
    refetchOnMount: "always", // 로그인 후 최초 진입 시 다시 가져오도록 수정
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: (prev) => prev, // 이전 데이터 유지하며 refetch 시 레이아웃 안정화
  });
}
