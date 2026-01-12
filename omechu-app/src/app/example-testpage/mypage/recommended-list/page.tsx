"use client";

import { useState } from "react";

import { Header } from "@/shared_FSD/index";

import { SearchBar } from "../ui/SearchBar";
import SelectTab from "../ui/SelectTab";

export default function RecommendedListPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    console.log("검색 실행:", term);
  };
  return (
    <>
      <Header title="추천 목록 관리" isRightChild={true} />
      <main className="relative mt-2 flex h-[91.5dvh] flex-col items-center px-5">
        <SelectTab
          tabs={["추천 목록", "제외 목록"]}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
        <SearchBar
          inputValue={searchTerm}
          setInputValue={setSearchTerm}
          onSearch={handleSearch}
          className="mt-5"
        />
      </main>
    </>
  );
}
