import { ProfileResponse } from "@/constant/mainpage/profile";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/api";
// ← 타입 import

export const useProfileQuery = () =>
  useQuery<ProfileResponse>({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    staleTime: 1000 * 60 * 5, // 5분간 fresh (옵션)
  });
