import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addHeart, deleteHeart } from "../api/api";
import { ProfileResponse } from "@/constant/mainpage/profile";

function usePostHeart(restaurantId: number) {
  return useMutation({
    mutationFn: () => addHeart( restaurantId),
    onSuccess: (data) => {
      console.log("Heart added successfully:", data);
    },
  });
}

function useDeleteHeart(restaurantId: number) {
  return useMutation({
    mutationFn: () => deleteHeart( restaurantId),
    onSuccess: (data) => {
      console.log("Heart added successfully:", data);
    },
  });
}

export { usePostHeart, useDeleteHeart };
