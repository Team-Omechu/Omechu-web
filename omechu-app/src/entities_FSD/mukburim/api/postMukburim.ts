import { mukburimResponse } from "../config/mukburim";

export const postMukburim = async (
  menuName: string,
): Promise<mukburimResponse> => {
  const { data } = await axiosInstance.post<mukburimResponse>("/mukburim", {
    menu_name: menuName,
  });
  return data;
};
