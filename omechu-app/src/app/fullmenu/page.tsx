/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import FloatingActionButton from "../components/common/FloatingActionButton";
import BottomNav from "../components/common/Bottom";
import FoodBox from "../components/common/FoodBox";
import SearchBar from "../components/common/SearchBar";
import TagItem from "../components/common/TagItem";
import FilterModal from "../components/fullmenu/FilterModal";
import { suggestionList } from "../constant/suggestionList";
import { foodItems } from "../constant/foodItems";

export default function FullMenu() {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<"recommend" | "recent">("recommend");
  const [visibleCount, setVisibleCount] = useState(21);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  const filteredItems = search.trim()
    ? foodItems.filter((item) => item.includes(search.trim()))
    : foodItems;

  const visibleItems = filteredItems.slice(0, visibleCount);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 무한 스크롤 구현에 대한 설명:
  // 1. 사용자가 스크롤을 내리면 IntersectionObserver가 페이지 하단의 특정 요소(loaderRef)를 감지합니다.
  // 2. 해당 요소가 뷰포트에 들어오면 observerCallback이 호출되어,
  //    현재 로딩 중이 아니고, 아직 모든 항목을 로드하지 않은 경우,
  //    로딩 상태를 true로 설정하고 visibleCount를 증가시킵니다.
  // 3. visibleCount가 증가하면, 화면에 표시되는 항목이 늘어나고, 새로운 항목들이 렌더링됩니다.
  // 4. 로딩 상태는 일정 시간 후 자동으로 false로 설정되어, 로딩 애니메이션이 사라집니다.

  // 무한 스크롤 감지를 위한 ref. 페이지 하단의 div에 연결됨
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver 콜백 함수
  // loaderRef 요소가 뷰포트에 들어오면 다음 항목들을 불러옴
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];

      // 요소가 보이고, 로딩 중이 아니며, 아직 모든 항목을 로드하지 않은 경우
      if (
        target.isIntersecting &&
        !isLoading &&
        visibleCount < filteredItems.length
      ) {
        setIsLoading(true); // 로딩 상태 시작
        setVisibleCount((prev) => Math.min(prev + 18, filteredItems.length)); // 다음 항목 18개 추가
      }
    },
    [isLoading, visibleCount, filteredItems.length],
  );

  // IntersectionObserver 등록 및 해제
  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null, // 뷰포트를 기준으로 관찰
      rootMargin: "0px 0px 160px 0px", // 하단 여백 확보 (BottomNav 높이 고려)
      threshold: 0, // 요소가 조금이라도 보이면 콜백 실행
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [observerCallback]);

  // 로딩 상태를 일정 시간 후 자동 해제 (로딩 애니메이션 표시 목적)
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1800); // 1.8초 후 로딩 해제

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFilterOpen]);

  const handleSearchIconClick = () => {
    router.push(`/fullmenu?query=${search}`);
    setIsSearched(true);
  };

  return (
    <>
      <main ref={mainRef} className="min-h-screen p-4">
        <SearchBar
          placeholder="음식명을 검색하세요"
          inputValue={search}
          setInputValue={setSearch}
          onSearch={handleSearchIconClick}
          suggestionList={suggestionList}
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {selectedFilters.map((tag, idx) => (
            <TagItem
              key={idx}
              label={tag}
              onRemove={() =>
                setSelectedFilters((prev) =>
                  prev.filter((item) => item !== tag),
                )
              }
              className="px-6"
            />
          ))}
          <button className="ml-auto" onClick={() => setIsFilterOpen(true)}>
            <Image
              src={"/customselect.png"}
              alt="사용자필터"
              className="h-8 w-8"
              width={32}
              height={32}
            />
          </button>
        </div>

        {isFilterOpen && (
          <FilterModal
            selected={selectedFilters}
            onClose={() => setIsFilterOpen(false)}
            onApply={(newFilters) => setSelectedFilters(newFilters)}
          />
        )}

        <hr className="my-1 border-black" />

        <div className="mb-6 mt-4 flex items-center justify-end gap-1 text-sm">
          <span
            className={
              sortMode === "recommend" ? "font-semibold" : "text-gray-500"
            }
            onClick={() => setSortMode("recommend")}
          >
            추천순
          </span>
          <div className="h-4 w-px bg-gray-400" />
          <span
            className={
              sortMode === "recent" ? "font-semibold" : "text-gray-500"
            }
            onClick={() => setSortMode("recent")}
          >
            최근 본 순
          </span>
        </div>

        {isSearched && search.trim() && filteredItems.length === 0 && (
          <div className="mt-10 text-center text-sm text-gray-500">
            ‘{search}’에 대한 검색 결과가 없습니다.
          </div>
        )}

        {filteredItems.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {visibleItems.map((food, idx) => (
              <FoodBox
                key={idx}
                title={food}
                imageUrl="/logo.png"
                isExcluded={false}
                isToggled={false}
                onToggle={() => {}}
                onClick={() =>
                  router.push(
                    `/fullmenu/menu-detail?name=${encodeURIComponent(food)}`,
                  )
                }
              />
            ))}
          </div>
        )}

        <div ref={loaderRef} className="h-[1px]" />

        {isLoading && (
          <div className="mt-4 flex h-20 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />
            <span className="ml-2 text-sm text-gray-600">로딩 중...</span>
          </div>
        )}

        <FloatingActionButton onClick={scrollToTop} className="bottom-24" />
      </main>
    </>
  );
}
