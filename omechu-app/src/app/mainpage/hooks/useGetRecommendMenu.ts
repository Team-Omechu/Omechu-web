import { useQuery } from "@tanstack/react-query";
import { getRecommendMenu } from "../api/api";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";
import {
  MenuListResponse,
  RecommendMenuRequest,
} from "@/constant/mainpage/resultData";

function useGetRecommendMenu() {
  const { mealTime, purpose, mood, who, budget, exceptions } =
    useQuestionAnswerStore();

  const payload: RecommendMenuRequest = {
    mealTime,
    purpose,
    mood,
    with: who,
    budget,
    exceptions,
  };
  return useQuery<MenuListResponse>({
    queryKey: ["recommendMenu"],
    queryFn: () => getRecommendMenu(payload),
    staleTime: 1000 * 60 * 5,
  });
}

export default useGetRecommendMenu;
