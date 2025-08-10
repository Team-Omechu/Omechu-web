"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import Header from "@/components/common/Header";
import MenuInfo from "@/components/common/MenuInfoCard";
import type {
  MenuItem,
  MenuListResponse,
} from "@/constant/mainpage/resultData";
import useGetRestaurants from "@/mainpage/hooks/useGetRestaurants";
import { Restaurant } from "@/constant/mainpage/RestaurantData";
import FoodCardEx from "@/mainpage/components/FoodCardEx";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";
import LoadingIndicator from "@/components/common/LoadingIndicator";

export default function MenuDetailPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetRestaurants();
  const { menuId } = useParams();
  const { mealTime, purpose, mood, who, budget, exceptions } =
    useQuestionAnswerStore();
  const payload = { mealTime, purpose, mood, with: who, budget, exceptions };

  const decodeMenuId = decodeURIComponent(menuId as string);

  const restaurants: Restaurant[] = Array.isArray(data) ? data : [];

  console.log("Restaurants Data:", restaurants);

  // React Query 캐시에서 추천 메뉴 데이터만 바로 가져오기
  const queryClient = useQueryClient();
  const cached = queryClient.getQueryData<MenuListResponse>([
    "recommendMenu",
    payload,
  ]);
  const menus: MenuItem[] = Array.isArray(cached) ? cached : [];

  if (!cached) {
    // 데이터가 없으면 처음으로 돌아가거나 안내
    return <p className="p-4">메뉴 추천을 먼저 받아주세요.</p>;
  }

  // 전달된 메뉴 이름으로 상세 정보 찾기
  const menu = menus.find((menu) => menu.menu === decodeMenuId);
  if (!menu) {
    return <p className="p-4">해당 메뉴를 찾을 수 없습니다.</p>;
  }

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
          {menu.menu}
        </p>
        <Image
          src={"/logo/logo.png"}
          alt={menu.menu}
          className="mx-auto h-24 w-24 rounded"
          width={96}
          height={96}
        />
      </div>

      <div className="mt-10 w-full p-4">
        <MenuInfo MenuItem={menu} />
      </div>

      <div className="mx-4 mt-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">취향 저격! 추천 맛집</h3>
        <button
          className="px-4 text-sm text-grey-normalActive"
          onClick={() =>
            router.push(`/restaurant?query=${encodeURIComponent(menu.menu)}`)
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
            menu={menu.menu}
            restaurantId={item.id2}

          />
        ))}
      </div>
    </div>
  );
}
