// app/result/[menuId]/page.tsx
"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

import MenuInfo from "@/app/components/mainpage/MenuInfoCard";
import RestaurantCard from "@/app/components/mainpage/RestaurantCard";

// (테스트용) ResultPage와 동일한 메뉴 배열을 import 하거나,
// 실제 API 호출을 넣으시면 됩니다.
const menus = [
  { id: 1, title: "카레라이스", description: "…", image: "/images/curry.png" },
  {
    id: 2,
    title: "연어 아보카도 샌드위치",
    description: "…",
    image: "/images/sandwich.png",
  },
  {
    id: 3,
    title: "된장찌개와 보리밥",
    description: "…",
    image: "/images/soybean.png",
  },
];

export default function MenuDetailPage() {
  const router = useRouter();
  const params = useParams();
  const menuId = Number(params.menuId);

  // ID에 맞는 메뉴 찾기
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
        <MenuInfo />
      </div>
      <div className="ml-1 mt-5 flex flex-row justify-between gap-4">
        <h3 className="text-l font-semibold">취향 저격! 추천 메뉴 있는 맛집</h3>
        <button className="text-sm text-[#828282]">더보기 &gt;</button>
      </div>
      <div className="mt-3 space-y-2">
        <RestaurantCard
          name="pier 23"
          rating={3.2}
          reviews={24}
          address="서울특별시 무슨구 무슨동 000-0"
          menu="짜장면"
          tags={["아침식사", "데이트", "기념일"]}
          image="/logo_3d.png"
        />
        <RestaurantCard
          name="pier 23"
          rating={3.2}
          reviews={24}
          address="서울특별시 무슨구 무슨동 000-0"
          menu="짜장면"
          tags={["아침식사", "데이트", "기념일"]}
          image="/logo_3d.png"
        />
        <RestaurantCard
          name="pier 23"
          rating={3.2}
          reviews={24}
          address="서울특별시 무슨구 무슨동 000-0"
          menu="짜장면"
          tags={["아침식사", "데이트", "기념일"]}
          image="/logo_3d.png"
        />
      </div>
    </div>
  );
}
