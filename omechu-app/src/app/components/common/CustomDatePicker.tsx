"use client";

import { useState, useEffect, forwardRef } from "react";
import Image from "next/image";
import { ko } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomDatePickerProps {
  /** start, end 값이 변경될 때 실행되는 콜백 */
  onChange?: (start: Date | null, end: Date | null) => void;
  /** 초기 값(optional) */
  value?: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

export default function CustomDatePicker({
  onChange,
  value,
}: CustomDatePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(
    value?.startDate ?? null,
  );
  const [endDate, setEndDate] = useState<Date | null>(value?.endDate ?? null);

  // <input /> 커스터마이징
  const CustomInput = forwardRef<
    HTMLButtonElement,
    { value?: string; onClick?: React.MouseEventHandler<HTMLButtonElement> }
  >(({ value, onClick }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="flex h-fit w-32 items-center gap-2 rounded-md bg-[#F2F2F2] px-4 pb-1 pt-1.5 text-sm text-grey-darker shadow-sm"
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
        <span className="text-xl font-normal text-grey-darker">
          {`${year}년 ${month.toString().padStart(2, "0")}월`}
        </span>
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

  // 부모에 값 전달
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
          className="mr-4 mt-1 items-end text-xs text-gray-500"
        >
          선택 초기화
        </button>
      )}
    </section>
  );
}
