/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ 추가
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
import type { Restaurant } from "@/lib/types/restaurant";
import { useRestaurantList } from "../api/restaurantList";
import { useRestaurantSearch } from "../api/restaurantSearch";

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
  const sp = useSearchParams(); // ✅ 추가
  const mainRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const SORT_KEY = "restaurantSortMode";
  const [sortMode, setSortMode] = useState<SortValue>(() => {
    if (typeof window === "undefined") return "recommend";
    const saved = localStorage.getItem(SORT_KEY) as SortValue | null;
    return saved ?? "recommend";
  });
  useEffect(() => {
    try {
      localStorage.setItem(SORT_KEY, sortMode);
    } catch {}
  }, [sortMode]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // ✅ URL → 상태 복구 (최초 1회)
  useEffect(() => {
    const menu = sp.get("menu") ?? "";
    const tags = (sp.get("tags") ?? "").split(",").filter(Boolean);
    const loc = (sp.get("loc") ?? "").split(",").filter(Boolean);
    const sort = sp.get("sort") as SortValue | null;

    setSearch(menu);
    setSelectedKeywords(tags);
    setSelectedFilters(loc);
    if (sort === "recommend" || sort === "recent") setSortMode(sort);
    if (menu || tags.length || loc.length) setIsSearched(true);
  }, []);

  // ✅ 상태 → URL 동기화
  const pushSearchUrl = useCallback(
    ({
      menu,
      tags,
      loc,
    }: {
      menu?: string;
      tags?: string[];
      loc?: string[];
    }) => {
      const q = new URLSearchParams(sp?.toString() ?? "");
      const setOrDelete = (key: string, value?: string | string[]) => {
        const arr = Array.isArray(value) ? value.filter(Boolean) : value;
        const isEmpty =
          value === undefined ||
          value === null ||
          (typeof arr === "string" && arr.trim() === "") ||
          (Array.isArray(arr) && arr.length === 0);
        if (isEmpty) q.delete(key);
        else q.set(key, Array.isArray(arr) ? arr.join(",") : (arr ?? ""));
      };

      if (menu !== undefined) setOrDelete("menu", menu);
      if (tags !== undefined) setOrDelete("tags", tags);
      if (loc !== undefined) setOrDelete("loc", loc);

      const qs = q.toString();
      router.replace(qs ? `/restaurant?${qs}` : "/restaurant", {
        scroll: false,
      });
    },
    [router, sp],
  );

  // 🔒 최초 1회는 URL 안 건드리게 가드
  const didHydrate = useRef(false);
  useEffect(() => {
    if (!didHydrate.current) {
      didHydrate.current = true;
      return;
    }
    pushSearchUrl({
      menu: search,
      tags: selectedKeywords,
      loc: selectedFilters,
    });
  }, [
    search,
    selectedKeywords.join(","),
    selectedFilters.join(","),
    pushSearchUrl,
  ]);

  useEffect(() => {
    // 검색/필터/정렬 변경 시 URL 반영
    pushSearchUrl({
      menu: search,
      tags: selectedKeywords,
      loc: selectedFilters,
    });
  }, [
    search,
    selectedKeywords.join(","),
    selectedFilters.join(","),
    sortMode,
    pushSearchUrl,
  ]);

  // ✅ 검색 모드 판단 (하나라도 있으면 서버 검색)
  const isSearchMode =
    !!search.trim() ||
    selectedKeywords.length > 0 ||
    selectedFilters.length > 0;

  // ✅ 검색 훅 (서버 스펙: tag/location 단일 값이므로 첫 번째만 사용)
  const searchTag = selectedKeywords[0] ?? "";
  const searchLocation = selectedFilters[0] ?? "";
  const {
    items: searchedItems,
    fetchNext: fetchSearchNext,
    isLoading: isSearchLoading,
    hasMore: hasSearchMore,
    reset: resetSearch,
    isError: isSearchError,
  } = useRestaurantSearch({
    menu: search.trim() || "",
    tag: searchTag,
    location: searchLocation,
  });

  // 기존 리스트 훅
  const { restaurantList, fetchRestaurants, isLoading, hasMore, reset } =
    useRestaurantList();

  // 최근 본
  const RECENT_KEY = "recentViewedRestaurants";
  const [recentIds, setRecentIds] = useState<number[]>([]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) setRecentIds(JSON.parse(saved));
    } catch {}
  }, []);
  const recordRecent = useCallback((id: number) => {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 100);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // (로컬) 검색어로 필터링 — 기본 리스트에만 적용 (검색모드일 땐 서버가 필터)
  const filteredItems = search.trim()
    ? restaurantList.filter(
        (item) =>
          item.name?.includes(search.trim()) ||
          item.menus?.includes(search.trim()),
      )
    : restaurantList;

  const similarItems: Restaurant[] = restaurantList.filter((item) => {
    const name = item?.name ?? "";
    const keyword = search?.trim() ?? "";
    if (!name || !keyword) return false;
    return distance(name, keyword) <= 3 && !name.includes(keyword);
  });

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 무한 스크롤
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (!target.isIntersecting) return;
      if (isSearchMode) {
        if (!isSearchLoading && hasSearchMore) fetchSearchNext();
      } else {
        if (!isLoading && hasMore) fetchRestaurants();
      }
    },
    [
      isSearchMode,
      isSearchLoading,
      hasSearchMore,
      fetchSearchNext,
      isLoading,
      hasMore,
      fetchRestaurants,
    ],
  );
  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px 0px 160px 0px",
      threshold: 0,
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [observerCallback]);

  // 데이터 소스 스위치
  useEffect(() => {
    if (isSearchMode) {
      resetSearch();
      fetchSearchNext();
    } else {
      reset();
      fetchRestaurants();
    }
  }, [
    isSearchMode,
    search,
    selectedKeywords.join(","),
    selectedFilters.join(","),
  ]);

  // 정렬 입력 대상
  const baseItems = isSearchMode ? searchedItems : filteredItems;
  const sortedItems = useMemo(() => {
    if (sortMode === "recommend") {
      return [...baseItems].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    if (sortMode === "recent") {
      const rank = new Map<number, number>();
      recentIds.forEach((id, idx) => rank.set(id, idx));
      const originalIndex = new Map<number, number>();
      baseItems.forEach((r, idx) => originalIndex.set(r.id, idx));
      return [...baseItems].sort((a, b) => {
        const ra = rank.has(a.id) ? rank.get(a.id)! : Infinity;
        const rb = rank.has(b.id) ? rank.get(b.id)! : Infinity;
        if (ra !== rb) return ra - rb;
        return (originalIndex.get(a.id) ?? 0) - (originalIndex.get(b.id) ?? 0);
      });
    }
    return baseItems;
  }, [sortMode, baseItems, recentIds]);

  // 검색 제출 시 URL도 함께 반영
  const handleSearch = (text: string) => {
    setIsSearched(true);
    setSearch(text);
    pushSearchUrl({
      menu: text,
      tags: selectedKeywords,
      loc: selectedFilters,
    });
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

  const handleItemClick = (id: number) => {
    recordRecent(id);
    router.push(`/restaurant/restaurant-detail/${id}`);
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

      <hr className="my-1 border-grey-darkHover" />

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

      <KeywordToggleSection
        selectedKeywords={selectedKeywords}
        showKeywords={showKeywords}
        onToggleShow={() => setShowKeywords((prev) => !prev)}
      />

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

      {isSearchMode
        ? isSearched &&
          !isSearchLoading &&
          (isSearchError || searchedItems.length === 0) && (
            <SearchResultEmpty
              search={search}
              similarItems={similarItems}
              onItemClick={(id) => handleItemClick(id)}
            />
          )
        : // ✅ 일반 모드: 기존 로컬 필터 기준
          isSearched &&
          !isLoading &&
          filteredItems.length === 0 && (
            <SearchResultEmpty
              search={search}
              similarItems={similarItems}
              onItemClick={(id) => handleItemClick(id)}
            />
          )}

      <FoodCardList
        items={sortedItems}
        onItemClick={(id) => handleItemClick(id)}
      />

      <div ref={loaderRef} className="h-[1px]" />

      {/* ✅ 검색 모드일 때는 검색 로딩을 보여주자 */}
      {(isSearchMode ? isSearchLoading : isLoading) && <LoadingIndicator />}

      <FloatingActionButton onClick={scrollToTop} className="bottom-24" />
    </main>
  );
}
