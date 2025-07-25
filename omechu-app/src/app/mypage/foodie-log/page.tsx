"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import CustomDatePicker from "@/components/common/CustomDatePicker";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import Header from "@/components/common/Header";
import FoodieBox from "@/components/mypage/FoodieBox";

const PERIOD_OPTIONS = [
  "전체",
  "1주",
  "1개월",
  "3개월",
  "6개월",
  "1년",
  "직접입력",
];

const ITEMS_PER_PAGE = 10;
const LODAING_TIMEOUT = 1800;

export default function FoodieLog() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("전체");
  const [sortOrder, setSortOrder] = useState<"MostLogged" | "LatestLogged">(
    "MostLogged",
  );

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (!target.isIntersecting || isLoading) return;

      setIsLoading(true);
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE); // 필요한 만큼 늘리기
    },
    [isLoading],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px 0px 160px 0px",
      threshold: 0,
    });

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [observerCallback]);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), LODAING_TIMEOUT); // LODAING_TIMEOUT
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    setVisibleCount(5); // 초기화
  }, [selectedPeriod, sortOrder]); // 정렬/기간이 바뀌면 리셋
  return (
    <>
      <Header
        title={"먹부림 기록"}
        leftChild={
          <Link href={"/mypage"}>
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"뒤로가기"}
              width={22}
              height={30}
            />
          </Link>
        }
      />
      <main
        ref={mainRef}
        className="flex h-screen w-full flex-col overflow-y-auto px-4 scrollbar-hide"
      >
        {/* 기간 설정 Tab */}
        <section className="flex h-fit w-full items-center justify-center gap-0.5 px-1 pt-2">
          {PERIOD_OPTIONS.map((item, idx) => (
            <button
              key={`${item}-${idx}`}
              onClick={() => {
                setSelectedPeriod(item);
              }}
              className={`mx-0.5 px-1 pb-2 pt-1 text-base hover:bg-main-normalHover ${
                selectedPeriod === item
                  ? "border-b-[3px] border-black font-bold text-grey-darker"
                  : "font-normal text-[#716F6C]"
              }`}
            >
              {item}
            </button>
          ))}
        </section>
        {/* 기간 입력 Tab (직접입력일 때만 보여짐) */}
        {selectedPeriod === "직접입력" && (
          <section className="-mt-1 flex h-fit w-full items-center justify-center gap-3 border-t-[1px] border-grey-normalActive px-1 py-3">
            <CustomDatePicker />
          </section>
        )}

        {/* 필터 - 추천 순 | 최신 순 */}
        <section className="-mt-1 flex w-full justify-end gap-3 border-t-[1px] border-grey-normalActive py-4 pr-3 text-sm text-grey-normalActive">
          <button
            className={
              sortOrder === "MostLogged" ? "font-semibold text-grey-darker" : ""
            }
            onClick={() => setSortOrder("MostLogged")}
          >
            많이 먹은 순
          </button>
          <span>|</span>
          <button
            className={
              sortOrder === "LatestLogged"
                ? "font-semibold text-grey-darker"
                : ""
            }
            onClick={() => setSortOrder("LatestLogged")}
          >
            최근 먹은 순
          </button>
        </section>

        {/* FoodieLog List */}
        <section className="flex w-full items-center justify-center">
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            {Array.from({ length: visibleCount }).map((_, idx) => (
              <FoodieBox key={idx} />
            ))}
          </div>
        </section>
        <FloatingActionButton onClick={scrollToTop} className={"bottom-4"} />

        <div ref={loaderRef} className="h-[1px]" />

        {isLoading && (
          <div className="mt-4 flex h-20 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />
            <span className="ml-2 text-sm text-gray-600">로딩 중...</span>
          </div>
        )}
      </main>
    </>
  );
}
