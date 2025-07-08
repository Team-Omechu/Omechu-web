"use client";

import Image from "next/image";
import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";

interface SearchBarProps {
  inputValue: string;
  setInputValue: (v: string) => void;
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  suggestionList?: string[];
  isJustResetRef?: React.MutableRefObject<boolean>; // ✅ 추가
}

const RECENT_KEY = "recent_search_terms";

export default function SearchBar({
  inputValue,
  setInputValue,
  onSearch,
  placeholder = "검색어를 입력하세요.",
  suggestionList = [],
}: SearchBarProps) {
  const isJustResetRef = useRef(false);
  const lastSearchedRef = useRef("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const showSuggestions =
    isFocused && (inputValue.trim().length > 0 || recentSearches.length > 0);

  // 🔹 최근 검색어 불러오기
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // 🔹 최근 검색어 저장 (중복 제거 + 최대 10개)
  const saveRecent = (term: string) => {
    const cleaned = term.trim();
    if (cleaned.length < 2) return;

    const unique = Array.from(new Set([cleaned, ...recentSearches]));
    const updated = unique.slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  // 🔹 검색 실행
  // 🔹 handleSearch 내부에서도 "" 처리 제거
  const handleSearch = (rawTerm: string) => {
    const trimmed = rawTerm.trim();
    console.log(trimmed);

    // ✅ 1. 빈 문자열일 때 처리
    if (trimmed === "") {
      // ✅ 이미 직전에 ""로 검색했던 거면 무시
      if (lastSearchedRef.current === "") return;

      if (!isJustResetRef?.current) {
        onSearch(""); // 사용자 직접 초기화 의도 시에만
        lastSearchedRef.current = ""; // 이거 추가 꼭 필요!
      }

      setSelectedIndex(-1);
      setIsFocused(false);
      return;
    }

    // ✅ 2. 동일 검색어 반복 막기
    if (trimmed === lastSearchedRef.current) return;

    // ✅ 정상 검색 처리
    onSearch(trimmed);
    lastSearchedRef.current = trimmed;
    saveRecent(trimmed);
    isJustResetRef.current = true;
    setSelectedIndex(-1);
    setIsFocused(false);
  };

  // 🔹 input 변경
  // 🔹 input 변경
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;

    if (isJustResetRef?.current) {
      isJustResetRef.current = false;
      return;
    }

    setInputValue(next);
  };

  // 🔹 키보드 이벤트
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const hasSuggestions = filteredSuggestions.length > 0;

    if (e.key === "ArrowDown" && hasSuggestions) {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredSuggestions.length);
    } else if (e.key === "ArrowUp" && hasSuggestions) {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? filteredSuggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      const selected =
        selectedIndex >= 0 ? filteredSuggestions[selectedIndex] : inputValue;
      handleSearch(selected);
    } else if (e.key === "Escape") {
      setIsFocused(false);
      setSelectedIndex(-1);
    }
  };

  // 🔹 추천어 클릭
  const handleSuggestionClick = (item: string) => {
    setInputValue(item);
    handleSearch(item);
  };

  // 🔹 최근 검색어 제거
  const removeRecent = (term: string) => {
    const updated = recentSearches.filter((t) => t !== term);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  // 🔹 추천어 필터링
  const filteredSuggestions = suggestionList
    .filter((item) => item.toLowerCase().includes(inputValue.toLowerCase()))
    .slice(0, 10); // 🔥 최대 10개까지만!

  return (
    <section className="relative w-[340px]">
      {/* 입력창 */}
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setTimeout(() => {
            setIsFocused(false);
            setSelectedIndex(-1);
          }, 150);
        }}
        placeholder={placeholder}
        className={`flex items-center w-full h-10 px-6 pr-10 bg-white border-2 border-black rounded-t-3xl  
          ${showSuggestions ? "" : "rounded-b-3xl"}`}
      />

      {/* 검색 버튼 */}
      <button
        onClick={() => handleSearch(inputValue)}
        className="absolute top-1.5 right-3 w-6 h-6"
        aria-label="검색"
      >
        <div className="relative w-full h-full">
          <Image src="/search.png" alt="검색" fill className="object-contain" />
        </div>
      </button>

      {/* 추천어/최근검색어 드롭다운 */}
      {showSuggestions && (
        <ul className="absolute left-0 z-10 w-full bg-white shadow-md top-full border-t-0 border-[2px] border-black rounded-b-3xl">
          {inputValue.trim() === "" ? (
            <>
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
                <li className="flex justify-end px-4 py-2">
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
          ) : filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isLast = idx === filteredSuggestions.length - 1;

              return (
                <li
                  key={idx}
                  onClick={() => handleSuggestionClick(item)}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100
              ${isSelected ? "bg-gray-100 font-semibold" : ""}
              ${isLast ? "rounded-b-3xl pb-3" : ""}
            `}
                >
                  {item}
                </li>
              );
            })
          ) : (
            <li className="px-4 py-2 text-sm text-gray-500">
              일치하는 추천어가 없습니다
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
