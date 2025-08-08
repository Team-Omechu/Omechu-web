import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/auth/store";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { user } = useAuthStore.getState();
      if (user) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
