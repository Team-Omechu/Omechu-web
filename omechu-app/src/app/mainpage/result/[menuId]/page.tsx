// app/result/[menuId]/page.tsx
"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

import RestaurantCard from "@/app/components/mainpage/RestaurantCard";
import { restaurantList } from "@/app/constant/mainpage/RestaurantData";
import { menus } from "@/app/constant/mainpage/resultData";
import MenuInfo from "@/app/mainpage/components/MenuInfoCard";

export default function MenuDetailPage() {
  const router = useRouter();
  const params = useParams();
  const menuId = Number(params.menuId);

  const menu = menus.find((m) => m.id === menuId);
  if (!menu) {
    return <p className="p-4">해당 메뉴를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="flex flex-col p-4">
      <button className="flex justify-start" onClick={() => router.push("./")}>
        &lt; 처음으로
      </button>

      <div className="mt-4 flex-col items-center justify-center gap-4 p-4">
        <p className="text-center font-semibold text-[#1F9BDA]">{menu.title}</p>
        <Image
          src={"/logo_3d.png"}
          alt={menu.title}
          className="mx-auto h-24 w-24 rounded"
          width={96}
          height={96}
        />
      </div>

      <div className="mt-10 w-full">
        <MenuInfo nutrition={menu.nutrition} allergens={menu.allergens} />
      </div>

      <div className="ml-1 mt-5 flex flex-row justify-between gap-4">
        <h3 className="text-l font-semibold">취향 저격! 추천 메뉴 있는 맛집</h3>
        <button className="text-sm text-[#828282]">더보기 &gt;</button>
      </div>

      <div className="mt-3 space-y-2">
        {restaurantList.map((restaurant, idx) => (
          <RestaurantCard
            key={idx}
            name={restaurant.name}
            rating={restaurant.rating}
            reviews={restaurant.reviews}
            address={restaurant.address}
            menu={restaurant.menu}
            tags={restaurant.tags}
            image={restaurant.image}
          />
        ))}
      </div>
    </div>
  );
}
