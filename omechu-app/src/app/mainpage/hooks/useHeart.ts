import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addHeart, deleteHeart } from "../api/api";
import { ProfileResponse } from "@/constant/mainpage/profile";

function usePostHeart(restaurantId: number) {
  const queryClient = useQueryClient();
  const cached = queryClient.getQueryData<ProfileResponse>(["profile"]);

  const userId = cached?.success?.id;

  return useMutation({
    mutationFn: () => addHeart(userId, restaurantId),
    onSuccess: (data) => {
      console.log("Heart added successfully:", data);
    },
  });
}

function useDeleteHeart(restaurantId: number) {
  const queryClient = useQueryClient();
  const cached = queryClient.getQueryData<ProfileResponse>(["profile"]);

  const userId = cached?.success?.id;

  return useMutation({
    mutationFn: () => deleteHeart(userId, restaurantId),
    onSuccess: (data) => {
      console.log("Heart added successfully:", data);
    },
  });
}

export { usePostHeart, useDeleteHeart };
