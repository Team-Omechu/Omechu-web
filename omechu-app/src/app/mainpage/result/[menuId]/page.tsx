"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

import Header from "@/components/common/Header";
import MenuInfo from "@/components/common/MenuInfoCard";
import type {
  MenuDetail,
} from "@/constant/mainpage/resultData";
import useGetRestaurants from "@/mainpage/hooks/useGetRestaurants";
import { Restaurant } from "@/constant/mainpage/RestaurantData";
import FoodCardEx from "@/mainpage/components/FoodCardEx";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import useGetMenuDetail from "@/mainpage/hooks/useGetMenuDetail";

export default function MenuDetailPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetRestaurants();
  const { menuId } = useParams();
  const { mealTime, purpose, mood, who, budget, exceptions } =
    useQuestionAnswerStore();
  const payload = { mealTime, purpose, mood, with: who, budget, exceptions };

  const decodeMenuId = decodeURIComponent(menuId as string);


  const restaurants: Restaurant[] = Array.isArray(data) ? data : [];

    const {data: menuDetailData} = useGetMenuDetail(decodeMenuId);

    const detailMenu:MenuDetail | undefined = menuDetailData

  return (
    <div className="flex w-full flex-col">
      <Header
        leftChild={
          <button
            onClick={() => router.push("/mainpage")}
            className="flex items-center font-bold"
          >
            <Image
              src="/arrow/left-header-arrow.svg"
              alt="back"
              width={22}
              height={30}
            />
            <span className="mb-0.5 ml-1 flex flex-shrink-0">처음으로</span>
          </button>
        }
        className="h-[60px] border-b-0"
      />

      <div className="mt-4 flex-col items-center justify-center gap-4 p-4">
        <p className="text-center font-semibold text-secondary-normal">
          {detailMenu?.name}
        </p>
        <Image
          src={detailMenu?.image_link || ""}
          alt={detailMenu?.name || "메뉴 이미지"}
          className="mx-auto h-24 w-24 rounded"
          width={96}
          height={96}
        />
      </div>

      <div className="mt-10 w-full p-4">
        <MenuInfo MenuItem={detailMenu} />
      </div>

      <div className="mx-4 mt-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">취향 저격! 추천 맛집</h3>
        <button
          className="px-4 text-sm text-grey-normalActive"
          onClick={() =>
            router.push(`/restaurant?query=${encodeURIComponent(detailMenu?.name || "")}`)
          }
        >
          더보기 &gt;
        </button>
      </div>

      <div className="mt-3 space-y-2 px-4">
        {isLoading && <LoadingIndicator />}
        {restaurants.map((item) => (
          <FoodCardEx
            key={item.id}
            item={item}
            menu={detailMenu?.name || ""}
            restaurantId={item.id2}
          />
        ))}
      </div>
    </div>
  );
}
