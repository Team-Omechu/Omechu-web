"use client";

import { useState } from "react";

import FoodBox from "@/shared_FSD/ui/box/FoodBox";

export default function FoodBoxTestPage() {
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({
    샤브샤브: false,
    스테이크: false,
    사케동: false,
  });

  const MOCK_FOODS = [
    { src: "/sample/sample-pasta.png", title: "사케동" },
    { src: "/sample/sample-pasta.png", title: "낚지 볶음" },
    { src: "/sample/sample-pasta.png", title: "규동" },
    { src: "/sample/sample-pasta.png", title: "오므라이스" },
    { src: "/sample/sample-pasta.png", title: "연어 샐러드" },
    { src: "/sample/sample-pasta.png", title: "베이글" },
    { src: "/sample/sample-pasta.png", title: "타코" },
    { src: "/sample/sample-pasta.png", title: "된장찌개" },
    { src: "/sample/sample-pasta.png", title: "샌드위치" },
    { src: "/sample/sample-pasta.png", title: "티라미수" },
    { src: "/sample/sample-pasta.png", title: "팬케이크" },
    { src: "/sample/sample-pasta.png", title: "샤브샤브" },
  ];

  const handleCardClick = (key: string) => {
    console.log(key + " 클릭됨");
    setSelectedMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <main className="items-centergap-6 flex min-h-screen flex-col p-8">
      <h1 className="text-body-3-medium my-4 text-center">
        FoodBox 컴포넌트 테스트
      </h1>

      <section className="grid w-full grid-cols-3 gap-2">
        {MOCK_FOODS.map((food, index) => (
          <FoodBox
            key={index}
            src={food.src}
            title={food.title}
            isSelected={selectedMap[food.title]}
            onClick={() => handleCardClick(food.title)}
          />
        ))}
      </section>

      <div className="text-caption-2-regular">
        {Object.entries(selectedMap)
          .filter(([_, v]) => v)
          .map(([k]) => k)
          .join(", ") || "선택된 메뉴 없음"}
      </div>
    </main>
  );
}
