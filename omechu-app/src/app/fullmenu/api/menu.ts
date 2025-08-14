import axiosInstance from "@/lib/api/axios";
import { Menu, MenuDetail } from "@/lib/types/menu";

export interface FilterParams {
  cuisine?: string;
  minCalory?: number;
  maxCalory?: number;
  allergies?: string[];
  sortBy?: "calory" | "name" | "protein" | "carbo";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  tags?: string; // For /menu/filtered API - comma-separated string
}

export interface MenusResponse {
  resultType: string;
  error?: any;
  success?: Menu[];
}

export interface MenuInfoResponse {
  resultType: string;
  error?: any;
  success?: MenuDetail;
}

export const getMenus = async (params?: FilterParams): Promise<MenusResponse> => {
  const response = await axiosInstance.get("/menu", { params });
  return response.data;
};

export const getRandomMenu = async (): Promise<MenuInfoResponse> => {
  const response = await axiosInstance.get("/menu/random");
  return response.data;
};

export const getFilteredMenus = async (filters: FilterParams): Promise<MenusResponse> => {
  const response = await axiosInstance.get("/menu/filtered", { params: filters });
  return response.data;
};

export const getMenuInfo = async (menuName: string): Promise<MenuInfoResponse> => {
  const response = await axiosInstance.post("/menu-info", { name: menuName });
  return response.data;
};