"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

import { menus } from "@/app/constant/mainpage/resultData";
import MenuInfo from "@/app/mainpage/components/MenuInfoCard";
import FoodCard from "@/app/components/common/FoodCard";
import { Restaurants } from "@/app/constant/restaurant/restaurantList";
import Header from "@/app/components/common/Header";

export default function MenuDetailPage() {
  const router = useRouter();
  const params = useParams();
  const menuId = Number(params.menuId);

  const menu = menus.find((m) => m.id === menuId);
  if (!menu) {
    return <p className="p-4">해당 메뉴를 찾을 수 없습니다.</p>;
  }

  // 메뉴 이름이 포함된 맛집 필터링
  const relatedRestaurants = Restaurants.filter((r) =>
    r.menu.includes(menu.title) || r.tags.includes(menu.title)
  );

  return (
    <div className="flex flex-col w-full">
      <Header
        leftChild={
          <button
            onClick={() => {
              router.push("/mainpage");
            }}
            className="flex items-center text-sm font-bold"
          >
            <Image
              src={"/header_left_arrow.png"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
            <span>처음으로</span>
          </button>
        }
        className="border-b-0"
      />

      <div className="mt-4 flex-col items-center justify-center gap-4 p-4">
        <p className="text-center font-semibold text-[#1F9BDA]">{menu.title}</p>
        <Image
          src={menu.image}
          alt={menu.title}
          className="mx-auto h-24 w-24 rounded"
          width={96}
          height={96}
        />
      </div>

      <div className="mt-10 w-full p-4">
        <MenuInfo nutrition={menu.nutrition} allergens={menu.allergens} />
      </div>

      <div className="ml-1 mt-5 flex flex-row justify-between gap-4">
        <h3 className="text-l font-semibold px-4">취향 저격! 추천 메뉴 있는 맛집</h3>
        <button
          className="text-sm text-[#828282] px-4"
          onClick={() =>
            router.push(`/restaurant?query=${encodeURIComponent(menu.title)}`)
          }
        >
          더보기 &gt;
        </button>
      </div>

      <div className="mt-3 space-y-2 px-4">
        {relatedRestaurants.length > 0 ? (
          relatedRestaurants.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onClick={() => router.push(`/restaurant/restaurant-detail/${item.id}`)}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">추천 맛집이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
