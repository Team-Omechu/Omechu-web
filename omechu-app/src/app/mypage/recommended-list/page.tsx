"use client";

import { useRef, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import FloatingActionButton from "@/app/components/common/FloatingActionButton";
import FoodBox from "@/app/components/common/FoodBox";
import Header from "@/app/components/common/Header";
import SearchBar from "@/app/components/common/SearchBar";
import SelectTabBar from "@/app/components/mypage/SelectTabBar";
import {
  consonantGroupMap,
  filteredChoSeong,
  HANGUL_CHO_SEONG,
} from "@/app/constant/choSeong";
import { initialFoodList } from "@/app/constant/initialFoodList";
import { suggestionList } from "@/app/constant/suggestionList";

// FoodItem 타입을 정의하거나 import
type FoodItem = {
  title: string;
  imageUrl: string;
  isExcluded: boolean;
};

export default function RecommendedList() {
  const router = useRouter();
  const isJustResetRef = useRef(false); // 최근 입력 초기화 여부 체크

  // 음식 리스트 초기 정렬 (한글 기준 오름차순)
  const sortedFoodList: FoodItem[] = [...initialFoodList]
    .map((item) => ({
      ...item,
      imageUrl: item.imageUrl ?? "", // 기본값을 빈 문자열로 설정
    }))
    .sort((a, b) => a.title.localeCompare(b.title, "ko"));
  const [foodList, setFoodList] = useState<FoodItem[]>(sortedFoodList);

  const [selectedIndex, setSelectedIndex] = useState(0); // 추천/제외 탭 인덱스
  const [selectedAlphabetIndex, setSelectedAlphabetIndex] = useState<
    number | undefined
  >(undefined); // 초성 필터 인덱스

  const [searchTerm, setSearchTerm] = useState(""); // input에 입력 중인 검색어
  const [submittedTerm, setSubmittedTerm] = useState(""); // 검색 확정된 키워드

  // 검색 실행 핸들러
  const handleSearch = (term: string) => {
    const trimmed = term.trim();

    if (trimmed === "") {
      if (!isJustResetRef.current) {
        setSubmittedTerm("");
      }
      return;
    }

    if (trimmed === submittedTerm) return;
    setSubmittedTerm(trimmed);
    isJustResetRef.current = true;
    setSearchTerm("");
  };
  // 한글 자음 추출 함수 (초성 기준 분류용)
  const getInitialConsonant = (char: string): string => {
    const code = char.charCodeAt(0) - 0xac00;
    const choIndex = Math.floor(code / 588);
    return HANGUL_CHO_SEONG[choIndex] ?? "";
  };

  // 추천/제외 toggle 기능
  const onToggle = (title: string) => {
    setFoodList((prev) =>
      prev.map((item) =>
        item.title === title ? { ...item, isExcluded: !item.isExcluded } : item,
      ),
    );
  };

  // 필터링된 음식 리스트 반환
  const filteredFoodList = foodList
    .filter((item) => item.isExcluded === (selectedIndex === 1))
    .filter((item) => {
      if (selectedAlphabetIndex === undefined) return true;
      const selectedConsonant = filteredChoSeong[selectedAlphabetIndex];
      const group = consonantGroupMap[selectedConsonant] || [];
      return group.includes(getInitialConsonant(item.title));
    })
    .filter((item) => {
      if (submittedTerm === "") return true;
      return item.title.toLowerCase().includes(submittedTerm.toLowerCase());
    });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* 상단 헤더 */}
      <Header
        title={"추천 목록 관리"}
        leftChild={
          <button
            onClick={() => {
              router.push("./");
            }}
          >
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
      />

      {/* 추천 / 제외 선택 버튼 */}
      <SelectTabBar
        tabs={["추천 목록", "제외 목록"]}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />

      {/* 메인 섹션 */}
      <main className="relative flex min-h-[calc(100vh-10rem)] w-full flex-col items-center gap-3 overflow-y-auto px-4">
        {/* 검색 창 */}
        <SearchBar
          placeholder="음식명을 검색하세요."
          inputValue={searchTerm}
          setInputValue={setSearchTerm}
          onSearch={handleSearch}
          suggestionList={suggestionList}
        />

        {/* 초성 필터 버튼 */}
        <section>
          <div className="grid h-[61px] w-[340px] grid-flow-dense grid-cols-7 rounded-2xl border-2 border-black bg-white px-7 py-2">
            {filteredChoSeong.map((item, index) => (
              <button
                key={index}
                onClick={() =>
                  setSelectedAlphabetIndex((prev) =>
                    prev === index ? undefined : index,
                  )
                }
                className={`rounded-full text-[15px] text-[#393939] hover:bg-[#e2e2e2] active:bg-[#828282] ${
                  selectedAlphabetIndex === index
                    ? "bg-[#d4f0ff] font-black"
                    : "font-normal"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* 필터링된 음식 리스트 */}
        <section className="grid grid-cols-3 gap-4">
          {filteredFoodList.map((item, index) => (
            <FoodBox
              key={`${item.title}-${index}`}
              title={item.title}
              imageUrl={item.imageUrl}
              isExcluded={item.isExcluded}
              onToggle={() => onToggle(item.title)}
              onClick={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          ))}
        </section>

        {/* Floating Action Button - 맨 위로 이동 */}
        <FloatingActionButton onClick={scrollToTop} className="bottom-4" />
      </main>
    </>
  );
}
