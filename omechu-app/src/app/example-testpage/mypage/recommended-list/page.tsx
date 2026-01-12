"use client";

import { useState } from "react";

import { Header } from "@/shared_FSD/index";

import SelectTab from "../ui/SelectTab";

export default function RecommendedListPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <>
      <Header title="추천 목록 관리" isRightChild={true} />
      <main className="gap- relative mt-4 flex h-[91.5dvh] flex-col items-center px-5">
        <SelectTab
          tabs={["추천 목록", "제외 목록"]}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
      </main>
    </>
  );
}
