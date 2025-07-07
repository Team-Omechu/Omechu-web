"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Header from "@/app/components/common/Header";
import Image from "next/image";
import FoodBox from "@/app/components/mypage/FoodBox";

const filteredChoSeong = [
  "ㄱ",
  "ㄴ",
  "ㄷ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅅ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

// 단자음 → 해당 단자음과 쌍자음을 포함하는 그룹
const consonantGroupMap: Record<string, string[]> = {
  ㄱ: ["ㄱ", "ㄲ"],
  ㄴ: ["ㄴ"],
  ㄷ: ["ㄷ", "ㄸ"],
  ㄹ: ["ㄹ"],
  ㅁ: ["ㅁ"],
  ㅂ: ["ㅂ", "ㅃ"],
  ㅅ: ["ㅅ", "ㅆ"],
  ㅇ: ["ㅇ"],
  ㅈ: ["ㅈ", "ㅉ"],
  ㅊ: ["ㅊ"],
  ㅋ: ["ㅋ"],
  ㅌ: ["ㅌ"],
  ㅍ: ["ㅍ"],
  ㅎ: ["ㅎ"],
};

export default function RecommendedList() {
  const initialfoodList: { title: string; isExcluded: boolean }[] = [
    { title: "치킨", isExcluded: false },
    { title: "초콜릿", isExcluded: false },
    { title: "김밥", isExcluded: false },
    { title: "떡볶이", isExcluded: false },
    { title: "라면", isExcluded: false },
    { title: "삼겹살", isExcluded: false },
    { title: "불고기", isExcluded: false },
    { title: "된장찌개", isExcluded: false },
    { title: "피자", isExcluded: false },
    { title: "햄버거", isExcluded: false },
    { title: "초밥", isExcluded: false },
    { title: "우동", isExcluded: false },
    { title: "쌀국수", isExcluded: false },
    { title: "냉면", isExcluded: false },
    { title: "샐러드", isExcluded: false },
    { title: "바나나", isExcluded: false },
    { title: "딸기", isExcluded: false },
    { title: "요거트", isExcluded: false },
    { title: "도넛", isExcluded: false },
    { title: "커피", isExcluded: false },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const sortedFoodList = [...initialfoodList].sort((a, b) =>
    a.title.localeCompare(b.title, "ko")
  );
  const [foodList, setFoodList] = useState(sortedFoodList);
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0); // 0: 추천 목록, 1: 제외 목록
  const [selectedAlphabetIndex, setSelectedAlphabetIndex] = useState<
    number | undefined
  >(undefined); // 0~13, 0: 'ㄱ', 13: 'ㅎ'

  const getInitialConsonant = (char: string): string => {
    const choSeong = [
      "ㄱ",
      "ㄲ",
      "ㄴ",
      "ㄷ",
      "ㄸ",
      "ㄹ",
      "ㅁ",
      "ㅂ",
      "ㅃ",
      "ㅅ",
      "ㅆ",
      "ㅇ",
      "ㅈ",
      "ㅉ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ",
    ];
    const code = char.charCodeAt(0) - 0xac00;
    const choIndex = Math.floor(code / 588);
    return choSeong[choIndex] ?? "";
  };

  const onToggle = (index: number) => {
    console.log("토글 동작", index);
    setFoodList((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, isExcluded: !item.isExcluded } : item
      )
    );
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(""); // 검색어 초기화
    }
  };

  const filteredFoodList = foodList
    .filter((item) => item.isExcluded === (selectedIndex === 1))
    .filter((item) => {
      if (selectedAlphabetIndex === undefined) return true;

      const selectedConsonant = filteredChoSeong[selectedAlphabetIndex];
      const group = consonantGroupMap[selectedConsonant] || [];

      return group.includes(getInitialConsonant(item.title));
    })
    .filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    ); // 메뉴 검색 기능

  return (
    <>
      <Header
        leftChild={
          <button
            onClick={() => {
              router.push("/mypage");
            }}
          >
            {"<"}
          </button>
        }
        title={"추천 목록 관리"}
      />

      {/* Main */}
      <main className="px-4 gap-3 flex flex-col items-center w-full min-h-[calc(100vh-10rem)]">
        {/* 리스트 선택  */}
        <section className="flex w-full ">
          {["추천 목록", "제외 목록"].map((item, index) => (
            <button
              onClick={() => {
                setSelectedIndex(index);
              }}
              key={index}
              className={`w-44 h-12 text-lg font-medium ${
                selectedIndex === index
                  ? "text-white border-black border-b-[3px] bg-[#1f9bda]"
                  : "text-[#828282] border-b-[#828282] border-b-2 bg-white"
              }`}
            >
              {item}
            </button>
          ))}
        </section>

        {/* 검색 창 */}
        <section className="relative">
          <input
            type="text"
            placeholder="음식명을 검색하세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="px-6 flex items-center bg-white w-[340px] h-10 border-2 border-black rounded-3xl"
          />

          <Image
            onClick={() => {}}
            className="absolute z-10 top-1.5 right-4 cursor-pointer"
            src={"/search.png"}
            alt="검색"
            width={25}
            height={25}
          />
        </section>

        {/* 인덱스  */}
        <section>
          <div
            className="w-[340px] h-[61px] px-7 py-2 grid grid-cols-7 grid-flow-dense
                  bg-white border-2 border-black rounded-2xl"
          >
            {filteredChoSeong.map((item, index) => (
              <button
                key={index}
                onClick={() =>
                  setSelectedAlphabetIndex((prev) =>
                    prev === index ? undefined : index
                  )
                }
                className={`text-[15px] text-[#393939] hover:bg-[#e2e2e2] active:bg-[#828282] rounded-full 
                ${selectedAlphabetIndex === index ? "font-black bg-[#d4f0ff]" : "font-normal"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* 추천 목록 리스트 */}
        <section className="grid grid-cols-3 gap-4">
          {filteredFoodList.map((item, index) => (
            <FoodBox
              key={`${item.title}-${index}`}
              isExcluded={item.isExcluded}
              onToggle={() => onToggle(foodList.indexOf(item))}
              title={item.title}
            />
          ))}
        </section>
      </main>

      {/* footer */}
      <footer>
        <button></button>
      </footer>
    </>
  );
}
