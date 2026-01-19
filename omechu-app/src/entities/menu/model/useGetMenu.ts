import { useQuestionAnswerStore } from "@/entities/question";
import { useQuery } from "@tanstack/react-query";
import {
  MenuListResponse,
  RecommendMenuRequest,
} from "@/entities/menu/config/resultData";
import { getMenu } from "@/entities/menu/api/getMenu";

export function useGetMenu() {
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
    queryKey: ["recommendMenu", payload],
    queryFn: () => getMenu(payload),
    staleTime: 1000 * 60 * 5,
  });
}
