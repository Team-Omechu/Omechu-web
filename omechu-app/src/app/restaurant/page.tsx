/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { distance } from "fastest-levenshtein";

import SearchBar from "@/app/components/common/SearchBar";
import LocationModal from "@/app/components/restaurant/LocationModal/LocationModal";
import { Restaurants } from "@/app/constant/restaurant/restaurantList"; // 음식 데이터
import { suggestionList } from "@/app/constant/suggestionList";

import FloatingActionButton from "../components/common/FloatingActionButton";
import FoodCard from "../components/common/FoodCard";
import FilterTagList from "../components/restaurant/FilterTagList";
import KeywordSelector from "../components/restaurant/KeywordSelector";
import ModalWrapper from "../components/common/ModalWrapper";
import SortSelector, { SortOption } from "../components/common/SortSelector";

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
    { label: "추천", value: "recommend" },
    { label: "최근 본 식당", value: "recent" },
  ];

  type SortValue = SortOption["value"];

  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortValue>("recommend");
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

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

      <div className="mt-3 flex items-center gap-2">
        <button className="flex flex-shrink-0 items-center justify-between gap-1">
          <Image src={"/myLocation.svg"} alt="내 위치" width={16} height={16} />
          내 위치
        </button>
        <FilterTagList
          tags={selectedFilters}
          onRemove={(tag) =>
            setSelectedFilters((prev) => prev.filter((t) => t !== tag))
          }
          className="px-2"
        />
        <button
          className="ml-auto flex-shrink-0"
          onClick={() => setIsFilterOpen(true)}
        >
          <Image
            src={"/customselect.png"}
            alt="사용자필터"
            width={32}
            height={32}
          />
        </button>
      </div>

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
          onClick={() => router.push("")}
        >
          + 등록하기
        </button>
        <SortSelector
          options={sortOptions}
          selected={sortMode}
          onSelect={setSortMode}
        />
      </div>

      {/* 추천 영역 */}
      <div className="mb-2 mt-4 flex justify-end">
        {selectedKeywords.length === 0 ? (
          // 아무것도 선택되지 않음
          <button
            onClick={() => setShowKeywords((prev) => !prev)}
            className="flex items-center gap-1 rounded-full border border-gray-400 bg-white px-3 py-1 text-xs text-gray-500"
          >
            추천 키워드
            <Image
              src={"/down_arrow.svg"}
              alt="추천 키워드"
              width={16}
              height={16}
              className={`transition-transform duration-200 ${
                showKeywords ? "rotate-180" : ""
              }`}
            />
          </button>
        ) : (
          // 키워드 선택됨
          <div className="flex flex-wrap items-center gap-2">
            {selectedKeywords.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-full border border-gray-400 bg-white px-3 py-1 text-xs text-gray-700"
              >
                {tag}
              </span>
            ))}
            <button onClick={() => setShowKeywords((prev) => !prev)}>
              <Image
                src={"/down_arrow.svg"}
                alt="추천 키워드"
                width={24}
                height={24}
                className={`transition-transform duration-200 ${
                  showKeywords ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        )}
      </div>

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
        <div className="mb-12 mt-10 px-2">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-lg font-semibold text-black">
              ‘{search}’에 대한 검색 결과가 없습니다.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              검색어와 비슷한 결과를 알려드릴게요
            </p>
          </div>

          <hr className="mt-8 w-full border-t border-gray-600" />

          {similarItems.length > 0 && (
            <div className="mt-4 flex flex-col gap-4">
              {similarItems.map((item, idx) => (
                <FoodCard
                  key={idx}
                  item={item}
                  onClick={() =>
                    router.push(`/restaurant/restaurant-detail/${item.id}`)
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 음식 카드 리스트 */}
      <div className="flex flex-col gap-4">
        {visibleItems.map((item, idx) => (
          <FoodCard
            key={idx}
            item={item}
            onClick={() =>
              router.push(`/restaurant/restaurant-detail/${item.id}`)
            }
          />
        ))}
      </div>

      <div ref={loaderRef} className="h-[1px]" />

      {isLoading && (
        <div className="mt-4 flex h-20 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />
          <span className="ml-2 text-sm text-gray-600">로딩 중...</span>
        </div>
      )}

      <FloatingActionButton onClick={scrollToTop} className="bottom-24" />
    </main>
  );
}
