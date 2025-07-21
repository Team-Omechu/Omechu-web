"use client";

import { useState } from "react";

const generateTimeOptions = () => {
  const times = [];
  for (let h = 0; h <= 23; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }
  return times;
};

export default function TimeDropdown({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const times = generateTimeOptions();

  return (
    <div className="relative w-[120px] text-sm">
      {label && <p className="mb-1 text-gray-700">{label}</p>}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left"
      >
        {value} <span className="float-right">▼</span>
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
          {times.map((time) => (
            <li
              key={time}
              className={`cursor-pointer px-3 py-2 hover:bg-[#F0F8FF] ${
                value === time ? "bg-[#e6f4ff] font-semibold" : ""
              }`}
              onClick={() => {
                onChange(time);
                setIsOpen(false);
              }}
            >
              {time}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
