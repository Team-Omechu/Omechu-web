// 참고 : https://reactdatepicker.com/

"use client";

import { useState, useEffect, forwardRef } from "react";

import Image from "next/image";

import { ko } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomDatePicker() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // <input /> 커스터마이징
  const CustomInput = forwardRef<
    HTMLButtonElement,
    { value?: string; onClick?: React.MouseEventHandler<HTMLButtonElement> }
  >(({ value, onClick }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="flex h-fit w-32 items-center gap-2 rounded-md bg-[#F2F2F2] px-4 pb-1 pt-1.5 text-sm text-[#393939] shadow-sm"
    >
      <Image
        src="/calender/uil_calender.svg"
        alt="달력 아이콘"
        width={16}
        height={16}
      />
      {value || null}
    </button>
  ));
  CustomInput.displayName = "CustomInput";

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
          className="rounded px-2 py-1 hover:bg-gray-200"
        >
          <Image
            src="/arrow/left-calender-arrow.svg"
            alt="이전 달로 이동"
            width={14}
            height={26}
          />
        </button>
        <span className="text-xl font-normal text-[#393939]">{`${year}년 ${month.toString().padStart(2, "0")}월`}</span>
        <button
          onClick={increaseMonth}
          className="rounded px-2 py-1 text-sm hover:bg-gray-200"
        >
          <Image
            src="/arrow/right-calender-arrow.svg"
            alt="다음 달로 이동"
            width={14}
            height={26}
          />
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setEndDate(null);
    }
  }, [endDate, startDate]);

  return (
    <section className="flex w-full flex-col items-end">
      <section className="flex w-full items-center justify-center gap-4">
        <DatePicker
          selected={startDate}
          dateFormat="yyyy.MM.dd"
          customInput={<CustomInput />}
          onChange={(date) => setStartDate(date)}
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
            if (startDate && date && date < startDate) {
              alert("종료일은 시작일보다 빠를 수 없습니다.");
              return;
            }
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
          className="mr-4 mt-1 items-end text-xs text-gray-500"
        >
          선택 초기화
        </button>
      )}
    </section>
  );
}
