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
import { Menu } from "@/lib/types/menu";

export default function FullMenu() {
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

  // Initialize search from URL params on mount
  useEffect(() => {
    const queryFromUrl = searchParams.get("query");
    if (queryFromUrl) {
      setSearch(queryFromUrl);
      setIsSearched(true);
    }
  }, [searchParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Determine which query to use based on search and filters
  const hasFilters =
    Boolean(debouncedSearch.trim()) || selectedFilters.length > 0;

  const filterParams = {
    ...(debouncedSearch.trim() && { name: debouncedSearch.trim() }),
    ...(selectedFilters.length > 0 && { allergies: selectedFilters }),
  };

  // Use filtered API when tags are selected, otherwise use all menus
  const hasFilterTags = selectedFilters.length > 0;
  
  // Debug logs
  console.log("Filter state:", { 
    search, 
    debouncedSearch, 
    selectedFilters,
    hasFilterTags,
    tagsParam: selectedFilters.join(','),
    activeQueryType: hasFilterTags ? 'filtered' : 'all'
  });
  
  const menusQuery = useGetMenusQuery(!hasFilterTags ? {} : undefined);
  const filteredMenusQuery = useGetFilteredMenusQuery(
    { tags: selectedFilters.join(',') },
    hasFilterTags
  );

  const activeQuery = hasFilterTags ? filteredMenusQuery : menusQuery;

  // Get menu data from API response with memoization
  const rawMenus = useMemo(() => {
    const responseData = activeQuery.data;
    console.log("Raw API response:", responseData);

    // For filtered API, response is direct array
    if (Array.isArray(responseData)) {
      return responseData;
    } 
    // For regular menu API, response has success property
    else if (Array.isArray(responseData?.success)) {
      return responseData.success;
    }
    return [];
  }, [activeQuery.data]);

  // Client-side search and sorting logic
  const allMenus = useMemo(() => {
    if (!rawMenus.length) return [];

    // First filter by search term if exists
    let filtered = rawMenus;
    if (debouncedSearch.trim()) {
      filtered = rawMenus.filter(menu => 
        menu.name.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
      );
    }

    // Then sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortMode === "recommend") {
        // 추천순: 이름순 정렬 (가나다 순)
        return a.name.localeCompare(b.name, "ko");
      } else if (sortMode === "recent") {
        // 최근 본 순: 랜덤 정렬로 구현 (매번 다른 순서)
        return Math.random() - 0.5;
      }
      return 0;
    });

    console.log("Filtered menus:", filtered.length, "of", rawMenus.length);
    return sorted;
  }, [rawMenus, sortMode, debouncedSearch]);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 무한 스크롤은 백엔드에서 페이지네이션을 지원하지 않으므로 제거

  const handleSearchIconClick = () => {
    setIsSearched(true);
    // Don't change URL, just trigger search with current search state
    console.log("Search triggered with:", search);
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
          items={allMenus}
          search={debouncedSearch}
          isSearched={isSearched}
          isLoading={activeQuery.isLoading}
          onClickItem={(menuName) =>
            router.push(`/fullmenu/menu-detail?menuName=${menuName}`)
          }
        />

        {/* 무한 스크롤 제거 */}

        <FloatingActionButton onClick={scrollToTop} className="bottom-24" />
      </main>
    </>
  );
}
