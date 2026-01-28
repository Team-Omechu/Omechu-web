"use client";

import { useCallback, useState } from "react";

import { useRouter } from "next/navigation";

import clsx from "clsx";

import { MUKBURIM_FOOD_MOCK_DATA } from "@/shared/constants/mocks/mukburim";
import { PERIOD_OPTIONS } from "@/shared/constants/mypage";
import { Header } from "@/shared/index";
import {
  MukburimFoodBox,
  PeriodTap,
  CustomDatePicker,
} from "@/widgets/mypage/ui";

type Period = (typeof PERIOD_OPTIONS)[number];
const INITIAL_VISIBLE = 9;

export default function MukburimLogPage() {
  const router = useRouter();

  const [selectedPeriod, setSelectedPeriod] = useState<Period>("전체");
  const [_visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [_range, setRange] = useState<{
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
      <Header title="먹부림 기록" onBackClick={() => router.push("/mypage")} />
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
                  : "text-font-extra-low"
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
                  : "text-font-extra-low",
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
              <MukburimFoodBox
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
