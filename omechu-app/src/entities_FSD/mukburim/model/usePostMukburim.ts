import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { mukburimResponse } from "@/constant/mainpage/mukburim";
import { useRouter } from "next/navigation";
import { postMukburim } from "../api/postMukburim";

function usePostMukburim() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<mukburimResponse, Error, string>({
    // menu_name을 파라미터로 받도록!
    mutationFn: (menu_name) => postMukburim(menu_name),
    onSuccess: (data, menu_name) => {
      // 관련된 쿼리만 새로고침! (예시로 "mukburim" 지정)
      queryClient.invalidateQueries({ queryKey: ["mukburim"] });
    },
  });
}

export default usePostMukburim;
