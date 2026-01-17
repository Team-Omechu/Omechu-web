// DatePickerHeader.tsx
"use client";

import { useState } from "react";

import { getMonth, getYear } from "date-fns";

import { ArrowCalenderIcon } from "@/shared/assets/icons/mypage/ArrowCalenderIcon";

const months = Array.from({ length: 12 }, (_, i) => i + 1);
const years = Array.from({ length: 50 }, (_, i) => 2020 + i);

export function DatePickerHeader({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: any) {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const month = getMonth(date) + 1;
  const year = getYear(date);

  return (
    <div className="flex w-71.5 items-center justify-center gap-2 bg-white">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="flex h-8 w-8 items-center justify-center rounded-md disabled:opacity-30"
      >
        <ArrowCalenderIcon className="h-6 w-3 scale-x-[-1]" />
      </button>

      {/* 월 */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsMonthOpen((prev) => !prev)}
          className="border-font-disabled text-font-high flex h-7 w-22 items-center justify-between rounded-lg border px-2 text-sm"
        >
          <span>{month}월</span>
          <span className="text-xs">▼</span>
        </button>

        {isMonthOpen && (
          <div className="absolute top-full left-0 z-50 mt-2 grid w-40 grid-cols-3 gap-1 rounded-xl bg-white p-2 shadow-lg">
            {months.map((m) => (
              <button
                key={m}
                onClick={() => {
                  changeMonth(m - 1);
                  setIsMonthOpen(false);
                }}
                className={`rounded-md py-1 text-sm hover:bg-gray-100 ${
                  m === month
                    ? "bg-brand-primary hover:bg-brand-primary text-white"
                    : ""
                }`}
              >
                {m}월
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 연도 */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsYearOpen((prev) => !prev)}
          className="border-font-disabled text-font-high flex h-7 w-22 items-center justify-between rounded-lg border px-2 text-sm"
        >
          <span>{year}년</span>
          <span className="text-xs">▼</span>
        </button>

        {isYearOpen && (
          <div className="absolute top-full left-0 z-50 mt-2 max-h-60 w-24 overflow-y-auto rounded-xl bg-white p-2 shadow-lg">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => {
                  changeYear(y);
                  setIsYearOpen(false);
                }}
                className={`flex w-full justify-center rounded-md py-1 text-sm hover:bg-gray-100 ${
                  y === year
                    ? "bg-brand-primary hover:bg-brand-primary text-white"
                    : ""
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="flex h-8 w-8 items-center justify-center rounded-md disabled:opacity-30"
      >
        <ArrowCalenderIcon className="h-6 w-3" />
      </button>
    </div>
  );
}
