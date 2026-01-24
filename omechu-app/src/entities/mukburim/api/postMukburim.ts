import { mukburimResponse } from "@/entities/mukburim/config/mukburim";
import { axiosInstance } from "@/shared";

export const postMukburim = async (
  menuName: string,
): Promise<mukburimResponse> => {
  const { data } = await axiosInstance.post<mukburimResponse>("/mukburim", {
    menu_name: menuName,
  });
  return data;
};
