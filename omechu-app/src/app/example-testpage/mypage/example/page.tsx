"use client";

import { useCallback, useMemo, useState } from "react";

import clsx from "clsx";

import { Header } from "@/shared/index";

import { CustomDatePicker } from "../ui/DatePicker/CustomDatePicker";
import { MukburimFoodFoodBox } from "../ui/MukburimFoodBox";
import PeriodTap from "../ui/PeriodTap";

const PERIOD_OPTIONS = [
  "전체",
  "1주",
  "1개월",
  "3개월",
  "6개월",
  "1년",
  "직접입력",
] as const;

export const MUKBURIM_FOOD_MOCK_DATA = [
  {
    id: 1,
    title: "샤브샤브",
    frequency: "100",
    src: "/sample/sample-pasta.png",
  },
  {
    id: 2,
    title: "초밥",
    frequency: "42",
    src: "/sample/sample-pasta.png",
  },
  {
    id: 3,
    title: "라멘",
    frequency: "68",
    src: "/sample/sample-pasta.png",
  },
  {
    id: 4,
    title: "피자",
    frequency: "31",
    src: "/sample/sample-pasta.png",
  },
  {
    id: 5,
    title: "치킨",
    frequency: "55",
    src: "/sample/sample-pasta.png",
  },
  {
    id: 6,
    title: "파스타",
    frequency: "27",
    src: "/sample/sample-pasta.png",
  },
  {
    id: 7,
    title: "햄버거",
    frequency: "19",
    src: "/sample/sample-pasta.png",
  },
  {
    id: 8,
    title: "떡볶이",
    frequency: "73",
    src: "/sample/sample-pasta.png",
  },
  {
    id: 9,
    title: "삼겹살",
    frequency: "61",
    src: "/sample/sample-pasta.png",
  },
] as const;

type Period = (typeof PERIOD_OPTIONS)[number];
const INITIAL_VISIBLE = 9;

export default function ExamplePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("전체");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [range, setRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });

  type SortOrder = "MostLogged" | "LatestLogged";

  const [sortOrder, setSortOrder] = useState<SortOrder>("MostLogged");

  const supportsLatestSort = true;

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    setVisibleCount(INITIAL_VISIBLE);

    if (period !== "직접입력") {
      setRange({ startDate: null, endDate: null });
    }
  };
  const handleDateRangeChange = useCallback(
    (s: Date | null, e: Date | null) => {
      setRange((prev) => {
        const next = {
          startDate: s,
          endDate: e,
        };
        return prev.startDate === next.startDate &&
          prev.endDate === next.endDate
          ? prev
          : next;
      });
    },
    [],
  );

  return (
    <>
      <Header title="먹부림 기록" />
      <PeriodTap value={selectedPeriod} onChange={handlePeriodChange} />
      {selectedPeriod === "직접입력" && (
        <section className="-mt-1 flex h-fit w-full items-center justify-between border-t px-6 py-3">
          <CustomDatePicker onChange={handleDateRangeChange} />
        </section>
      )}
      <main className="flex flex-col items-center">
        {/* 정렬 */}
        <div>
          <section className="text-caption-2-medium mt-2 mb-3 flex w-full justify-end gap-2">
            <button
              className={
                sortOrder === "MostLogged"
                  ? "text-font-high"
                  : "text-font-extralow"
              }
              onClick={() => setSortOrder("MostLogged")}
            >
              많이 먹은 순
            </button>
            <span>|</span>
            <button
              disabled={!supportsLatestSort}
              title={
                !supportsLatestSort
                  ? "API에서 최근 시각 정보가 없어 정렬할 수 없습니다."
                  : undefined
              }
              className={clsx(
                sortOrder === "LatestLogged"
                  ? "text-font-high"
                  : "text-font-extralow",
                !supportsLatestSort ? "cursor-not-allowed opacity-50" : "",
              )}
              onClick={() => supportsLatestSort && setSortOrder("LatestLogged")}
            >
              최근 먹은 순
            </button>
          </section>

          {/* 먹부림 카드 */}
          <section className="grid grid-cols-3 gap-4.5">
            {MUKBURIM_FOOD_MOCK_DATA.map((item) => (
              <MukburimFoodFoodBox
                key={item.id}
                frequency={item.frequency}
                src={item.src}
                title={item.title}
              />
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
