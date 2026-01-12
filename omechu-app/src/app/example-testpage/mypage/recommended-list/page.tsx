//! 26.01.13 작업

"use client";

import { useRef, useState } from "react";

import { FloatingActionButton, Header, SearchBar } from "@/shared";
import { RecommendedFoodBox, SelectTab } from "@/widgets/mypage/ui";

export default function RecommendedListPage() {
  const mainRef = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isToggled, setIsToggled] = useState(false);

  const handleSearch = (term: string) => {
    console.log("검색 실행:", term);
  };

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
          {Array.from({ length: 30 }).map((_, i) => (
            <RecommendedFoodBox
              key={i}
              title={`타코 ${i}`}
              src=""
              onClick={() => setIsToggled(!isToggled)}
              isToggled={isToggled}
            />
          ))}
        </section>
        <FloatingActionButton onClick={scrollToTop} />
      </main>
    </>
  );
}
