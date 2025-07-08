"use client";

type FoodItem = {
  title: string;
  isExcluded: boolean;
  imageUrl?: string | null;
};
// 라이브러리
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";

// 공용 컴포넌트
import Header from "@/app/components/common/Header";
import FoodBox from "@/app/components/common/FoodBox";
import SearchBar from "@/app/components/common/SearchBar";

//상수 파일
import {
  filteredChoSeong,
  consonantGroupMap,
  HANGUL_CHO_SEONG,
} from "@/app/constant/choSeong";
import { initialFoodList } from "@/app/constant/initialFoodList";
import { suggestionList } from "@/app/constant/suggestionList";

export default function RecommendedList() {
  const router = useRouter();
  const isJustResetRef = useRef(false);

  const sortedFoodList: FoodItem[] = [...initialFoodList].sort((a, b) =>
    a.title.localeCompare(b.title, "ko")
  );
  const [foodList, setFoodList] = useState<FoodItem[]>(sortedFoodList);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedAlphabetIndex, setSelectedAlphabetIndex] = useState<
    number | undefined
  >(undefined);

  const [searchTerm, setSearchTerm] = useState("");
  const [submittedTerm, setSubmittedTerm] = useState("");

  const handleSearch = (term: string) => {
    const trimmed = term.trim();

    // ✅ 직접 입력이 아니라 자동 초기화 후 발생한 ""는 무시!
    if (trimmed === "") {
      if (!isJustResetRef.current) {
        setSubmittedTerm(""); // ← 진짜로 전체 목록 검색 (엔터 친 경우)
      }
      return;
    }

    if (trimmed === submittedTerm) return;

    setSubmittedTerm(trimmed);
    isJustResetRef.current = true; // 🔥 다음 input 입력 무시
    setSearchTerm(""); // 🔥 입력창 초기화
  };

  const getInitialConsonant = (char: string): string => {
    const code = char.charCodeAt(0) - 0xac00;
    const choIndex = Math.floor(code / 588);
    return HANGUL_CHO_SEONG[choIndex] ?? "";
  };

  const onToggle = (title: string) => {
    setFoodList((prev) =>
      prev.map((item) =>
        item.title === title ? { ...item, isExcluded: !item.isExcluded } : item
      )
    );
  };

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
      <main className="relative overflow-y-auto px-4 gap-3 flex flex-col items-center w-full min-h-[calc(100vh-10rem)]">
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
        <SearchBar
          inputValue={searchTerm}
          setInputValue={setSearchTerm}
          onSearch={handleSearch}
          suggestionList={suggestionList}
          isJustResetRef={isJustResetRef}
        />

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
              title={item.title}
              imageUrl={item.imageUrl} // 또는 추후에 실제 경로로 대체될 값
              isExcluded={item.isExcluded}
              onToggle={() => onToggle(item.title)}
              onClick={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          ))}
        </section>
        {/* FAB(Floating Action Button) */}
        <section className="fixed z-10 transform -translate-x-1/2 bottom-4 left-1/2">
          <button onClick={scrollToTop}>
            <Image src="/fba.png" alt={"플로팅버튼"} width={36} height={36} />
          </button>
        </section>
      </main>
    </>
  );
}
