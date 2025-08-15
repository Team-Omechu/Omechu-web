import {
  useQuery,
  useMutation,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  getMenus,
  getFilteredMenus,
  getMenuInfo,
  getRandomMenu,
  type FilterParams,
  type MenusResponse,
  type MenuInfoResponse,
} from "../api/menu";

export const useGetMenusQuery = (
  params?: FilterParams,
): UseQueryResult<MenusResponse> => {
  return useQuery({
    queryKey: ["menus", params],
    queryFn: () => getMenus(params),
  });
};

export const useGetFilteredMenusQuery = (
  filters: FilterParams,
  enabled: boolean = true,
): UseQueryResult<MenusResponse> => {
  return useQuery({
    queryKey: ["filteredMenus", filters],
    queryFn: () => getFilteredMenus(filters),
    enabled,
  });
};

export const useGetMenuInfoQuery = (
  menuName: string,
  enabled: boolean = true,
): UseQueryResult<MenuInfoResponse> => {
  return useQuery({
    queryKey: ["menuInfo", menuName],
    queryFn: () => {
      console.log("Calling getMenuInfo with:", menuName);
      return getMenuInfo(menuName);
    },
    enabled: enabled && !!menuName,
    staleTime: 0, // Always refetch to ensure POST request
    gcTime: 0, // Don't cache to ensure fresh POST request
  });
};

export const useGetRandomMenuMutation = (): UseMutationResult<
  MenuInfoResponse,
  Error,
  void
> => {
  return useMutation({
    mutationFn: getRandomMenu,
  });
};
