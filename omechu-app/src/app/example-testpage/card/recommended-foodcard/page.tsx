"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { RecommendedFoodCard } from "@/shared_FSD/ui/card/RecommendedFoodCard";

const INITIAL_MENUS = [
  {
    menuTitle: "샤브샤브",
    menuDesc: "신선한 채소와 고기를 육수에 살짝 담가 먹는 따끈한 건강식",
    src: "",
  },
  {
    menuTitle: "스테이크",
    menuDesc: "두툼한 고기의 풍미를 그대로 살린 육집 가득한 정통 스테이크",
    src: "/logo/logo.png",
  },
  {
    menuTitle: "사케동",
    menuDesc: "부드러운 연어회가 듬뿍 올라간 일본식 연어 덮밥",
  },
];

export default function RecommendedFoodCardTestPage() {
  const router = useRouter();

  const [menus, setMenus] = useState(INITIAL_MENUS);
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});

  const handleDelete = (menuTitle: string) => {
    setMenus((prev) => prev.filter((item) => item.menuTitle !== menuTitle));
    setSelectedMap((prev) => {
      const newMap = { ...prev };
      delete newMap[menuTitle];
      return newMap;
    });
  };

  return (
    <main className="flex h-screen justify-center p-6">
      <div className="flex flex-col items-center gap-6">
        {menus.map(({ menuTitle, menuDesc, src }) => (
          <div key={menuTitle} className="w-84">
            <RecommendedFoodCard
              menuTitle={menuTitle}
              menuDesc={menuDesc}
              selected={selectedMap[menuTitle]}
              src={src}
              onMinusButtonClick={() => handleDelete(menuTitle)}
              onCardClick={() => router.push("/")}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
