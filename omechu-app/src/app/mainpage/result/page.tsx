"use client";

import Header from "@/app/components/common/Header";
import MenuCard from "@/app/components/mainpage/MenuCard";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResultPage() {
const router = useRouter();
const [openMenuId, setOpenMenuId] = useState<number|null>(1);
console.log(openMenuId)
  const menus = [
    {
      id: 1,
      title: "카레라이스",
      description:
        "매콤한 향신료와 따뜻한 밥이 어우러져 기분을 북돋아주고 활력을 주는 한 그릇 요리",
      image: "/images/curry.png",
    },
    {
      id: 2,
      title: "연어 아보카도 샌드위치",
      description:
        "오메가3가 풍부한 연어와 기분을 안정시켜주는 아보카도 조합, 비주얼도 예쁘서 기분 전환",
      image: "/images/sandwich.png",
    },
    {
      id: 3,
      title: "된장찌개와 보리밥",
      description:
        "구수한 된장향과 따뜻한 국물이 마음을 안정시키고 든든한 에너지를 채워주는 전통 한식 조합",
      image: "/images/soybean.png",
    },
  ];

  const tags = [
    "아침",
    "든든한 한 끼 식사",
    "들뜨고 신나요",
    "혼자",
    "중간",
  ];

  const tagDescriptions = [
    "간단하고 속에 편한 음식",
    "활기찬 기분을 유지할 수 있도록 하는 음식",
    "혼자서도 부담 없이 즐길 수 있는 음식",
    "활기찬 기분을 유지할 수 있도록 하는 음식",
    "혼자서도 부담 없이 즐길 수 있는 음식",
  ];

  return (
    <div className="p-4 flex flex-col">
      <Header
      leftChild={
        <button onClick={()=>{router.push("./")}}>
          &lt; 처음으로
        </button>
      }
      className="flex justify-start"/>

      <div className="flex flex-col gap-4">
        {menus.map((menu)=>(
          <MenuCard
          key={menu.id}
          title={menu.title}
          description={menu.description}
          image={menu.image}
          onClick={() => setOpenMenuId(menu.id)}
          />
        ))}
      </div>

      <div className="mt-4 flex justify-between gap-2">
        <button className="bg-[#FB4746] text-[#FFF] rounded-md px-4 py-2 flex-1">다시 추천</button>
        <button className="border border-gray-500 text-black bg-[#FFF] rounded-md px-4 py-2 flex-1"
          onClick={() => {
            if (openMenuId !== null) {
              router.push(`/mainpage/result/${openMenuId}`);
            }
          }}>선택하기</button>
      </div>

      <div className="mt-4 bg-white p-3 rounded-md text-sm">
        {tags.map((tag, idx) => (
          <div key={idx} className="mb-1 text-black flex flex-col p-1">
            <span className="font-semibold text-[#A3A3A3] mb-1">{tag}</span>
            {tagDescriptions[idx]}
          </div>
        ))}
      </div>
    </div>
  );
}
