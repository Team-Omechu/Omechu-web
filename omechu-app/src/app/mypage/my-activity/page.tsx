"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import Header from "@/app/components/common/Header";
import SelectTabBar from "@/app/components/mypage/SelectTabBar";
import FoodReviewCard from "@/app/components/common/FoodReveiwCard";

export default function MyActivity() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState<"Recommended" | "Latest">(
    "Recommended",
  );

  return (
    <>
      <Header
        title={"활동 내역"}
        leftChild={
          <Link href={"/mypage"}>
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </Link>
        }
      />
      {/* 목록 정렬 탭 */}
      <SelectTabBar
        tabs={["리뷰", "등록한 맛집"]}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />
      <main className="flex min-h-full w-full flex-col items-center px-6 pb-8 pt-3">
        {/* 필터 - 추천 순 | 최신 순 */}
        <section className="flex w-full justify-end gap-1 pb-3 pr-1 pt-1 text-sm text-[#828282]">
          <button
            className={
              sortOrder === "Recommended" ? "font-semibold text-[#393939]" : ""
            }
            onClick={() => setSortOrder("Recommended")}
          >
            추천 순
          </button>
          <span>|</span>
          <button
            className={
              sortOrder === "Latest" ? "font-semibold text-[#393939]" : ""
            }
            onClick={() => setSortOrder("Latest")}
          >
            최신 순
          </button>
        </section>
        {/* 리뷰 카드 리스트 */}
        <section className="flex flex-col items-center gap-7">
          <FoodReviewCard />
          <FoodReviewCard />
          <FoodReviewCard />
        </section>
      </main>
    </>
  );
}
