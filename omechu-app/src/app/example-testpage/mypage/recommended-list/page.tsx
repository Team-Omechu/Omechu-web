//! 26.01.13 작업

"use client";

import { useRef, useState } from "react";

import { Header } from "@/shared_FSD/index";

import FloatingActionButton from "../ui/FloatingActionButton";
import { RecommendedFoodBox } from "../ui/RecommendedFoodBox";
import { SearchBar } from "../ui/SearchBar";
import SelectTab from "../ui/SelectTab";

export default function RecommendedListPage() {
  const mainRef = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [excludedSet, setExcludedSet] = useState<Set<number>>(new Set());

  const handleSearch = (term: string) => {
    console.log("검색 실행:", term);
  };

  const toggleExclude = (index: number) => {
    setExcludedSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const filteredItems = Array.from({ length: 30 })
    .map((_, i) => i)
    .filter(
      (i) =>
        selectedIndex === 0
          ? !excludedSet.has(i) // 추천 목록
          : excludedSet.has(i), // 제외 목록
    );

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <>
      <Header title="추천 목록 관리" isRightChild={true} />
      <main
        ref={mainRef}
        className="relative mt-2 flex h-[91.5dvh] flex-col items-center gap-5 overflow-y-auto"
      >
        <SelectTab
          tabs={["추천 목록", "제외 목록"]}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
        <SearchBar
          inputValue={searchTerm}
          setInputValue={setSearchTerm}
          onSearch={handleSearch}
        />
        <section className="grid w-84 grid-cols-3 gap-3 pb-15">
          {filteredItems.map((i) => (
            <RecommendedFoodBox
              key={i}
              title={`타코 ${i}`}
              src=""
              onClick={() => toggleExclude(i)}
              isToggled={excludedSet.has(i)}
            />
          ))}
        </section>
        <FloatingActionButton onClick={scrollToTop} />
      </main>
    </>
  );
}
