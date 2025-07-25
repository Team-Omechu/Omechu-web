import axios from "axios";
import { reissueToken } from "@/auth/api/auth";
import useAuthStore from "@/auth/store";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { accessToken } = await reissueToken();
        useAuthStore
          .getState()
          .login(accessToken, useAuthStore.getState().user);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (reissueError) {
        useAuthStore.getState().logout();
        // Optionally redirect to login page
        return Promise.reject(reissueError);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
