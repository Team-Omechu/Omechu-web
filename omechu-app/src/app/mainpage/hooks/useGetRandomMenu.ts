import { RandomMenu } from "@/constant/mainpage/resultData";
import { getRandomMenu } from "../api/api";
import { useQuery } from "@tanstack/react-query";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";

function useGetRandomMenu() {
  const { addition } = useQuestionAnswerStore();
  const payload = {
    addition, // If no addition, send null
  };
  return useQuery<RandomMenu>({
    queryKey: ["randomMenu"],
    queryFn: () => getRandomMenu(payload), // Assuming no additional items for simplicity
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export default useGetRandomMenu;
