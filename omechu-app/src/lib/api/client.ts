import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/auth/store";

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 기본 설정 유지
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    console.log("[API Client] Intercepting request for URL:", config.url);

    // 모든 요청에 대해 withCredentials를 true로 명시적으로 설정하여
    // cross-origin 요청에서도 쿠키가 전송되도록 보장합니다.
    config.withCredentials = true;

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
      // baseURL을 다시 설정할 필요가 없습니다. create에서 이미 설정됨.
      // config.baseURL = process.env.NEXT_PUBLIC_API_URL;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
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
