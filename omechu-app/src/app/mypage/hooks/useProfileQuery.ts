import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../api/profile";
import { ProfileType } from "../types/profileType";

export function useProfileQuery() {
  return useQuery<ProfileType, Error>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 10, // (옵션) 10분 간 fresh
    retry: 1, // (옵션) 실패시 1회 재시도
    refetchOnWindowFocus: false, // (옵션)
  });
}
