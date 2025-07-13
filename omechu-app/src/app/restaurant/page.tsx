'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { distance } from "fastest-levenshtein";
import SearchBar from "@/app/components/common/SearchBar";
import Image from "next/image";
import { suggestionList } from "@/app/constant/suggestionList";
import TagItem from "@/app/components/common/Tag";
import { foodItems } from "@/app/constant/restautantFoodList"; // 음식 데이터
import LocationModal from "@/app/components/restaurant/LoactionModal/LocationModal";

export default function Restaurant() {

    const keywordList = [
        "아침식사", "점심식사", "저녁식사", "야식",
        "혼밥", "데이트", "가족", "단체회식",
        "고급스러운", "가성비", "기념일", "술모임",
        "시끌벅적한", "깔끔한", "캐주얼한", "조용한",
    ];

    const router = useRouter();
    const [search, setSearch] = useState('');
    const [sortMode, setSortMode] = useState<"recommend" | "recent">("recommend");
    // const [visibleCount, setVisibleCount] = useState(21);
    // const [isLoading, setIsLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [isSearched, setIsSearched] = useState(false);
    const [showKeywords, setShowKeywords] = useState(false);
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

    const filteredItems = search.trim()
        ? foodItems.filter((item) => item.menu.includes(search.trim()))
        : foodItems;

    const similarItems = foodItems
    .filter(
        (item) =>
        distance(item.menu, search.trim()) <= 2 && // 유사 거리 임계값 조정 가능
        !item.menu.includes(search.trim()) // 정확 검색에 이미 포함된 건 제외
    );
        
    // const visibleItems = filteredItems.slice(0, visibleCount);

    const handleSearch = (search: string) => {
        router.push(`/restaurant?query=${search}`);
        setIsSearched(true);
        console.log("검색어:", search);
    };

    useEffect(() => {
        if (isFilterOpen) {
        document.body.style.overflow = 'hidden';
        } else {
        document.body.style.overflow = 'auto';
        }

        return () => {
        document.body.style.overflow = 'auto';
        };
    }, [isFilterOpen]);

    return (
        <div className="min-h-screen px-4 pt-6 pb-20">
            <SearchBar
                placeholder="음식명을 검색하세요."
                inputValue={search}
                setInputValue={setSearch}
                onSearch={handleSearch}
                suggestionList={suggestionList}
            />

            <div className="flex items-center gap-2 mt-3">
                <button className="flex justify-between items-center gap-1 flex-shrink-0">
                    <img src={'/myLocation.svg'} alt="내 위치" className="w-4 h-4"/>
                    내 위치
                </button>
                <div className="flex overflow-x-auto whitespace-nowrap gap-2 mx-2 scrollbar-hide">
                    {selectedFilters.map((tag, idx) => (
                    <TagItem
                        key={idx}
                        label={tag}
                        onRemove={() =>
                        setSelectedFilters((prev) => prev.filter((item) => item !== tag))
                        }
                        className="px-2"
                    />
                    ))}
                </div>
                <button className="flex-shrink-0 ml-auto" onClick={() => setIsFilterOpen(true)}>
                    <img src={'/customselect.png'} alt="사용자필터" className="w-8 h-8"/>
                </button>
            </div>
    
            {isFilterOpen && (
                <LocationModal
                selected={selectedFilters}
                onClose={() => setIsFilterOpen(false)}
                onApply={(newFilters) => setSelectedFilters(newFilters)}
                />
            )}
    
            <hr className="my-1 border-black" />
    
            <div className="flex justify-between items-center mt-2 mb-2 text-xs">
                <button 
                    className="bg-[#3FA2FF] text-white px-7 py-2 rounded-full"
                    onClick={() => router.push('')}
                >
                    + 등록하기
                </button>
                <div className="flex justify-end items-center gap-2 text-sm">
                    <span
                        className={sortMode === "recommend" ? "font-semibold" : "text-gray-500"}
                        onClick={() => setSortMode("recommend")}
                    >
                    추천
                    </span>
                    <div className="w-px h-3 bg-gray-400" />
                        <span
                            className={sortMode === "recent" ? "font-semibold" : "text-gray-500"}
                            onClick={() => setSortMode("recent")}
                        >
                        최근 본 식당
                    </span>
                </div>
            </div>

            {/* 추천 영역 */}
            <div className="flex justify-end mt-4 mb-2">
                {selectedKeywords.length === 0 ? (
                    // 아무것도 선택되지 않음
                    <button
                        onClick={() => setShowKeywords((prev) => !prev)}
                        className="flex items-center gap-1 border border-gray-400 bg-white text-gray-500 text-xs px-3 py-1 rounded-full"
                    >
                        추천 키워드
                        <img 
                            src={'/down_arrow.svg'} 
                            alt="추천 키워드" 
                            className={`w-4 h-4 transition-transform duration-200 ${
                                showKeywords ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                ) : (
                    // 키워드 선택됨
                    <div className="flex items-center gap-2 flex-wrap">
                        {selectedKeywords.map((tag, idx) => (
                            <span
                                key={idx}
                                className="border border-gray-400 bg-white text-gray-700 text-xs px-3 py-1 rounded-full"
                            >
                            {tag}
                            </span>
                        ))}
                        <button 
                            onClick={() => setShowKeywords((prev) => !prev)}
                        >
                            <img 
                                src={'/down_arrow.svg'} 
                                alt="추천 키워드" 
                                className={`w-6 h-6 transition-transform duration-200 ${
                                    showKeywords ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                    </div>
                )}
            </div>

            {/* 키워드 펼침 영역 */}
            {showKeywords && (
                <div className="flex flex-wrap justify-end gap-1 text-xs mb-4">
                    {keywordList.map((keyword, idx) => {
                        const isSelected = selectedKeywords.includes(keyword);
                        return (
                            <button
                                key={idx}
                                onClick={() =>
                                    setSelectedKeywords((prev) =>
                                    isSelected
                                        ? prev.filter((item) => item !== keyword)
                                        : [...prev, keyword]
                                    )
                                }
                                className={`w-20 h-7 rounded-full border border-gray-400 text-sm ${
                                    isSelected
                                    ? "bg-[#FB4746] text-white"
                                    : "bg-white text-gray-600"
                                }`}
                            >
                                {keyword}
                            </button>
                        );
                    })}
                </div>
            )}

            {isSearched && search.trim() && filteredItems.length === 0 && (
                <div className="mt-10 mb-12 px-2">
                    <div className="flex flex-col items-center justify-center text-center">
                        <p className="text-lg text-black font-semibold">
                            ‘{search}’에 대한 검색 결과가 없습니다.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            검색어와 비슷한 결과를 알려드릴게요
                        </p>
                    </div>

                    <hr className="mt-8 border-t border-gray-600 w-full" />

                    {similarItems.length > 0 && (
                        <>
                            <div className="flex flex-col gap-4 mt-4">
                            {similarItems.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className="flex justify-between items-start gap-3 p-3 border border-black rounded-xl shadow-md bg-white"
                                    onClick={() => router.push(`/restaurant/restaurant-detail?menu=${encodeURIComponent(item.menu)}`)}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-sm font-semibold">
                                            <span>{item.name}</span>
                                            <span className="flex items-center gap-1 text-yellow-500 text-xs font-normal">
                                                ⭐ {item.rating} 
                                                <span className="text-yellow-500">({item.reviews})</span>
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-3">{item.address}</p>
                                        <p className="text-blue-600 font-bold text-sm mb-1">{item.menu}</p>
                                        <div className="flex gap-2 flex-wrap mt-1 text-xs">
                                        {item.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="border border-blue-400 text-blue-400 rounded-full px-2 py-0.5"
                                            >
                                            {tag}
                                            </span>
                                        ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col place-items-end gap-2">
                                        <button>
                                            <img src={'/Heart.svg'} alt="사용자필터" className="w-5 h-5"/>
                                        </button>
                                        <Image
                                            src={item.image}
                                            alt={item.menu}
                                            width={70}
                                            height={70}
                                            className="w-[4.5rem] h-[4.5rem] object-contain rounded-sm border border-gray-200"
                                        />
                                    </div>
                                </div>
                            ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* 음식 카드 리스트 */}
            <div className="flex flex-col gap-4">
                {filteredItems.map((item, idx) => (
                    <div 
                        key={idx} 
                        className="border border-black rounded-xl shadow-md bg-white p-3 flex justify-between items-start"
                        onClick={() => router.push(`/restaurant/restaurant-detail?menu=${encodeURIComponent(item.menu)}`)}
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <span>{item.name}</span>
                                <span className="flex items-center gap-1 text-yellow-500 text-xs font-normal">
                                    ⭐ {item.rating} 
                                    <span className="text-yellow-500">({item.reviews})</span>
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">{item.address}</p>
                            <p className="text-blue-600 font-bold text-sm mb-1">{item.menu}</p>
                            <div className="flex gap-2 flex-wrap mt-1 text-xs">
                            {item.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="border border-blue-400 text-blue-400 rounded-full px-2 py-0.5"
                                >
                                {tag}
                                </span>
                            ))}
                            </div>
                        </div>
                        <div className="flex flex-col place-items-end gap-2">
                            <button>
                                <img src={'/Heart.svg'} alt="사용자필터" className="w-5 h-5"/>
                            </button>
                            <Image
                                src={item.image}
                                alt={item.menu}
                                width={70}
                                height={70}
                                className="w-[4.5rem] h-[4.5rem] object-contain rounded-sm border border-gray-200"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}