import { MenuDetail } from "@/lib/types/menu";
import axiosInstance from "../../../shared_FSD/api/axiosInstance";

export const getMenuDetail = async (
  name: string,
  opts?: { signal?: AbortSignal },
): Promise<MenuDetail> => {
  if (!name) throw new Error("menu name is required");

  const res = await axiosInstance.post<MenuDetail>(
    "/menu-info",
    { name: name.trim() },
    {
      headers: { "Content-Type": "application/json" },
      signal: opts?.signal,
    },
  );
  return res.data;
};
