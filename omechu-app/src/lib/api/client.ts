import axios, { type AxiosInstance } from "axios";
// 경로 수정: @가 src/app을 가리키므로, 상위 폴더로 나가서 참조합니다.
import { useAuthStore } from "@/auth/store";

const apiClient: AxiosInstance = axios.create({
  // 기본 baseURL은 외부 API 서버로 설정합니다.
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // ★★★ 이 로그는 브라우저 개발자 콘솔에서 확인해야 합니다! ★★★
    console.log("[API Client] Intercepting request for URL:", config.url);

    if (config.url?.startsWith("/api/")) {
      console.log("[API Client] URL starts with /api/. Changing baseURL.");
      config.baseURL =
        typeof window !== "undefined" ? window.location.origin : "/";
      console.log("[API Client] New baseURL:", config.baseURL);
    } else {
      console.log(
        "[API Client] URL does NOT start with /api/. Using default baseURL:",
        process.env.NEXT_PUBLIC_API_URL,
      );
      config.baseURL = process.env.NEXT_PUBLIC_API_URL;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 에러(인증 실패) 시, 스토어의 유저 정보를 비웁니다.
    if (error.response?.status === 401) {
      const { user } = useAuthStore.getState();
      if (user) {
        useAuthStore.getState().setUser(null);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
