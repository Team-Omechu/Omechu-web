"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

type RouletteProps = {
  onStop: (angle: number) => void;
  disabled?: boolean;
};

export function Roulette({ onStop, disabled }: RouletteProps) {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    if (!spinning || disabled) return;

    const id = setInterval(() => {
      setAngle((prev) => (prev + 4) % 360);
    }, 16);

    return () => clearInterval(id);
  }, [spinning, disabled]);

  const handleStop = () => {
    if (disabled) return;
    setSpinning(false);
    onStop(angle);
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="relative h-76 w-76">
        <Image src="/menubattle/roulette.svg" alt="roulette" fill priority />

        {/* 회전하는 나침판 */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div className="absolute top-6 h-24 w-2 rounded-full bg-[#FF7A9E]" />
        </div>

        {/* 중앙 원 */}
        <div className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF7A9E]" />
      </div>

      <button
        onClick={handleStop}
        disabled={!spinning || disabled}
        className="mt-6 w-40 rounded-xl bg-[#FF7A9E] py-3 font-semibold text-white disabled:opacity-40"
      >
        STOP
      </button>
    </div>
  );
}
