"use client";

import { useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import FloatingActionButton from "@/app/components/common/FloatingActionButton";
import Header from "@/app/components/common/Header";
import FoodieBox from "@/app/components/mypage/FoodieBox";

export default function FoodieLog() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("전체");
  const [sortOrder, setSortOrder] = useState<"MostLogged" | "LatestLogged">(
    "MostLogged",
  );

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <Header
        title={"먹부림 기록"}
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
      <main ref={mainRef} className="flex h-screen w-full flex-col px-4">
        {/* 기간 설정 Tab */}
        <section className="flex h-fit w-full items-center justify-center gap-0.5 px-1 pt-3">
          {["전체", "1주", "1개월", "3개월", "6개월", "1년", "직접입력"].map(
            (item, idx) => (
              <button
                key={`${item}-${idx}`}
                onClick={() => {
                  setSelectedPeriod(item);
                }}
                className={`mx-0.5 mb-1 px-1 pt-1 text-base hover:bg-[#dfc0e6] ${
                  selectedPeriod === item
                    ? "border-b-[3px] border-black font-bold text-[#393939]"
                    : "font-normal text-[#716F6C]"
                }`}
              >
                {item}
              </button>
            ),
          )}
        </section>

        {/* 기간 입력 Tab */}
        <section className="flex h-fit w-full items-center justify-center gap-3 border-b-[1px] border-t-[1px] border-[#828282] px-1 py-3">
          <input type="date" />
          <span className="pt-1 text-base font-bold"> ~ </span>
          <input type="date" />
        </section>

        {/* 필터 - 추천 순 | 최신 순 */}
        <section className="flex w-full justify-end gap-3 py-4 pr-3 text-sm text-[#828282]">
          <button
            className={
              sortOrder === "MostLogged" ? "font-semibold text-[#393939]" : ""
            }
            onClick={() => setSortOrder("MostLogged")}
          >
            많이 먹은 순
          </button>
          <span>|</span>
          <button
            className={
              sortOrder === "LatestLogged" ? "font-semibold text-[#393939]" : ""
            }
            onClick={() => setSortOrder("LatestLogged")}
          >
            최근 먹은 순
          </button>
        </section>

        {/* FoodieLog List */}
        <section className="flex w-full items-center justify-center">
          <div className="grid grid-cols-3 gap-x-3 gap-y-2">
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
            <FoodieBox />
          </div>
        </section>
        <FloatingActionButton onClick={scrollToTop} />
      </main>
    </>
  );
}
