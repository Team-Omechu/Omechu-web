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
import FoodCardList from "@/restaurant/components/FoodCardList";
import SearchResultEmpty from "@/restaurant/components/SearchResultEmpty";

import FilterSection from "./FilterSection/RestaurantFilterSection";
import KeywordSelector from "./KeywordSection/KeywordSelector";
import KeywordToggleSection from "./KeywordSection/KeywordToggleSection";
import LocationModal from "./LocationFilterModal/LocationModal";
import RestaurantAddModal from "./RestaurantAddModal/RestaurantAddModal";

import { suggestionList } from "@/constant/suggestionList";
import { useRestaurantFetcher } from "@/lib/hooks/useRestaurantFetcher";
import type { Restaurant } from "@/lib/types/restaurant";

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

  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortValue>("recommend");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const { restaurantList, fetchRestaurants, isLoading, hasMore, reset } =
    useRestaurantFetcher(selectedFilters, selectedKeywords);

  // 검색어를 이용한 필터링
  const filteredItems = search.trim()
    ? restaurantList.filter(
        (item) =>
          item.name?.includes(search.trim()) ||
          item.menu?.includes(search.trim()),
      )
    : restaurantList;

  const similarItems: Restaurant[] = restaurantList.filter(
    (item) =>
      distance(item.name, search.trim()) <= 2 &&
      !item.name.includes(search.trim()),
  );

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

      if (target.isIntersecting && !isLoading && hasMore) {
        fetchRestaurants();
      }
    },
    [fetchRestaurants, isLoading, hasMore],
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

  useEffect(() => {
    reset();
    fetchRestaurants();
  }, [selectedFilters, selectedKeywords]);

  const handleSearch = (search: string) => {
    router.push(`/restaurant?query=${search}`);
    setIsSearched(true);
    console.log("검색어:", search);
  };

  const handleClickMyLocation = async () => {
    if (!navigator.geolocation) {
      alert("이 브라우저는 위치 정보 기능을 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const res = await fetch(
          `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
          {
            headers: {
              Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_MAP_REST_API_KEY}`,
            },
          },
        );

        const data = await res.json();
        const region1 = data.documents?.[0]?.region_1depth_name;
        const region2 = data.documents?.[0]?.region_2depth_name;
        const region3 = data.documents?.[0]?.region_3depth_name;

        if (!region1 || !region2 || !region3) {
          alert("주소를 불러올 수 없습니다.");
          return;
        }

        const cleanRegion1 = region1
          .replace("특별", "")
          .replace("광역", "")
          .replace("자치", "")
          .replace("시", "");

        const address = `${cleanRegion1} ${region2} ${region3}`;
        console.log("정제된 주소:", address);

        // ✅ 중복 방지하고 필터에 추가
        setSelectedFilters((prev) =>
          prev.includes(address) ? prev : [...prev, address],
        );
      },
      (error) => {
        alert("위치 접근이 거부되었거나 실패했습니다.");
        console.error(error);
      },
      { enableHighAccuracy: true },
    );
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
        onClickMyLocation={handleClickMyLocation}
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
        {showAddModal && (
          <ModalWrapper>
            <RestaurantAddModal onClose={() => setShowAddModal(false)} />
          </ModalWrapper>
        )}
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
        items={restaurantList}
        onItemClick={(id) => router.push(`/restaurant/restaurant-detail/${id}`)}
      />

      <div ref={loaderRef} className="h-[1px]" />

      {isLoading && <LoadingIndicator />}

      <FloatingActionButton onClick={scrollToTop} className="bottom-24" />
    </main>
  );
}
