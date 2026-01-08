import { useQuestionAnswerStore } from "@/entities/question";
import { useQuery } from "@tanstack/react-query";
import { RandomMenu } from "@/entities/menu/config/resultData";
import { getRandomMenu } from "@/entities/menu/api/getRandomMenu";

export function useGetRandomMenu() {
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
