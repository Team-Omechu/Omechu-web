// ***************** SearchBar 사용법 ******************  //
// 1. 검색바를 렌더링 하는 부모 컴포넌트에서 정의해주세요(그냥 복붙하면 됩니다.)

// import { suggestionList } from "@/app/constant/suggestionList";

// const [searchTerm, setSearchTerm] = useState("");
// const [submittedTerm, setSubmittedTerm] = useState("");
// const resetAfterSearch = true; // 입력청 초기화 하기 위한 변수 초기화

// const handleSearch = () => {
//   setSubmittedTerm(searchTerm); // 검색 실행
//   console.log("검색 실행:", searchTerm);
//   if (resetAfterSearch) {
//     setSearchTerm(""); // 입력창 초기화
//   }
// };

// ***************** SearchBar 사용법 ******************  //

"use client";

import { useState } from "react";
import Image from "next/image";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center px-4 py-2 mt-6 mb-2 bg-white border border-gray-300 rounded-full">
        <input
          type="text"
          placeholder="음식명을 검색하세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow bg-transparent outline-none"
        />
        <button>🔍</button>
      </div>

      <div className="flex gap-2">
        <span className="px-3 py-1 text-sm bg-gray-200 rounded-full">혼자</span>
        <span className="px-3 py-1 text-sm bg-gray-200 rounded-full">저녁</span>
        <button className="ml-auto">
          <Image
            src={"/customselect.png"}
            alt="사용자필터"
            className="w-8 h-8"
          />
        </button>
      </div>
    </div>
  );
}
