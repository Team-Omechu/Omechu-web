import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchProfile, updateProfile } from "@/entities/user/api/profileApi";
import { useAuthStore } from "@/entities/user/model/auth.store";
import type { UpdateProfileBody } from "@/entities/user/model/profile.types";

export function useProfile() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data, isLoading, error, isSuccess, isError } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: fetchProfile,
    enabled: !!accessToken,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 10,
  });

  const resolvedData = accessToken ? data ?? null : null;

  return {
    profile: resolvedData,
    loading: isLoading,
    error:
      accessToken && error
        ? { message: "프로필 정보를 불러올 수 없습니다.", raw: error }
        : null,
    isSuccess,
    isError,
    data: resolvedData,
  };
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: UpdateProfileBody) => updateProfile(data),
    onSuccess: (updatedProfile) => {
      setUser(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
}
