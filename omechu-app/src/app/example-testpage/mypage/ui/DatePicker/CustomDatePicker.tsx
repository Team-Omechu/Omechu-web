"use client";

import { useState, useEffect } from "react";

import { ko } from "date-fns/locale";
import DatePicker from "react-datepicker";

import { CustomInput } from "./CustomInput";
import { DatePickerHeader } from "./DatePickerHeader";

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
          renderCustomHeader={(props) => <DatePickerHeader {...props} />}
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
          renderCustomHeader={(props) => <DatePickerHeader {...props} />}
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
