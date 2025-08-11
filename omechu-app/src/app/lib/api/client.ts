import axios, { type AxiosInstance } from "axios";

import { useAuthStore } from "@/lib/stores/auth.store";

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // 세션/쿠키 기반 인증을 위해 모든 요청에 쿠키를 자동으로 포함시킵니다.
  withCredentials: true,
});

// 요청 인터셉터:
// 이 로직은 나중에 소셜 로그인을 통해 accessToken이 발급되었을 때를 대비한 것입니다.
// 일반 로그인 사용자는 store.accessToken이 null이므로 아무것도 실행되지 않습니다.
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터:
// 복잡한 토큰 재발급 로직을 모두 제거합니다.
// 401(Unauthorized) 에러는 "로그인이 필요하다"는 명확한 신호로만 해석합니다.
/*
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 서버로부터 401 응답을 받으면, 클라이언트의 로그인 상태를 동기화(로그아웃)합니다.
    // PrivateRoute가 이 상태 변화를 감지하고 로그인 페이지로 보낼 것입니다.
    if (error.response?.status === 401) {
      const { isLoggedIn } = useAuthStore.getState();
      if (isLoggedIn) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  },
);
*/

// 응답 인터셉터 로직을 잠시 비활성화하고, 간단하게 에러를 그대로 반환하도록 수정합니다.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 서버로부터 401 응답을 받으면, 클라이언트의 로그인 상태를 동기화(로그아웃)합니다.
    // PrivateRoute가 이 상태 변화를 감지하고 로그인 페이지로 보낼 것입니다.
    if (error.response?.status === 401) {
      const { isLoggedIn } = useAuthStore.getState();
      if (isLoggedIn) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
