"use client";

import React from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import Header from "@/components/common/Header";
import MenuInfo from "@/components/common/MenuInfoCard";
import FoodCard from "@/components/common/FoodCard";
import { Restaurants } from "@/constant/restaurant/restaurantList";
import type {
  MenuItem,
  MenuListResponse,
} from "@/constant/mainpage/resultData";

export default function MenuDetailPage() {
  const router = useRouter();
  const { menuId } = useParams();

  const decodeMenuId = decodeURIComponent(menuId as string);

  // React Query 캐시에서 추천 메뉴 데이터만 바로 가져오기
  const queryClient = useQueryClient();
  const cached = queryClient.getQueryData<MenuListResponse>(["recommendMenu"]);
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

  // 관련 맛집 필터링
  const related = Restaurants.filter(
    (r) => r.menu.includes(menu.menu) || r.tags.includes(menu.menu),
  );

  return (
    <div className="flex w-full flex-col">
      <Header
        leftChild={
          <button
            onClick={() => router.push("/mainpage")}
            className="flex items-center font-bold"
          >
            <Image
              src="/header_left_arrow.png"
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
        {related.length > 0 ? (
          related.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onClick={() =>
                router.push(`/restaurant/restaurant-detail/${item.id}`)
              }
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">추천 맛집이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
