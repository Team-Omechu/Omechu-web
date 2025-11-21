import { api } from "@/lib/api/axios";

export interface UpdateRestaurantPayload {
  name: string;
  repre_menu: string[];
  opening_hour: Record<string, string>;
  address: string;
  imageUrl?: string;
}

export interface UpdateRestaurantResponse {
  success: boolean;
  reason?: string;
}

export async function updateRestaurant(
  restId: number,
  payload: UpdateRestaurantPayload,
): Promise<UpdateRestaurantResponse> {
  try {
    const { data } = await api.patch<UpdateRestaurantResponse>(
      `/place/detail/${restId}/edit`,
      payload,
    );

    if (process.env.NODE_ENV === "development") {
      console.log("[updateRestaurant] response:", data);
    }

    return data;
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("[updateRestaurant] error:", error);
    }

    throw new Error(
      error.response?.data?.reason || "맛집 수정에 실패했습니다.",
    );
  }
}
