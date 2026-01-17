"use client";

import { useState, useEffect } from "react";

import Image from "next/image";

import { ko } from "date-fns/locale";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { ArrowCalenderIcon } from "@/shared/assets/icons/mypage/ArrowCalenderIcon";

import { CustomInput } from "./CustomInput";

interface CustomDatePickerProps {
  onChange?: (start: Date | null, end: Date | null) => void;
  value?: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

export function CustomDatePicker({ onChange, value }: CustomDatePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(
    value?.startDate ?? null,
  );
  const [endDate, setEndDate] = useState<Date | null>(value?.endDate ?? null);

  const renderCustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
  }: {
    date: Date;
    decreaseMonth: () => void;
    increaseMonth: () => void;
  }) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return (
      <div className="flex items-center justify-between px-4">
        <button
          onClick={decreaseMonth}
          className="rounded-sm px-2 py-1 hover:bg-gray-200"
        >
          {/* <ArrowCalenderIcon className="h-6.5 w-3.5 rotate-180 transition-transform" /> */}
          <Image
            src="/arrow/left-calender-arrow.svg"
            alt="이전 달로 이동"
            width={14}
            height={26}
          />
        </button>
        <span className="text-grey-darker text-xl font-normal">
          {`${year}년 ${month.toString().padStart(2, "0")}월`}
        </span>
        <button
          onClick={increaseMonth}
          className="rounded-sm px-2 py-1 text-sm hover:bg-gray-200"
        >
          <ArrowCalenderIcon className="h-6.5 w-3.5" />
        </button>
      </div>
    );
  };

  useEffect(() => {
    onChange?.(startDate, endDate);
  }, [startDate, endDate, onChange]);

  return (
    <section className="flex w-full flex-col items-end">
      <section className="relative flex w-full items-center justify-center gap-4">
        <DatePicker
          selected={startDate}
          dateFormat="yyyy.MM.dd"
          customInput={<CustomInput />}
          onChange={(date) => {
            setStartDate(date);
            if (endDate && date && date > endDate) {
              setEndDate(null);
            }
          }}
          selectsStart
          startDate={startDate}
          endDate={endDate ?? undefined}
          renderCustomHeader={renderCustomHeader}
          popperPlacement="bottom-start"
          locale={ko}
        />
        <span> ~ </span>
        <DatePicker
          selected={endDate}
          dateFormat="yyyy.MM.dd"
          customInput={<CustomInput />}
          onChange={(date) => {
            if (startDate && date && date.getTime() < startDate.getTime())
              return;
            setEndDate(date);
          }}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate ?? undefined}
          renderCustomHeader={renderCustomHeader}
          popperPlacement="bottom-end"
          locale={ko}
        />
      </section>
      {startDate && endDate && (
        <button
          onClick={() => {
            setStartDate(null);
            setEndDate(null);
          }}
          className="mt-2 mr-1 items-end text-xs text-gray-500"
        >
          선택 초기화
        </button>
      )}
    </section>
  );
}
