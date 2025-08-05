import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMukburim } from "../api/api";
import type { mukburimResponse } from "@/constant/mainpage/mukburim";

function usePostMukburim() {
  const queryClient = useQueryClient();

  return useMutation<mukburimResponse, Error, string>({
    // menu_name을 파라미터로 받도록!
    mutationFn: (menu_name) => postMukburim(menu_name),
    onSuccess: (data, menu_name) => {
      // 관련된 쿼리만 새로고침! (예시로 "mukburim" 지정)
      queryClient.invalidateQueries({ queryKey: ["mukburim"] });
      console.log("Mukburim posted successfully:", data); 
    },
  });
}

export default usePostMukburim;
