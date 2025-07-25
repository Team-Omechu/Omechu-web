"use client";

/*****************
//****** SearchBar 컴포넌트 부모 컴포넌트에서 아래 props를 넘겨줘야 함: ********
//**** - inputValue: string
          → 현재 input에 들어있는 값
//**** - setInputValue: (v: string) => void
          → input 값 바뀔 때 상태 업데이트
//**** - onSearch: (searchTerm: string) => void
          → Enter나 검색 버튼 누르면 실행됨
//**** - placeholder?: string
          → input에 표시되는 안내 문구 (선택)
//**** - suggestionList?: string[]
          → 자동완성용 추천어 리스트 (선택)
***********************/

import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";

import Image from "next/image";

interface SearchBarProps {
  inputValue: string;
  setInputValue: (v: string) => void;
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  suggestionList?: string[];
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

  // 최근 검색어 불러오기
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // 최근 검색어 저장 (중복 제거 + 최대 10개)
  const saveRecent = (term: string) => {
    const cleaned = term.trim();
    if (cleaned.length < 2) return;

    const unique = Array.from(new Set([cleaned, ...recentSearches]));
    const updated = unique.slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  // 검색 실행
  const handleSearch = (rawTerm: string) => {
    const trimmed = rawTerm.trim();

    // 빈 문자열이면 전체 목록 보기 용도
    if (trimmed === "") {
      if (lastSearchedRef.current === "") return;

      if (!isJustResetRef.current) {
        onSearch("");
        lastSearchedRef.current = "";
      }

      setSelectedIndex(-1);
      setIsFocused(false);
      return;
    }

    // 중복 검색 방지
    if (trimmed === lastSearchedRef.current) return;

    onSearch(trimmed);
    lastSearchedRef.current = trimmed;
    saveRecent(trimmed);
    isJustResetRef.current = true;
    setSelectedIndex(-1);
    setIsFocused(false);
  };

  // input 값 변경
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;

    if (isJustResetRef.current) {
      isJustResetRef.current = false;
      return;
    }

    setInputValue(next);
  };

  // 키보드 이벤트 처리
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const hasSuggestions = filteredSuggestions.length > 0;

    if (e.key === "ArrowDown" && hasSuggestions) {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredSuggestions.length);
    } else if (e.key === "ArrowUp" && hasSuggestions) {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? filteredSuggestions.length - 1 : prev - 1,
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

  // 추천어 클릭
  const handleSuggestionClick = (item: string) => {
    setInputValue(item);
    handleSearch(item);
  };

  // 최근 검색어 삭제
  const removeRecent = (term: string) => {
    const updated = recentSearches.filter((t) => t !== term);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  // 추천어 필터링
  const filteredSuggestions = suggestionList
    .filter((item) => item.toLowerCase().includes(inputValue.toLowerCase()))
    .slice(0, 10);

  return (
    <section className="relative w-[340px]">
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
        className={`flex h-10 w-full items-center rounded-t-3xl border-2 border-black bg-white px-6 pr-10 ${showSuggestions ? "" : "rounded-b-3xl"}`}
      />

      <button
        onClick={() => handleSearch(inputValue)}
        className="absolute right-3 top-1.5 h-6 w-6"
        aria-label="검색"
      >
        <div className="relative h-full w-full">
          <Image
            src="/search/search.svg"
            alt="검색"
            fill
            className="object-contain"
          />
        </div>
      </button>

      {showSuggestions && (
        <ul className="absolute left-0 top-full z-10 w-full rounded-b-3xl border-[2px] border-t-0 border-black bg-white shadow-md">
          {inputValue.trim() === "" ? (
            <>
              <li className="px-4 py-2 text-sm font-bold text-gray-600">
                최근 검색어
              </li>
              {recentSearches.map((term, idx) => (
                <li
                  key={idx}
                  className="flex cursor-pointer items-center justify-between px-4 py-2 text-sm hover:bg-gray-100"
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
                  className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 ${isSelected ? "bg-gray-100 font-semibold" : ""} ${isLast ? "rounded-b-3xl pb-3" : ""} `}
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
