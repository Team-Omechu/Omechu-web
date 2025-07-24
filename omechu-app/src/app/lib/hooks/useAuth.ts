import { useMutation } from "@tanstack/react-query";

import * as authApi from "@/lib/api/auth";
import type { LoginFormValues } from "@/lib/schemas/auth.schema";
import useAuthStore from "@/lib/stores/auth.store";

export const useLoginMutation = () => {
  const { login: setLoginState } = useAuthStore();

  return useMutation<authApi.LoginSuccessData, Error, LoginFormValues>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // TODO: 백엔드에서 accessToken을 내려주면 그걸 받아서 저장해야 합니다.
      // 지금은 임시로 더미 토큰을 사용합니다.
      const MOCK_ACCESS_TOKEN = "DUMMY_ACCESS_TOKEN_FROM_LOGIN";
      setLoginState(MOCK_ACCESS_TOKEN, data);

      // 성공 후 로직 (예: 메인 페이지로 이동)
      console.log("로그인 성공:", data);
      // router.push('/');
    },
    onError: (error) => {
      // 실패 시 로직 (예: 토스트 메시지 표시)
      console.error("로그인 실패:", error.message);
    },
  });
}; 