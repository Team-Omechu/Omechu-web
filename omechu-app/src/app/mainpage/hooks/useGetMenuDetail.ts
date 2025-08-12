import { useQuery } from "@tanstack/react-query";
import { getMenuDetail } from "../api/api";
import { MenuListResponse } from "@/constant/mainpage/resultData";

function useGetMenuDetail(menu_name: string) {
  return useQuery<MenuListResponse>({
    queryKey: ["menuDetail", menu_name],
    queryFn: () => getMenuDetail(menu_name),
})
}

export default useGetMenuDetail;