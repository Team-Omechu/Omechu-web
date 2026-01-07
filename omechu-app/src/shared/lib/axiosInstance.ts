import axios, { type AxiosInstance } from "axios";

// 순수 axios instance (FSD: shared는 다른 레이어에 의존하지 않음)
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Auth store 인터페이스 (의존성 주입용)
export interface AuthStoreGetter {
  getState: () => {
    accessToken: string | null;
    refreshToken: string | null;
    user: unknown;
    login: (data: {
      accessToken: string;
      refreshToken: string;
      user: unknown;
    }) => void;
    logout: () => void;
    setAccessToken: (token: string | null) => void;
    setRefreshToken: (token: string | null) => void;
  };
}

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];
let authStoreRef: AuthStoreGetter | null = null;

/**
 * Interceptor 설정 함수 (app 레이어에서 호출)
 * FSD 규칙: shared는 entities에 의존하지 않고, app에서 의존성을 주입받음
 */
export const setupAxiosInterceptors = (authStore: AuthStoreGetter) => {
  authStoreRef = authStore;

  // Request interceptor: accessToken 주입
  axiosInstance.interceptors.request.use(
    (config) => {
      const { accessToken } = authStoreRef!.getState();
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor: 401 처리 및 토큰 재발급
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config || {};
      if (error.response?.status !== 401 || original._retry) {
        return Promise.reject(error);
      }
      original._retry = true;

      const store = authStoreRef!.getState();

      // 로그아웃 시도 중에는 재발급을 하지 않는다
      if (
        typeof original.url === "string" &&
        original.url.includes("/auth/logout")
      ) {
        store.logout();
        return Promise.reject(error);
      }

      const { refreshToken, user } = store;
      if (!refreshToken) {
        store.logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push((newToken) => {
            if (newToken)
              original.headers = {
                ...(original.headers || {}),
                Authorization: `Bearer ${newToken}`,
              };
            resolve(axiosInstance(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/reissue`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } },
        );
        const newAccess = res.data?.success?.accessToken;
        if (!newAccess) throw new Error("No access token returned");

        if (user) {
          store.login({
            accessToken: newAccess,
            refreshToken,
            user,
          });
        } else {
          store.setAccessToken(newAccess);
          store.setRefreshToken(refreshToken);
        }

        original.headers = {
          ...(original.headers || {}),
          Authorization: `Bearer ${newAccess}`,
        };
        pendingQueue.forEach((cb) => cb(newAccess));
        pendingQueue = [];
        return axiosInstance(original);
      } catch (e) {
        pendingQueue.forEach((cb) => cb(null));
        pendingQueue = [];
        store.logout();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    },
  );
};

export const api = axiosInstance;
export default axiosInstance;
