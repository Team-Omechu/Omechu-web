<<<<<<< HEAD
//! 26.01.13 작업

"use client";

import { useRef, useState } from "react";
<<<<<<< HEAD

import { Header } from "@/shared_FSD/index";

import { MENU_SUGGESTIONS } from "../constants/menuSuggestions";
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
=======
"use client";

import { useState } from "react";

import { Header } from "@/shared_FSD/index";

import SelectTabBar from "../ui/SelectTabBar";
=======

import { Header } from "@/shared_FSD/index";

import FloatingActionButton from "../ui/FloatingActionButton";
import { RecommendedFoodBox } from "../ui/RecommendedFoodBox";
import { SearchBar } from "../ui/SearchBar";
import SelectTab from "../ui/SelectTab";
>>>>>>> 15b9bdc6 ([#220]feat:RecommendedFoodBox 컴포넌트 구현)

export default function RecommendedListPage() {
  const mainRef = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
<<<<<<< HEAD
  return (
    <>
      <Header title="추천 목록 관리" isRightChild={true} />
      <main className="gap- relative mt-4 flex h-[91.5dvh] flex-col items-center px-5">
        <SelectTabBar
>>>>>>> ef4577ad ([#220]design:SelectTab 수정)
=======
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
>>>>>>> 15b9bdc6 ([#220]feat:RecommendedFoodBox 컴포넌트 구현)
          tabs={["추천 목록", "제외 목록"]}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
<<<<<<< HEAD
        <SearchBar
          inputValue={searchTerm}
          setInputValue={setSearchTerm}
          onSearch={handleSearch}
<<<<<<< HEAD
          suggestionList={MENU_SUGGESTIONS}
        />
        <section className="grid w-84 grid-cols-3 gap-3 pb-15">
          {filteredItems.map((i) => (
=======
        />
        <section className="grid w-84 grid-cols-3 gap-3 pb-15">
          {Array.from({ length: 30 }).map((_, i) => (
>>>>>>> 15b9bdc6 ([#220]feat:RecommendedFoodBox 컴포넌트 구현)
            <RecommendedFoodBox
              key={i}
              title={`타코 ${i}`}
              src=""
<<<<<<< HEAD
              onClick={() => toggleExclude(i)}
              isToggled={excludedSet.has(i)}
=======
              onClick={() => setIsToggled(!isToggled)}
              isToggled={isToggled}
>>>>>>> 15b9bdc6 ([#220]feat:RecommendedFoodBox 컴포넌트 구현)
            />
          ))}
        </section>
        <FloatingActionButton onClick={scrollToTop} />
<<<<<<< HEAD
=======
>>>>>>> ef4577ad ([#220]design:SelectTab 수정)
=======
>>>>>>> 15b9bdc6 ([#220]feat:RecommendedFoodBox 컴포넌트 구현)
      </main>
    </>
  );
}
