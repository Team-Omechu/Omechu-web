import { useMutation } from "@tanstack/react-query";

import type { LoginFormValues } from "@/auth/schemas/auth.schema";
import { useAuthStore } from "@/auth/store";
import * as authApi from "@/lib/api/auth";
import type { LoginSuccessData } from "@/lib/api/auth";

export const useLoginMutation = () => {
  const { setUser } = useAuthStore();

  return useMutation<LoginSuccessData, Error, LoginFormValues>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: (error) => {
      console.error("로그인 실패:", error.message);
    },
  });
};
