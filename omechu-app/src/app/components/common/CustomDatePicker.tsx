"use client";

import { useState, forwardRef } from "react";

import Image from "next/image";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomDatePicker() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  // <input /> 커스터마이징
  const CustomInput = forwardRef<HTMLButtonElement, any>(
    ({ value, onClick }, ref) => (
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
    ),
  );
  CustomInput.displayName = "CustomInput";

  return (
    <section className="flex items-center justify-center w-full gap-4">
      <DatePicker
        selected={startDate}
        dateFormat="yyyy.MM.dd"
        customInput={<CustomInput />}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate ?? undefined}
      />
      <span> ~ </span>
      <DatePicker
        selected={startDate}
        dateFormat="yyyy.MM.dd"
        customInput={<CustomInput />}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate ?? undefined}
      />
    </section>
  );
}
