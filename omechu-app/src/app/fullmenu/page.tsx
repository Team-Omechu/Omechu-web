/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";

import { useRouter } from "next/navigation";

import FloatingActionButton from "@/components/common/FloatingActionButton";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import ModalWrapper from "@/components/common/ModalWrapper";
import SearchBar from "@/components/common/SearchBar";
import SortSelector, { SortOption } from "@/components/common/SortSelector";
import FilterModal from "@/components/fullmenu/FilterModal";
import FilterSection from "@/components/fullmenu/FilterSection";
import FoodListSection from "@/components/fullmenu/FoodListSection";
import { foodItems } from "@/constant/foodItems";
import { suggestionList } from "@/constant/suggestionList";

export default function FullMenu() {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const sortOptions: SortOption[] = [
    { label: "추천 순", value: "recommend" },
    { label: "최근 본 순", value: "recent" },
  ];

  type SortValue = SortOption["value"];

  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortValue>("recommend");
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

        <FilterSection
          tags={selectedFilters}
          onRemove={(tag) =>
            setSelectedFilters((prev) => prev.filter((t) => t !== tag))
          }
          onOpen={() => setIsFilterOpen(true)}
        />

        {isFilterOpen && (
          <ModalWrapper>
            <FilterModal
              selected={selectedFilters}
              onClose={() => setIsFilterOpen(false)}
              onApply={(newFilters) => setSelectedFilters(newFilters)}
            />
          </ModalWrapper>
        )}

        <hr className="my-1 border-black" />

        <SortSelector
          options={sortOptions}
          selected={sortMode}
          onSelect={setSortMode}
        />

        <FoodListSection
          items={visibleItems}
          search={search}
          isSearched={isSearched}
          onClickItem={(food) =>
            router.push(
              `/fullmenu/menu-detail?name=${encodeURIComponent(food)}`,
            )
          }
        />

        <div ref={loaderRef} className="h-[1px]" />

        {isLoading && <LoadingIndicator />}

        <FloatingActionButton onClick={scrollToTop} className="bottom-24" />
      </main>
    </>
  );
}
