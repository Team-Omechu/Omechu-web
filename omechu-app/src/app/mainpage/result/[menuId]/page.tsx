// app/result/[menuId]/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import MenuInfo from "@/app/mainpage/components/MenuInfoCard";
import RestaurantCard from "@/app/components/mainpage/RestaurantCard";
import Image from "next/image";
import { menus } from "@/app/constant/mainpage/resultData";
import { restaurantList } from "@/app/constant/mainpage/RestaurantData";

export default function MenuDetailPage() {
  const router = useRouter();
  const params = useParams();
  const menuId = Number(params.menuId);

  const menu = menus.find((m) => m.id === menuId);
  if (!menu) {
    return <p className="p-4">해당 메뉴를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="p-4 flex flex-col">
      <button className="flex justify-start" onClick={() => router.push("./")}>
        &lt; 처음으로
      </button>

      <div className="mt-4 p-4 flex-col gap-4 items-center justify-center">
        <p className="text-[#1F9BDA] font-semibold text-center">{menu.title}</p>
        <Image
          src={"/logo_3d.png"}
          alt={menu.title}
          className="w-24 h-24 rounded mx-auto"
          width={96}
          height={96}
        />
      </div>

      <div className="mt-10 w-full">
        <MenuInfo
        nutrition={menu.nutrition}
        allergens={menu.allergens}
        />
      </div>

      <div className="flex flex-row justify-between mt-5 ml-1 gap-4">
        <h3 className="text-l font-semibold">취향 저격! 추천 메뉴 있는 맛집</h3>
        <button className="text-[#828282] text-sm">더보기 &gt;</button>
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
