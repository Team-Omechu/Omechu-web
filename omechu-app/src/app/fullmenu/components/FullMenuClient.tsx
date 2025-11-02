/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import FloatingActionButton from "@/components/common/FloatingActionButton";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import ModalWrapper from "@/components/common/ModalWrapper";
import SearchBar from "@/components/common/SearchBar";
import SortSelector, { SortOption } from "@/components/common/SortSelector";
import { suggestionList } from "@/constant/suggestionList";
import FilterModal from "@/fullmenu/components/FilterModal";
import FilterSection from "@/fullmenu/components/FilterSection";
import FoodListSection from "@/fullmenu/components/FoodListSection";
import {
  useGetMenusQuery,
  useGetFilteredMenusQuery,
} from "@/fullmenu/hooks/useMenuQueries";

export default function FullMenuClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mainRef = useRef<HTMLDivElement>(null);

  const sortOptions: SortOption[] = [
    { label: "추천 순", value: "recommend" },
    { label: "최근 본 순", value: "recent" },
  ];
  type SortValue = SortOption["value"];

  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortValue>("recommend");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 최근 본 메뉴 관리
  const RECENT_KEY = "recentViewedMenus";
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) setRecentIds(JSON.parse(saved));
    } catch {}
  }, []);

  const recordRecent = useCallback((menuName: string) => {
    setRecentIds((prev) => {
      const next = [menuName, ...prev.filter((x) => x !== menuName)].slice(
        0,
        100,
      );
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // 무한스크롤 상태
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // URL → state 복구
  useEffect(() => {
    const queryFromUrl = searchParams.get("query");
    if (queryFromUrl) {
      setSearch(queryFromUrl);
      setIsSearched(true);
    }
  }, [searchParams]);

  // 검색 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // API 호출
  const hasFilterTags = selectedFilters.length > 0;
  const menusQuery = useGetMenusQuery(!hasFilterTags ? {} : undefined);
  const filteredMenusQuery = useGetFilteredMenusQuery(
    { tags: selectedFilters.join(",") },
    hasFilterTags,
  );

  const activeQuery = hasFilterTags ? filteredMenusQuery : menusQuery;

  // API 응답 데이터
  const rawMenus = useMemo(() => {
    const responseData = activeQuery.data;
    if (Array.isArray(responseData)) {
      return responseData;
    } else if (Array.isArray(responseData?.success)) {
      return responseData.success;
    }
    return [];
  }, [activeQuery.data]);

  // 검색 + 정렬
  const allMenus = useMemo(() => {
    if (!rawMenus.length) return [];
    let filtered = rawMenus;

    if (debouncedSearch.trim()) {
      filtered = rawMenus.filter((menu) =>
        menu.name.toLowerCase().includes(debouncedSearch.trim().toLowerCase()),
      );
    }

    if (sortMode === "recommend") {
      // 랜덤 정렬
      return [...filtered].sort(() => Math.random() - 0.5);
    }
    if (sortMode === "recent") {
      // 최근 본 순서 정렬
      const rank = new Map<string, number>();
      recentIds.forEach((name, idx) => rank.set(name, idx));
      const originalIndex = new Map<string, number>();
      filtered.forEach((m, idx) => originalIndex.set(m.name, idx));

      return [...filtered].sort((a, b) => {
        const ra = rank.has(a.name) ? rank.get(a.name)! : Infinity;
        const rb = rank.has(b.name) ? rank.get(b.name)! : Infinity;
        if (ra !== rb) return ra - rb;
        return (
          (originalIndex.get(a.name) ?? 0) - (originalIndex.get(b.name) ?? 0)
        );
      });
    }

    return filtered;
  }, [rawMenus, sortMode, debouncedSearch, recentIds]);

  // 현재 페이지까지 보여줄 데이터
  const visibleMenus = useMemo(() => {
    return allMenus.slice(0, page * itemsPerPage);
  }, [allMenus, page]);

  // 무한스크롤
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (!target.isIntersecting) return;
      if (page * itemsPerPage < allMenus.length) {
        setPage((prev) => prev + 1);
      }
    },
    [page, allMenus.length],
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

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchIconClick = () => {
    setIsSearched(true);
    console.log("Search triggered with:", search);
  };

  return (
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

      <hr className="my-1 border-grey-dark-hover" />

      <SortSelector
        options={sortOptions}
        selected={sortMode}
        onSelect={setSortMode}
      />

      <FoodListSection
        items={visibleMenus}
        search={debouncedSearch}
        isSearched={isSearched}
        isLoading={activeQuery.isLoading}
        onClickItem={(menuName) => {
          recordRecent(menuName);
          router.push(`/fullmenu/menu-detail?menuName=${menuName}`);
        }}
      />

      <div ref={loaderRef} className="h-px" />

      {activeQuery.isLoading && <LoadingIndicator />}

      <FloatingActionButton onClick={scrollToTop} className="bottom-24" />
    </main>
  );
}
