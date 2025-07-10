"use client";

import BottomNav from "@/app/components/mainpage/BottomNav";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MealAnswerPage() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleSelect = (item: string) => {
    setSelectedItems((prev) => {
      if(prev.includes(item)){
        return prev.filter((v)=>v !== item);
      }
      if(prev.length >=3) return prev;
      return[...prev, item]
    }
    );
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#f8d6ff]">
      <main className="flex flex-col items-center justify-center flex-1 w-full">
        {/* 질문 문구 */}
        <div className="flex flex-col justify-center w-[393px] h-[112px] text-center text-[#393939] font-sans text-[24px] font-medium shrink-0">
          <h2>제외하고 싶은</h2>
          <h2>음식은 무엇인가요?</h2>
        </div>

        <div className="w-[310px] flex flex-col gap-4">
          {/* 첫 번째 그룹: 5열 */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-5 gap-2">
              {["한식", "중식", "일식", "양식", "기타-종류"].map((item) => (
                <button
                  key={item}
                  className={`rounded-md border text-xs px-2 py-1 h-[35px] w-[58px] flex items-center justify-center 
                    ${selectedItems.includes(item)
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-white text-black border-[#999999]"}`}
                  onClick={() => toggleSelect(item)}
                  disabled={selectedItems.length >= 3 && !selectedItems.includes(item)}
                >
                  {item.startsWith("기타") ? "그 외" : item}
                </button>
              ))}
            </div>
            <div className="w-[310px] h-px bg-[#828282] opacity-60" />
          </div>

          {/* 두 번째 그룹: 5열 */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-5 gap-2">
              {["밥", "면", "고기", "해산물", "기타-재료"].map((item) => (
                <button
                  key={item}
                  className={`rounded-md border text-xs px-2 py-1 h-[35px] w-[58px] flex items-center justify-center 
                    ${selectedItems.includes(item)
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-white text-black border-[#999999]"}`}
                  onClick={() => toggleSelect(item)}
                  disabled={selectedItems.length >= 3 && !selectedItems.includes(item)}
                >
                  {item.startsWith("기타") ? "그 외" : item}
                </button>
              ))}
            </div>
            <div className="w-[310px] h-px bg-[#828282] opacity-60" />
          </div>

          {/* 세 번째 그룹: 2개씩 한 줄 */}
          <div className="flex flex-col gap-2">
            {[
              ["국물 있는 음식", "국물 없는 음식"],
              ["따뜻한 음식", "차가운 음식"],
              ["건강한 음식", "자극적인 음식"]
            ].map((pair, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center gap-[5px]">
                  {pair.map((item) => (
                    <button
                      key={item}
                      className={`rounded-md border text-xs px-2 py-1 h-[35px] w-[125px] flex items-center justify-center 
                        ${selectedItems.includes(item)
                          ? "bg-red-500 text-white border-red-500"
                          : "bg-white text-black border-[#999999]"}`}
                      onClick={() => toggleSelect(item)}
                      disabled={selectedItems.length >= 3 && !selectedItems.includes(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="w-[310px] h-px bg-[#828282] opacity-60" />
              </div>
            ))}
          </div>
        </div>

        {/* 하단 반영 버튼 */}
        <button
          className={`mt-8 h-12 w-48 rounded-md text-sm font-medium transition
            ${
              selectedItems.length > 0
                ? "bg-red-500 text-white"
                : "bg-white text-black border border-black"
            }`}
          onClick={() => {
            router.push("./location-answer");
          }}
        >
          {selectedItems.length > 0
            ? `${selectedItems.length}개 제외하기`
            : "모두 반영하기"}
        </button>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNav prevPath="./question-answer/middle-question" nextPath="./location-answer"/>
    </div>
  );
}
