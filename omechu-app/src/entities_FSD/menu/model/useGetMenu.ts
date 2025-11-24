import { useQuery } from "@tanstack/react-query";

import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";
import {
  MenuListResponse,
  RecommendMenuRequest,
} from "@/constant/mainpage/resultData";
import { getMenu } from "../api/getMenu";

function useGetMenu() {
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

export default useGetMenu;
