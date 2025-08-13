"use client";

import Image from "next/image";
import { useRouter, useParams, useSearchParams } from "next/navigation";

import Header from "@/components/common/Header";
import MenuInfo from "@/components/common/MenuInfoCard";
import type { MenuDetail } from "@/constant/mainpage/resultData";
import useGetRestaurants from "@/mainpage/hooks/useGetRestaurants";
import { Restaurant } from "@/constant/mainpage/RestaurantData";
import FoodCardEx from "@/mainpage/components/FoodCardEx";
import useGetMenuDetail from "@/mainpage/hooks/useGetMenuDetail";
import SkeletonFoodCard from "@/components/common/SkeletonFoodCard";
import { use, useEffect, useState } from "react";
import Toast from "@/components/common/Toast";


export default function MenuDetailPage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(true);
  const { data, isLoading, error, refetch } = useGetRestaurants();
  const { menuId } = useParams();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("mukburim") === "success";

  const decodeMenuId = decodeURIComponent(menuId as string);

  const restaurants: Restaurant[] = Array.isArray(data) ? data : [];

  const { data: menuDetailData } = useGetMenuDetail(decodeMenuId);

  const detailMenu: MenuDetail | undefined = menuDetailData;

  useEffect(() => {
    if (isSuccess) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  }, []);

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
          src={detailMenu?.image_link || "/image/image_empty.svg"}
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
            router.push(
              `/restaurant?query=${encodeURIComponent(detailMenu?.name || "")}`,
            )
          }
        >
          더보기 &gt;
        </button>
      </div>

      <div className="mt-3 space-y-2 px-4">
        {isLoading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonFoodCard key={i} />
            ))}
          </div>
        )}
        {restaurants.map((item) => (
          <FoodCardEx
            key={item.id}
            item={item}
            menu={detailMenu?.name || ""}
            restaurantId={item.id2}
          />
        ))}
      </div>
        <Toast message="먹부림 기록에 등록되었습니다." show={showToast} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
    </div>
  );
}
