"use client";

import Image from "next/image";
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  placeholder?: string;
  resetAfterSearch?: boolean;
  suggestionList?: string[];
}

const RECENT_KEY = "recent_search_terms"; // localStorage key 이름 상수화

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "검색어를 입력하세요.",
  resetAfterSearch = false,
  suggestionList = [],
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false); // input focus 여부
  const [recentSearches, setRecentSearches] = useState<string[]>([]); // 최근 검색어 목록 상태

  // 컴포넌트 마운트 시 최근 검색어 로컬스토리지에서 불러오기
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // 최근 검색어 저장 (중복 제거 + 최대 10개 유지)
  const saveRecent = (term: string) => {
    const cleaned = term.trim();
    if (cleaned.length < 2) return; // 1글자 이하 저장 방지

    const unique = Array.from(new Set([cleaned, ...recentSearches]));
    const updated = unique.slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  // Enter 키 입력 시 검색 실행 및 최근 검색어 저장
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() !== "") {
      saveRecent(value);
      onSearch();
      if (resetAfterSearch) {
        onChange({ target: { value: "" } } as ChangeEvent<HTMLInputElement>);
      }
    }
  };

  // 자동완성/최근 검색어 클릭 시 검색 실행
  const handleSuggestionClick = (item: string) => {
    onChange({ target: { value: item } } as ChangeEvent<HTMLInputElement>);
    saveRecent(item);
    onSearch();
  };

  // 특정 최근 검색어 삭제
  const removeRecent = (term: string) => {
    const updated = recentSearches.filter((t) => t !== term);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  // 자동완성 필터링 (입력값 포함 여부 기준)
  const filteredSuggestions = suggestionList.filter((item) =>
    item.toLowerCase().includes(value.toLowerCase())
  );

  // 자동완성 또는 최근 검색어 목록 보여줄지 여부
  const showSuggestions = isFocused && value.trim() !== "";
  const showRecent = showSuggestions && filteredSuggestions.length === 0;

  return (
    <section className="relative w-[340px]">
      {/* 검색 입력창 */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)} // blur 후 목록 닫힘 지연
        placeholder={placeholder}
        className="flex items-center w-full h-10 px-6 pr-10 bg-white border-2 border-black rounded-3xl"
      />

      {/* 검색 버튼 */}
      <button
        onClick={() => {
          if (value.trim() === "") return;
          saveRecent(value);
          onSearch();
          if (resetAfterSearch) {
            onChange({
              target: { value: "" },
            } as ChangeEvent<HTMLInputElement>);
          }
        }}
        className="absolute top-1.5 right-3 w-6 h-6"
        aria-label="검색"
      >
        <div className="relative w-full h-full">
          <Image src="/search.png" alt="검색" fill className="object-contain" />
        </div>
      </button>

      {/* 자동완성 or 최근 검색어 목록 */}
      {showSuggestions && (
        <ul className="absolute left-0 z-10 w-[92%] mx-3.5 bg-white border border-gray-300 rounded-md shadow-md top-full">
          {filteredSuggestions.length > 0 ? (
            // 자동완성 목록
            filteredSuggestions.map((item, idx) => (
              <li
                key={idx}
                onClick={() => handleSuggestionClick(item)}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {item}
              </li>
            ))
          ) : (
            <>
              {/* 최근 검색어 목록 */}
              <li className="px-4 py-2 text-sm font-bold text-gray-600">
                최근 검색어
              </li>
              {recentSearches.map((term, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  <span onClick={() => handleSuggestionClick(term)}>
                    {term}
                  </span>
                  <button
                    onClick={() => removeRecent(term)}
                    className="text-gray-500 hover:text-black"
                  >
                    ✕
                  </button>
                </li>
              ))}
              {recentSearches.length > 0 && (
                <li className="px-4 py-2 text-right">
                  <button
                    className="text-xs text-gray-500 hover:text-black"
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem(RECENT_KEY);
                    }}
                  >
                    닫기
                  </button>
                </li>
              )}
            </>
          )}
        </ul>
      )}
    </section>
  );
}
