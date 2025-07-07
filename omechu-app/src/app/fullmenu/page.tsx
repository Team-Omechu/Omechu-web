"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "../components/common/Bottom";
import SearchBar from "../components/common/SearchBar";
import FoodBox from "../components/common/FoodBox";
import FilterModal from "../components/fullmenu/FilterModal";
import TagItem from "../components/common/Tag";

export default function FullMenu() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<"recommend" | "recent">("recommend");
  const [visibleCount, setVisibleCount] = useState(21);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  // (TODO) API 연동하면 데이터 불러오기
  const foodItems = [
    "김치볶음밥", "비빔밥", "제육볶음", "갈비찜", "된장찌개", "김치찌개", "육개장", "순두부찌개", "감자탕", "콩나물국밥",
    "삼계탕", "불고기", "잡채", "해물파전", "동태찌개", "닭갈비", "족발", "보쌈", "오징어볶음", "낙지볶음",
    "떡볶이", "순대", "튀김우동", "잔치국수", "냉면", "비빔국수", "김밥", "유부초밥", "오므라이스", "새우튀김",
    "멸치볶음", "계란말이", "코다리조림", "계란찜", "닭도리탕", "북어국", "황태해장국", "청국장", "매운갈비찜", "참치마요덮밥",
    "꽁치김치찜", "아귀찜", "홍어삼합", "감자전", "김치전", "부추전", "도토리묵", "묵은지찜", "꼬막비빔밥", "콩국수", 
    "열무국수", "닭한마리", "해장국", "소머리국밥", "도가니탕", "설렁탕", "우거지국", "버섯전골", "해물탕", "매운탕", 
    "우엉조림", "장조림", "닭발", "불닭볶음면", "치즈라면", "쫄면", "비빔만두", "군만두", "물만두", "공깃밥", 
    "쌈밥", "곤드레밥", "버섯덮밥", "제첩국", "민물새우튀김", "계란국", "미역국", "오이냉국", "계란토스트", "찹쌀도너츠",
  ];

  const filteredItems = search.trim()
  ? foodItems.filter((item) => item.includes(search.trim()))
  : foodItems;
  
  const visibleItems = filteredItems.slice(0, visibleCount);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

      if (nearBottom && visibleCount < foodItems.length && !isLoading) {
        setIsLoading(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + 18, foodItems.length));
          setIsLoading(false);
        }, 1800);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, foodItems.length, isLoading]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchIconClick = () => {
    router.push(`/fullmenu?query=${search}`);
    setIsSearched(true);
  };

  return (
    <>
      <main className="min-h-screen p-4">
        <SearchBar 
          value={search}
          onChange={handleChange}
          onClickIcon={handleSearchIconClick}
          placeholder="음식명을 검색하세요"
        />

        <div className="flex flex-wrap gap-2 mt-3">
            {selectedFilters.map((tag, idx) => (
                <TagItem
                    key={idx}
                    label={tag}
                    onRemove={() =>
                      setSelectedFilters((prev) => prev.filter((item) => item !== tag))
                    }
                />
            ))}
            <button className="ml-auto" onClick={() => setIsFilterOpen(true)}>
               <img src={'/customselect.png'} alt="사용자필터" className="w-8 h-8"/>
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

        <div className="flex justify-end items-center gap-1 mt-4 mb-6 text-sm">
            <span
            className={sortMode === "recommend" ? "font-semibold" : "text-gray-500"}
            onClick={() => setSortMode("recommend")}
          >
            추천순
          </span>
          <div className="w-px h-4 bg-gray-400" />
          <span
            className={sortMode === "recent" ? "font-semibold" : "text-gray-500"}
            onClick={() => setSortMode("recent")}
          >
            최근 본 순
          </span>
        </div>

        {search.trim() && filteredItems.length === 0 && (
          <div className="text-center text-sm text-gray-500 mt-10">
            ‘{search}’에 대한 검색 결과가 없습니다.
          </div>
        )}

        {filteredItems.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {visibleItems.map((food, idx) => (
                <FoodBox
                    key={idx}
                    title={food}
                    imageUrl="/오메추-로고-보라색버전-모자4 1.png"
                    isExcluded={false}
                    isToggled={false}
                    onToggle={() => {}}
                    onClick={() => router.push(`/fullmenu/menu-detail?name=${encodeURIComponent(food)}`)}
                />
            ))}
        </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center mt-4 h-20">
            <div className="w-6 h-6 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"/>
            <span className="ml-2 text-gray-600 text-sm">로딩 중...</span>
          </div>
        )}
      </main>

      <BottomNav />
    </>
  );
}
