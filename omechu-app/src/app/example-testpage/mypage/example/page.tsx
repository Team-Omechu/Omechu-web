"use client";

import { useCallback, useState } from "react";

import { Header } from "@/shared_FSD/index";

import { CustomDatePicker } from "../ui/CustomDatePicker";
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

type Period = (typeof PERIOD_OPTIONS)[number];
const INITIAL_VISIBLE = 9;

export default function ExamplePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("전체");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [range, setRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });

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
        <section className="-mt-1 flex h-40 w-full items-center justify-between border-t px-6 py-3">
          <CustomDatePicker onChange={handleDateRangeChange} />
        </section>
      )}
      <main className="flex flex-col items-center"></main>
    </>
  );
}
