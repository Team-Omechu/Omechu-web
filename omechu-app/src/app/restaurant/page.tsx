/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { distance } from "fastest-levenshtein";

import FloatingActionButton from "@/components/common/FloatingActionButton";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import ModalWrapper from "@/components/common/ModalWrapper";
import SearchBar from "@/components/common/SearchBar";
import SortSelector, { SortOption } from "@/components/common/SortSelector";
import { Restaurants } from "@/constant/restaurant/restaurantList"; // 음식 데이터
import { suggestionList } from "@/constant/suggestionList";
import FoodCardList from "@/restaurant/components/FoodCardList";
import SearchResultEmpty from "@/restaurant/components/SearchResultEmpty";

import FilterSection from "./components/FilterSection/RestaurantFilterSection";
import KeywordSelector from "./components/KeywordSection/KeywordSelector";
import KeywordToggleSection from "./components/KeywordSection/KeywordToggleSection";
import LocationModal from "./components/LocationFilterModal/LocationModal";
import RestaurantAddModal from "./components/RestaurantAddModal/RestaurantAddModal";

export default function Restaurant() {
  const keywordList = [
    "아침식사",
    "점심식사",
    "저녁식사",
    "야식",
    "혼밥",
    "데이트",
    "가족",
    "단체회식",
    "고급스러운",
    "가성비",
    "기념일",
    "술모임",
    "시끌벅적한",
    "깔끔한",
    "캐주얼한",
    "조용한",
  ];

  const sortOptions: SortOption[] = [
    { label: "추천 순", value: "recommend" },
    { label: "최근 본 순", value: "recent" },
  ];

  type SortValue = SortOption["value"];

  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  // 검색어 상태
  const [search, setSearch] = useState("");
  // 현재 선택된 정렬 모드
  const [sortMode, setSortMode] = useState<SortValue>("recommend");
  // 현재 표시되는 항목 수
  const [visibleCount, setVisibleCount] = useState(8);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 필터링 모달 열림 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // 필터링된 항목을 저장하는 상태
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  // 검색 후 상태를 저장하는 상태
  const [isSearched, setIsSearched] = useState(false);
  // 키워드 토글 상태
  const [showKeywords, setShowKeywords] = useState(false);
  // 선택된 키워드 상태
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  // 식당 등록 모달 열림 상태
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredItems = search.trim()
    ? Restaurants.filter((item) => item.menu.includes(search.trim()))
    : Restaurants;

  const similarItems = Restaurants.filter(
    (item) =>
      distance(item.menu, search.trim()) <= 2 && // 유사 거리 임계값 조정 가능
      !item.menu.includes(search.trim()), // 정확 검색에 이미 포함된 건 제외
  );

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

  const handleSearch = (search: string) => {
    router.push(`/restaurant?query=${search}`);
    setIsSearched(true);
    console.log("검색어:", search);
  };

  return (
    <main ref={mainRef} className="min-h-screen px-4 pb-20 pt-6">
      <SearchBar
        placeholder="음식명을 검색하세요."
        inputValue={search}
        setInputValue={setSearch}
        onSearch={handleSearch}
        suggestionList={suggestionList}
      />

      <FilterSection
        selectedFilters={selectedFilters}
        onRemoveFilter={(tag) =>
          setSelectedFilters((prev) => prev.filter((t) => t !== tag))
        }
        onOpenFilterModal={() => setIsFilterOpen(true)}
      />

      {isFilterOpen && (
        <ModalWrapper>
          <LocationModal
            selected={selectedFilters}
            onClose={() => setIsFilterOpen(false)}
            onApply={(newFilters) => setSelectedFilters(newFilters)}
          />
        </ModalWrapper>
      )}

      <hr className="my-1 border-black" />

      <div className="mb-2 mt-2 flex items-center justify-between text-xs">
        <button
          className="rounded-full bg-[#3FA2FF] px-7 py-2 text-white"
          onClick={() => setShowAddModal(true)}
        >
          + 등록하기
        </button>
        {/* {showAddModal && (
          <ModalWrapper>
            <RestaurantAddModal onClose={() => setShowAddModal(false)} />
          </ModalWrapper>
        )} */}
        <SortSelector
          options={sortOptions}
          selected={sortMode}
          onSelect={setSortMode}
        />
      </div>

      {/* 추천 영역 */}
      <KeywordToggleSection
        selectedKeywords={selectedKeywords}
        showKeywords={showKeywords}
        onToggleShow={() => setShowKeywords((prev) => !prev)}
      />

      {/* 키워드 펼침 영역 */}
      {showKeywords && (
        <KeywordSelector
          keywords={keywordList}
          selected={selectedKeywords}
          onToggle={(keyword) =>
            setSelectedKeywords((prev) =>
              prev.includes(keyword)
                ? prev.filter((k) => k !== keyword)
                : [...prev, keyword],
            )
          }
          maxSelected={3}
        />
      )}

      {isSearched && search.trim() && filteredItems.length === 0 && (
        <SearchResultEmpty
          search={search}
          similarItems={similarItems}
          onItemClick={(id) =>
            router.push(`/restaurant/restaurant-detail/${id}`)
          }
        />
      )}

      {/* 음식 카드 리스트 */}
      <FoodCardList
        items={visibleItems}
        onItemClick={(id) => router.push(`/restaurant/restaurant-detail/${id}`)}
      />

      <div ref={loaderRef} className="h-[1px]" />

      {isLoading && <LoadingIndicator />}

      <FloatingActionButton onClick={scrollToTop} className="bottom-24" />
    </main>
  );
}
