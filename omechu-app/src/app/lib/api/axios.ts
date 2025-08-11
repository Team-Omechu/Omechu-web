import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/lib/stores/auth.store";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    const { refreshToken, user } = useAuthStore.getState();
    if (!refreshToken) {
      useAuthStore.getState().logout();
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
        useAuthStore.getState().login({
          accessToken: newAccess,
          refreshToken,
          user,
        });
      } else {
        useAuthStore.getState().setAccessToken(newAccess);
        useAuthStore.getState().setRefreshToken(refreshToken);
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
      useAuthStore.getState().logout();
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
