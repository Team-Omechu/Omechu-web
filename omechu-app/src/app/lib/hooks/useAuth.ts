import { useMutation, useQuery } from "@tanstack/react-query";

import type { LoginFormValues } from "@/auth/schemas/auth.schema";
import { useAuthStore } from "@/auth/store";
import * as authApi from "@/lib/api/auth";
import type { LoginSuccessData } from "@/lib/api/auth";

export const useLoginMutation = () => {
  const { login: setLoginState } = useAuthStore();

  return useMutation<LoginSuccessData, Error, LoginFormValues>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const accessToken = data.accessToken;
      setLoginState({ accessToken, user: data });
      console.log("로그인 성공:", data);
    },
    onError: (error) => {
      // 실패 시 로직 (예: 토스트 메시지 표시)
      console.error("로그인 실패:", error.message);
    },
  });
};

export const useUserQuery = () => {
  return useQuery({
    // queryKey는 TanStack Query가 데이터를 캐싱하고 관리하는 데 사용하는 고유 키입니다.
    queryKey: ["user", "me"],
    // queryFn은 실제로 데이터를 가져오는 비동기 함수입니다.
    // auth.ts 파일에 이미 만들어져 있는 getCurrentUser를 사용합니다.
    queryFn: authApi.getCurrentUser,
    // 이 쿼리는 사용자가 앱에 처음 들어왔을 때 세션이 있는지 확인하는 용도이므로,
    // 실패 시 자동으로 재시도할 필요는 없습니다.
    retry: false,
    // 창에 포커스가 돌아올 때마다 데이터를 다시 가져오지 않도록 설정합니다.
    refetchOnWindowFocus: false,
    // 컴포넌트가 마운트될 때마다 데이터를 다시 가져오지 않도록 설정합니다.
    refetchOnMount: false,
  });
};
